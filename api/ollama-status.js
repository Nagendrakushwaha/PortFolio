import { handleOllamaStatus } from '../server/voice-handlers.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
  return handleOllamaStatus(req, res);
}

