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
} from './voice-handlers.js';

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
  console.log(`[Voice Config] OpenAI Key: ${process.env.OPENAI_API_KEY ? 'Configured (sk-...)' : 'Not set (Browser fallback active)'}`);
  console.log(`[Voice Config] ElevenLabs Key: ${process.env.ELEVENLABS_API_KEY ? 'Configured' : 'Not set'}`);
});
