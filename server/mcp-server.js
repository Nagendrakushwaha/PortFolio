#!/usr/bin/env node
/**
 * Model Context Protocol (MCP) Server for Nagendra Kushwaha's AI/ML Portfolio
 * Supports:
 * 1. STDIO Transport (Claude Desktop, Cursor, Windsurf, ChatGPT Desktop Local Tools)
 * 2. HTTP / SSE & REST Transport (ChatGPT Custom GPT Actions, Plugins, Web MCP)
 *
 * Usage:
 * - STDIO Mode (default): node server/mcp-server.js
 * - HTTP / ChatGPT Plugin Mode: node server/mcp-server.js --http --port 3001
 */

import readline from 'readline';
import http from 'http';
import {
  profileData,
  projectsData,
  skillsData,
  experienceData,
  certificationsData,
} from './portfolio-data.js';
import {
  handleGetOpenApiSchema,
  handleGetProfile,
  handleGetProjects,
  handleGetProjectBySlug,
  handleGetSkills,
  handleGetExperience,
  handleGetCertifications,
  handleMcpChat,
} from './mcp-handlers.js';
import { KENNEDY_SYSTEM_PROMPT } from './systemPrompt.js';

const PROTOCOL_VERSION = '2024-11-05';
const SERVER_INFO = {
  name: 'nagendra-kushwaha-portfolio-mcp',
  version: '1.0.0',
};

// ==========================================
// 1. MCP Tools Definitions
// ==========================================
const MCP_TOOLS = [
  {
    name: 'get_profile',
    description: "Get Nagendra Kushwaha's verified professional profile, biography, contact information, CGPA (7.85/10), education, and resume download links.",
    inputSchema: {
      type: 'object',
      properties: {
        include_resumes: {
          type: 'boolean',
          description: 'Whether to include download URLs and filenames for AI/ML and Data Science resumes',
        },
      },
    },
  },
  {
    name: 'list_projects',
    description: 'List all 12 verified AI/ML, NLP, Computer Vision, and Data Science projects created by Nagendra. Supports filtering by domain, featured status, or search query.',
    inputSchema: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          description: "Domain filter (e.g., 'Artificial Intelligence', 'Machine Learning', 'Data Science')",
        },
        search: {
          type: 'string',
          description: 'Keyword search in titles, descriptions, and technology stacks',
        },
        featured_only: {
          type: 'boolean',
          description: 'Filter only featured flagship projects',
        },
      },
    },
  },
  {
    name: 'get_project_details',
    description: 'Get deep technical architecture, problem statement, objective, dataset metrics, and GitHub/demo links for a specific project by slug or ID.',
    inputSchema: {
      type: 'object',
      required: ['slug_or_id'],
      properties: {
        slug_or_id: {
          type: 'string',
          description: "Project slug or ID (e.g., 'customer-support-ai', 'sipervision-medical-imaging', 'speech-emotion-recognition', 'network-intrusion-detection', 'retail-sales-forecast')",
        },
      },
    },
  },
  {
    name: 'search_skills',
    description: "Search and inspect Nagendra's 57 technical skills categorized by Programming, Machine Learning, Deep Learning, NLP, Generative AI, Data, and Tools.",
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: "Skill category: 'Programming', 'Machine Learning', 'Deep Learning', 'NLP', 'Generative AI', 'Data', 'Tools', or 'All'",
        },
        search: {
          type: 'string',
          description: 'Keyword to search for a specific library or framework (e.g. PyTorch, LangChain, RAG)',
        },
      },
    },
  },
  {
    name: 'get_experience',
    description: 'Retrieve verified industry experience: Data Analytics Intern at UptoSkill, Data Science Simulation at BCG (Forage), and Technical Mentor at Internship Catalyst.',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description: "Filter by type: 'internship', 'virtual_experience', 'mentorship', or 'all'",
        },
      },
    },
  },
  {
    name: 'get_education_and_certifications',
    description: 'Retrieve Nagendra’s verified academic degrees (B.Tech at Sam Global University, CGPA: 7.85) and verified professional certifications.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'ask_kennedy_ai',
    description: "Ask a question to Mr. Kennedy, Nagendra's AI representative, grounded 100% in verified facts from Nagendra's portfolio, research, and engineering background.",
    inputSchema: {
      type: 'object',
      required: ['question'],
      properties: {
        question: {
          type: 'string',
          description: "Technical or career question about Nagendra's background, projects, or skills",
        },
      },
    },
  },
];

