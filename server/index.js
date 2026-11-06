/**
 * Standalone Node.js Backend Server for Mr. Kennedy AI Voice Companion
 * Run with: node server/index.js
 */

import http from 'http';
import {
  handleVoiceStatus,
  handleRealtimeSession,
  handleTTS,
  handleChat,
  handleKnowledgeUpload,
  handleKnowledgeList,
  handleKnowledgeDelete,
} from './voice-handlers.js';
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

const PORT = process.env.PORT || 3001;

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

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  try {
    if (url.pathname === '/api/voice-status' && req.method === 'GET') {
      return await handleVoiceStatus(req, res);
    }

    if (url.pathname === '/api/realtime-session' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      return await handleRealtimeSession(req, res, body);
    }

    if (url.pathname === '/api/tts' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      return await handleTTS(req, res, body);
    }

    if (url.pathname === '/api/chat' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      return await handleChat(req, res, body);
    }

    // ==========================================
    // Knowledge Management Endpoints (Admin Protected)
    // ==========================================
    if (url.pathname === '/api/knowledge/upload' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      return await handleKnowledgeUpload(req, res, body);
    }

    if (url.pathname === '/api/knowledge/documents' && req.method === 'GET') {
      return await handleKnowledgeList(req, res);
    }

    if (url.pathname.startsWith('/api/knowledge/documents/') && req.method === 'DELETE') {
      const docId = url.pathname.replace('/api/knowledge/documents/', '');
      return await handleKnowledgeDelete(req, res, docId);
    }

    // ==========================================
    // MCP & ChatGPT Plugin Endpoints
    // ==========================================
    if (url.pathname === '/api/mcp/openapi.json' || url.pathname === '/openapi.json') {
      return handleGetOpenApiSchema(req, res);
    }

    if (url.pathname === '/api/mcp/profile') {
      return handleGetProfile(req, res);
    }

    if (url.pathname === '/api/mcp/projects') {
      const query = Object.fromEntries(url.searchParams.entries());
      return handleGetProjects(req, res, query);
    }

    if (url.pathname.startsWith('/api/mcp/projects/')) {
      const slug = url.pathname.replace('/api/mcp/projects/', '');
      return handleGetProjectBySlug(req, res, slug);
    }

    if (url.pathname === '/api/mcp/skills') {
      const query = Object.fromEntries(url.searchParams.entries());
      return handleGetSkills(req, res, query);
    }

    if (url.pathname === '/api/mcp/experience') {
      const query = Object.fromEntries(url.searchParams.entries());
      return handleGetExperience(req, res, query);
    }

    if (url.pathname === '/api/mcp/certifications') {
      return handleGetCertifications(req, res);
    }

    if (url.pathname === '/api/mcp/chat' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      return await handleMcpChat(req, res, body);
    }

    // 404
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: `Not found: ${url.pathname}` }));
  } catch (err) {
    console.error('[Server] Uncaught error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
  }
});

server.listen(PORT, () => {
  console.log(`[Mr. Kennedy Voice Server] Running at http://localhost:${PORT}`);
  console.log(`[ChatGPT Plugin / OpenAPI Schema]: http://localhost:${PORT}/api/mcp/openapi.json`);
  console.log(`[Voice Config] OpenAI Key: ${process.env.OPENAI_API_KEY ? 'Configured (sk-...)' : 'Not set (Browser fallback active)'}`);
  console.log(`[Voice Config] ElevenLabs Key: ${process.env.ELEVENLABS_API_KEY ? 'Configured' : 'Not set'}`);
});
