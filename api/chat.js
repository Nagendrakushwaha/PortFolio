import { handleChat } from '../server/voice-handlers.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
  return handleChat(req, res, req.body || {});
}
