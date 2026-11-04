/**
 * MCP & ChatGPT Plugin Handlers
 * Serves verified ground-truth data for Nagendra Kushwaha's AI/ML Portfolio
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  profileData,
  projectsData,
  skillsData,
  experienceData,
  certificationsData,
} from './portfolio-data.js';
import { KENNEDY_SYSTEM_PROMPT } from './systemPrompt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let openApiSchemaCache = null;
function getOpenApiSchema() {
  if (!openApiSchemaCache) {
    const p = path.join(__dirname, 'openapi.json');
    openApiSchemaCache = JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  return openApiSchemaCache;
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

// 1. OpenAPI Specification for ChatGPT Plugins & Custom GPT Actions
export function handleGetOpenApiSchema(_req, res) {
  const schema = getOpenApiSchema();
  sendJson(res, 200, schema);
}

// 2. Profile
export function handleGetProfile(_req, res) {
  sendJson(res, 200, profileData);
}

// 3. Projects (List + Filter)
export function handleGetProjects(_req, res, query = {}) {
  let list = [...projectsData];

  if (query.domain) {
    const d = query.domain.toLowerCase();
    list = list.filter((p) => p.domain.toLowerCase().includes(d));
  }

  if (query.search) {
    const s = query.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.shortDescription.toLowerCase().includes(s) ||
        p.technologies.some((t) => t.toLowerCase().includes(s))
    );
  }

  if (query.featured_only === 'true' || query.featured_only === true) {
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
    githubUrl: p.githubUrl,
    liveDemoUrl: p.liveDemoUrl,
    featured: p.featured,
  }));

  sendJson(res, 200, {
    total: summaries.length,
    projects: summaries,
  });
}

// 4. Project by Slug or ID
export function handleGetProjectBySlug(_req, res, slug) {
  const target = (slug || '').toLowerCase();
  const project = projectsData.find(
    (p) => p.slug.toLowerCase() === target || p.id.toLowerCase() === target
  );

  if (!project) {
    return sendJson(res, 404, {
      error: `Project not found with slug/id '${slug}'.`,
      availableSlugs: projectsData.map((p) => p.slug),
    });
  }

  sendJson(res, 200, project);
}

// 5. Skills
export function handleGetSkills(_req, res, query = {}) {
  let list = [...skillsData];

  if (query.category && query.category !== 'All') {
    const cat = query.category.toLowerCase();
    list = list.filter((s) => s.category.toLowerCase() === cat);
  }

  if (query.search) {
    const s = query.search.toLowerCase();
    list = list.filter(
      (item) =>
        item.name.toLowerCase().includes(s) ||
        item.description.toLowerCase().includes(s)
    );
  }

  const categories = [...new Set(skillsData.map((s) => s.category))];

  sendJson(res, 200, {
    total: list.length,
    categories,
    skills: list,
  });
}

// 6. Experience
export function handleGetExperience(_req, res, query = {}) {
  let list = [...experienceData];

  if (query.type) {
    const t = query.type.toLowerCase();
    list = list.filter((e) => e.type.toLowerCase() === t);
  }

  sendJson(res, 200, {
    total: list.length,
    experience: list,
  });
}

// 7. Certifications
export function handleGetCertifications(_req, res) {
  sendJson(res, 200, {
    total: certificationsData.length,
    certifications: certificationsData,
  });
}

// 8. Grounded AI Q&A via Mr. Kennedy
export async function handleMcpChat(_req, res, body = {}) {
  const question = (body.question || body.message || '').trim();
  if (!question) {
    return sendJson(res, 400, { error: 'Missing "question" field in request body.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: KENNEDY_SYSTEM_PROMPT },
            { role: 'user', content: question },
          ],
          temperature: 0.3,
          max_tokens: 600,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content || '';
        return sendJson(res, 200, {
          answer,
          sources: [
            'Nagendra Kushwaha Verified Portfolio Dossier',
            'Sam Global University Academic Records',
            'Projects Catalog (projects.ts)',
          ],
        });
      }
    } catch (err) {
      console.error('[MCP Chat] OpenAI API Error:', err);
    }
  }

  // Fallback grounded answer generator without requiring external API keys
  const qLower = question.toLowerCase();
  let answer = '';

  if (qLower.includes('cgpa') || qLower.includes('college') || qLower.includes('degree') || qLower.includes('university') || qLower.includes('education')) {
    answer = `Nagendra Kushwaha is pursuing his Bachelor of Technology (B.Tech) in Computer Science and Engineering at Sam Global University, Bhopal, Madhya Pradesh (2023–2027), with a verified Cumulative GPA (CGPA) of 7.85 / 10. His coursework includes Algorithms, Machine Learning, Deep Learning, DBMS, and NLP.`;
  } else if (qLower.includes('internship') || qLower.includes('experience') || qLower.includes('work') || qLower.includes('job')) {
    answer = `Nagendra worked as a Data Analytics Intern at UptoSkill (13 Dec 2025 – 13 Mar 2026), cleaning structured datasets, building preprocessing pipelines in Python (Pandas, NumPy), and designing executive dashboards in Power BI. He also completed the BCG Data Science Virtual Experience Program on Forage and currently mentors students at Internship Catalyst.`;
  } else if (qLower.includes('customer support') || qLower.includes('shopease') || qLower.includes('rag')) {
    answer = `The Customer Support Conversational AI (ShopEase) is an enterprise system combining fine-grained intent classification on the Banking77 benchmark (88.72% test accuracy, 88.76% Macro F1 across 77 classes) with grounded RAG vector search across 102 policy chunks. It features sub-180ms latency, prompt-injection defense, and PII masking. Live demo: https://customer-support-ai-6.onrender.com/`;
  } else if (qLower.includes('project') || qLower.includes('portfolio') || qLower.includes('build')) {
    answer = `Nagendra has engineered 12 end-to-end AI/ML projects, including:
1. Customer Support Conversational AI (Banking77, Grounded RAG, FastAPI)
2. SiperVision / SmartMed Medical Vision (93.6% Accuracy on RSNA radiographs)
3. Speech Emotion Recognition (0.80 AUC on CREMA-D 64-band Log-Mel)
4. Network Intrusion Detection (99.64% test accuracy on 2.26M rows of CIC-IDS2017)
5. Retail Sales Forecasting (XGBoost time-series regressor)
6. Autonomous Financial Advisor (LangGraph, FinBERT)
Ask about any specific project for architectural deep-dives!`;
  } else if (qLower.includes('contact') || qLower.includes('email') || qLower.includes('linkedin') || qLower.includes('hire') || qLower.includes('reach')) {
    answer = `You can connect directly with Nagendra Kushwaha via:
- Email: shibbuk707@gmail.com
- Phone: +91 8817036391
- LinkedIn: https://linkedin.com/in/nagendra-kushwaha-165ba2296
- GitHub: https://github.com/Nagendrakushwaha
- Location: Bhopal, Madhya Pradesh, India`;
  } else if (qLower.includes('skills') || qLower.includes('python') || qLower.includes('pytorch') || qLower.includes('stack')) {
    answer = `Nagendra possesses 57 verified technical skills spanning Python, PyTorch, Scikit-learn, FastAPI, Streamlit, Pandas, NumPy, RAG, Transformers, Docker, Power BI, SQL, and Git. His core specialization is Generative AI / LLM development, Deep Learning, and end-to-end Machine Learning systems.`;
  } else {
    answer = `Mr. Kennedy here! Nagendra Kushwaha is a final-year B.Tech CSE student (CGPA: 7.85/10) at Sam Global University specializing in Generative AI, RAG, Machine Learning, and Data Science. He has built 12 production-grade AI systems and completed an industry internship at UptoSkill. Feel free to ask about his projects, architecture designs, or technical competencies!`;
  }

  sendJson(res, 200, {
    answer,
    sources: ['Nagendra Kushwaha Portfolio Dossier', 'Ground-Truth Verification Engine'],
  });
}