// ==========================================
// 2. MCP Resources Definitions
// ==========================================
const MCP_RESOURCES = [
  {
    uri: 'portfolio://profile',
    name: 'Nagendra Kushwaha Profile Dossier',
    description: 'Complete biography, academic details, contacts, and resume links',
    mimeType: 'application/json',
  },
  {
    uri: 'portfolio://projects',
    name: 'Verified AI/ML Projects Catalog',
    description: 'Complete catalog of 12 real engineering projects and verified test metrics',
    mimeType: 'application/json',
  },
  {
    uri: 'portfolio://skills',
    name: '57 Technical Skills Inventory',
    description: 'Inventory of core and working competencies across AI, ML, DL, and Data',
    mimeType: 'application/json',
  },
  {
    uri: 'portfolio://experience',
    name: 'Professional History & Mentorship',
    description: 'Work history, corporate simulations, and pedagogical mentorship',
    mimeType: 'application/json',
  },
  {
    uri: 'portfolio://certifications',
    name: 'Industry Specializations & Certifications',
    description: 'Recognized professional credentials from DeepLearning.AI, Stanford, and Michigan',
    mimeType: 'application/json',
  },
];

// ==========================================
// 3. MCP Prompts Definitions
// ==========================================
const MCP_PROMPTS = [
  {
    name: 'interview_nagendra',
    description: 'System prompt and candidate dossier for conducting a technical interview with Nagendra Kushwaha for AI/ML roles.',
    arguments: [
      {
        name: 'role_focus',
        description: "Target focus: 'Generative AI', 'Machine Learning', 'Data Science', or 'General'",
        required: false,
      },
    ],
  },
  {
    name: 'summarize_qualifications',
    description: 'Executive summary of Nagendra Kushwaha’s technical qualifications and engineering achievements for hiring managers.',
    arguments: [],
  },
];

