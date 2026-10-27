import { handleVoiceStatus } from '../server/voice-handlers.js';

export default async function handler(req, res) {
  return handleVoiceStatus(req, res);
}
