import { handleKnowledgeList, handleKnowledgeDelete } from '../../server/voice-handlers.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleKnowledgeList(req, res);
  }
  if (req.method === 'DELETE') {
    const docId = req.query?.id || req.url.split('/').pop();
    return handleKnowledgeDelete(req, res, docId);
  }
  res.statusCode = 405;
  return res.end(JSON.stringify({ error: 'Method not allowed' }));
}