// ==========================================
// 4. MCP Tool Execution Logic
// ==========================================
function executeTool(name, args = {}) {
  switch (name) {
    case 'get_profile': {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(profileData, null, 2),
          },
        ],
      };
    }

    case 'list_projects': {
      let list = [...projectsData];
      if (args.domain) {
        const d = args.domain.toLowerCase();
        list = list.filter((p) => p.domain.toLowerCase().includes(d));
      }
      if (args.search) {
        const s = args.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(s) ||
            p.shortDescription.toLowerCase().includes(s) ||
            p.technologies.some((t) => t.toLowerCase().includes(s))
        );
      }
      if (args.featured_only) {
        list = list.filter((p) => p.featured);
      }

      const summaries = list.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        domain: p.domain,
        tag: p.tag,
        shortDescription: p.shortDescription,
        technologies: p.technologies,
        metrics: p.metrics.map((m) => `${m.label}: ${m.value}`),
        githubUrl: p.githubUrl,
        liveDemoUrl: p.liveDemoUrl,
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ total: summaries.length, projects: summaries }, null, 2),
          },
        ],
      };
    }

    case 'get_project_details': {
      const target = (args.slug_or_id || '').toLowerCase();
      const project = projectsData.find(
        (p) => p.slug.toLowerCase() === target || p.id.toLowerCase() === target
      );

      if (!project) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Project not found for identifier '${args.slug_or_id}'. Available slugs: ${projectsData.map((p) => p.slug).join(', ')}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(project, null, 2),
          },
        ],
      };
    }

    case 'search_skills': {
      let list = [...skillsData];
      if (args.category && args.category !== 'All') {
        const cat = args.category.toLowerCase();
        list = list.filter((s) => s.category.toLowerCase() === cat);
      }
      if (args.search) {
        const s = args.search.toLowerCase();
        list = list.filter(
          (item) =>
            item.name.toLowerCase().includes(s) ||
            item.description.toLowerCase().includes(s)
        );
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ total: list.length, skills: list }, null, 2),
          },
        ],
      };
    }

    case 'get_experience': {
      let list = [...experienceData];
      if (args.type && args.type !== 'all') {
        const t = args.type.toLowerCase();
        list = list.filter((e) => e.type.toLowerCase() === t);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ total: list.length, experience: list }, null, 2),
          },
        ],
      };
    }

    case 'get_education_and_certifications': {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                education: profileData.education,
                certifications: certificationsData,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case 'ask_kennedy_ai': {
      const q = (args.question || '').toLowerCase();
      let text = '';
      if (q.includes('cgpa') || q.includes('college') || q.includes('degree')) {
        text = `Nagendra Kushwaha is a B.Tech CSE student (2023–2027) at Sam Global University, Bhopal, India, with a verified CGPA of 7.85 / 10.`;
      } else if (q.includes('internship') || q.includes('uptoskill')) {
        text = `Nagendra worked as a Data Analytics Intern at UptoSkill (13 Dec 2025 – 13 Mar 2026), building preprocessing pipelines in Python (Pandas, NumPy) and creating Power BI executive reports.`;
      } else if (q.includes('project') || q.includes('rag') || q.includes('support')) {
        text = `Nagendra built the ShopEase Conversational AI using Llama 3, LangChain, FAISS vector search, and FastAPI, achieving 88.72% test accuracy on Banking77 across 77 classes and sub-180ms retrieval. Live demo: https://customer-support-ai-6.onrender.com/`;
      } else {
        text = `Nagendra Kushwaha is an AI/ML Engineer and Data Scientist specializing in Generative AI, RAG systems, and Deep Learning with 12 verified production projects. Feel free to query get_project_details or search_skills for complete technical depth.`;
      }
      return {
        content: [
          {
            type: 'text',
            text,
          },
        ],
      };
    }

    default:
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Unknown tool: ${name}`,
          },
        ],
      };
  }
}

// ==========================================
// 5. MCP Resource Read Logic
// ==========================================
function readResource(uri) {
  switch (uri) {
    case 'portfolio://profile':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(profileData, null, 2),
          },
        ],
      };
    case 'portfolio://projects':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(projectsData, null, 2),
          },
        ],
      };
    case 'portfolio://skills':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(skillsData, null, 2),
          },
        ],
      };
    case 'portfolio://experience':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(experienceData, null, 2),
          },
        ],
      };
    case 'portfolio://certifications':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(certificationsData, null, 2),
          },
        ],
      };
    default:
      throw new Error(`Resource not found: ${uri}`);
  }
}

// ==========================================
// 6. JSON-RPC Message Dispatcher
// ==========================================
function handleJsonRpcMessage(message) {
  const { id, method, params } = message;

  switch (method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: {
            tools: {},
            resources: {},
            prompts: {},
          },
          serverInfo: SERVER_INFO,
        },
      };

    case 'notifications/initialized':
      return null; // Notifications do not return responses

    case 'ping':
      return { jsonrpc: '2.0', id, result: {} };

    case 'tools/list':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          tools: MCP_TOOLS,
        },
      };

    case 'tools/call': {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      const result = executeTool(toolName, toolArgs);
      return {
        jsonrpc: '2.0',
        id,
        result,
      };
    }

    case 'resources/list':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          resources: MCP_RESOURCES,
        },
      };

    case 'resources/read': {
      try {
        const result = readResource(params?.uri);
        return { jsonrpc: '2.0', id, result };
      } catch (err) {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32602, message: err.message },
        };
      }
    }

    case 'prompts/list':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          prompts: MCP_PROMPTS,
        },
      };

    case 'prompts/get': {
      const promptName = params?.name;
      if (promptName === 'interview_nagendra') {
        const role = params?.arguments?.role_focus || 'AI/ML Engineer & Data Scientist';
        return {
          jsonrpc: '2.0',
          id,
          result: {
            description: `Interview prompt for ${role}`,
            messages: [
              {
                role: 'system',
                content: {
                  type: 'text',
                  text: `${KENNEDY_SYSTEM_PROMPT}\n\nYou are interviewing Nagendra Kushwaha for the role of ${role}. Ask incisive questions regarding his RAG architecture, CNN/BiLSTM acoustic feature extraction, handling class imbalance with SMOTE/LightGBM, and real-time inference latency optimization.`,
                },
              },
            ],
          },
        };
      }

      if (promptName === 'summarize_qualifications') {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            description: "Executive summary of Nagendra's qualifications",
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Please generate a structured executive summary of Nagendra Kushwaha's engineering credentials, including his B.Tech CSE degree (CGPA 7.85), UptoSkill internship, 12 production-grade AI projects, and 57 technical competencies.`,
                },
              },
            ],
          },
        };
      }

      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Prompt not found: ${promptName}` },
      };
    }

    default:
      if (id !== undefined) {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not found: ${method}` },
        };
      }
      return null;
  }
}

// ==========================================
// 7. STDIO Mode Runner
// ==========================================
function startStdioServer() {
  process.stderr.write(`[MCP Server] Starting in STDIO mode (${SERVER_INFO.name} v${SERVER_INFO.version})...\n`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  rl.on('line', (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    try {
      const message = JSON.parse(trimmed);
      const response = handleJsonRpcMessage(message);
      if (response) {
        process.stdout.write(JSON.stringify(response) + '\n');
      }
    } catch (err) {
      process.stderr.write(`[MCP Error] Failed to parse JSON-RPC line: ${err.message}\n`);
    }
  });

  process.stderr.write('[MCP Server] Listening on STDIN. Ready for Claude, Cursor, Windsurf, or ChatGPT Desktop.\n');
}

// ==========================================
// 8. HTTP / ChatGPT Plugin Mode Runner
// ==========================================
function startHttpServer(port = 3001) {
  function parseJsonBody(req) {
    return new Promise((resolve) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        try {
          resolve(data ? JSON.parse(data) : {});
        } catch {
          resolve({});
        }
      });
    });
  }

  const server = http.createServer(async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    const host = req.headers.host || `localhost:${port}`;
    const url = new URL(req.url, `http://${host}`);
    const pathname = url.pathname;

    try {
      // 1. OpenAPI Specification for ChatGPT Plugins & Custom GPTs
      if (pathname === '/api/mcp/openapi.json' || pathname === '/openapi.json') {
        return handleGetOpenApiSchema(req, res);
      }

      // 2. Profile
      if (pathname === '/api/mcp/profile') {
        return handleGetProfile(req, res);
      }

      // 3. Projects
      if (pathname === '/api/mcp/projects') {
        const query = Object.fromEntries(url.searchParams.entries());
        return handleGetProjects(req, res, query);
      }

      if (pathname.startsWith('/api/mcp/projects/')) {
        const slug = pathname.replace('/api/mcp/projects/', '');
        return handleGetProjectBySlug(req, res, slug);
      }

      // 4. Skills
      if (pathname === '/api/mcp/skills') {
        const query = Object.fromEntries(url.searchParams.entries());
        return handleGetSkills(req, res, query);
      }

      // 5. Experience
      if (pathname === '/api/mcp/experience') {
        const query = Object.fromEntries(url.searchParams.entries());
        return handleGetExperience(req, res, query);
      }

      // 6. Certifications
      if (pathname === '/api/mcp/certifications') {
        return handleGetCertifications(req, res);
      }

      // 7. Grounded AI Chat
      if (pathname === '/api/mcp/chat' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        return await handleMcpChat(req, res, body);
      }

      // 8. MCP over HTTP (JSON-RPC POST)
      if (pathname === '/mcp' && req.method === 'POST') {
        const message = await parseJsonBody(req);
        const response = handleJsonRpcMessage(message);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.end(JSON.stringify(response || {}));
      }

      // Root endpoint: quick status & directory of endpoints
      if (pathname === '/' || pathname === '/api/mcp') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.end(
          JSON.stringify(
            {
              service: 'Nagendra Kushwaha Portfolio MCP & ChatGPT Plugin Server',
              version: '1.0.0',
              status: 'running',
              documentation: {
                openApiSchema: `http://${host}/api/mcp/openapi.json`,
                chatGptPluginGuide: 'Import the OpenAPI schema URL in ChatGPT Custom Actions',
              },
              endpoints: [
                `GET http://${host}/api/mcp/openapi.json`,
                `GET http://${host}/api/mcp/profile`,
                `GET http://${host}/api/mcp/projects`,
                `GET http://${host}/api/mcp/projects/:slug`,
                `GET http://${host}/api/mcp/skills`,
                `GET http://${host}/api/mcp/experience`,
                `GET http://${host}/api/mcp/certifications`,
                `POST http://${host}/api/mcp/chat`,
                `POST http://${host}/mcp (JSON-RPC 2.0)`,
              ],
            },
            null,
            2
          )
        );
      }

      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: `Not found: ${pathname}` }));
    } catch (err) {
      console.error('[HTTP Error]', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err.message || 'Server error' }));
    }
  });

  server.listen(port, () => {
    console.log(`[MCP & ChatGPT Plugin Server] Running at http://localhost:${port}`);
    console.log(`[OpenAPI Schema for ChatGPT]: http://localhost:${port}/api/mcp/openapi.json`);
    console.log(`[MCP JSON-RPC Endpoint]: http://localhost:${port}/mcp`);
  });
}

// ==========================================
// 9. CLI Argument Parser & Entry Point
// ==========================================
const args = process.argv.slice(2);
const isHttp = args.includes('--http') || args.includes('-h');
const portArgIdx = args.findIndex((a) => a === '--port' || a === '-p');
const customPort = portArgIdx !== -1 && args[portArgIdx + 1] ? parseInt(args[portArgIdx + 1], 10) : 3001;

if (isHttp) {
  startHttpServer(customPort);
} else {
  startStdioServer();
}

