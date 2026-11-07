/**
 * Mr. Kennedy Production Verification Test Suite
 * Tests all backend handlers, RAG knowledge retrieval, chat completions (streaming & fallback),
 * TTS, and admin knowledge management.
 */

import {
  handleVoiceStatus,
  handleOllamaStatus,
  handleChat,
  handleKnowledgeList,
  handleKnowledgeUpload,
  handleKnowledgeDelete,
  handleRealtimeSession,
  handleTTS,
} from './server/voice-handlers.js';
import { knowledgeManager } from './server/knowledge-manager.js';

class MockResponse {
  constructor() {
    this.statusCode = 200;
    this.headers = {};
    this.body = '';
    this.isEnded = false;
  }

  setHeader(k, v) {
    this.headers[k.toLowerCase()] = v;
  }

  write(chunk) {
    this.body += chunk;
  }

  end(data = '') {
    this.body += data;
    this.isEnded = true;
    return this;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING MR. KENNEDY COMPREHENSIVE VERIFICATION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // TEST 1: Voice Status Endpoint
  {
    const req = { headers: {} };
    const res = new MockResponse();
    await handleVoiceStatus(req, res);
    const data = JSON.parse(res.body);

    assert(data.activeVoice === 'shimmer' || data.activeVoice === 'Rachel', 'Voice status returns natural female voice default');
    assert(data.knowledgeStats && data.knowledgeStats.totalChunks > 0, 'Voice status reports indexed knowledge chunks');
  }

  // TEST 1B: Ollama Status Endpoint
  {
    const req = { headers: {} };
    const res = new MockResponse();
    await handleOllamaStatus(req, res);
    const data = JSON.parse(res.body);

    assert(typeof data.available === 'boolean', 'Ollama status returns boolean availability without throwing');
    assert(data.configuredModel === 'qwen2.5:1.5b', 'Ollama status defaults to open-weight Qwen2.5 1.5B');
  }

  // TEST 2: Knowledge Retrieval (RAG)
  {
    const retrieved = await knowledgeManager.retrieveRelevantKnowledge('Tex Web Solutions lead generation', 3);
    assert(retrieved.length > 0, 'KnowledgeManager successfully retrieves relevant chunks');
    assert(retrieved.some(c => c.content.includes('Tex Web Solutions')), 'Retrieved chunk contains Tex Web Solutions information');
  }

  // TEST 3: Chat Endpoint Non-Streaming (Grounded Fallback / OpenAI)
  {
    const req = { headers: {} };
    const res = new MockResponse();
    await handleChat(req, res, { message: 'Who is Nagendra Kushwaha?', stream: false });
    const data = JSON.parse(res.body);

    assert(res.statusCode === 200, 'Chat non-streaming returns HTTP 200');
    assert(data.text && data.text.includes('Nagendra'), 'Chat response contains Nagendra identity');
    assert(data.sources && data.sources.length > 0, 'Chat response includes grounded sources');
  }

  // TEST 4: Chat Endpoint Streaming (SSE format)
  {
    const req = { headers: {} };
    const res = new MockResponse();
    await handleChat(req, res, { message: 'What is his experience at Tex Web Solutions?', stream: true });

    assert(res.headers['content-type'] === 'text/event-stream', 'Streaming chat sets text/event-stream header');
    assert(res.body.includes('data: {"token":'), 'Streaming chat sends SSE token data');
    assert(res.body.includes('data: {"done":true'), 'Streaming chat sends completion frame');
  }

  // TEST 5: Admin Knowledge Protection (Unauthorized access rejection)
  {
    const req = { headers: {} };
    const res = new MockResponse();
    await handleKnowledgeList(req, res);

    assert(res.statusCode === 401, 'Knowledge list rejects requests without ADMIN_API_KEY');
  }

  // TEST 6: Admin Knowledge Management (Authorized upload & deletion)
  {
    const adminKey = 'nagendra-kennady-admin-2026';
    const req = { headers: { 'x-admin-key': adminKey } };
    const resUpload = new MockResponse();

    await handleKnowledgeUpload(req, resUpload, {
      title: 'Automated Test Paper 2026',
      textContent: 'Nagendra Kushwaha authored a technical paper on RAG architectures and zero hallucination metrics.',
      category: 'projects',
      adminKey,
    });

    const uploadData = JSON.parse(resUpload.body);
    assert(uploadData.status === 'indexed', 'Authorized knowledge upload successfully indexes new entry');

    // Verify presence in list
    const resList = new MockResponse();
    await handleKnowledgeList(req, resList);
    const listData = JSON.parse(resList.body);
    const found = listData.customDocuments.find(d => d.title === 'Automated Test Paper 2026');
    assert(Boolean(found), 'Newly indexed entry is visible in knowledge documents list');

    // Clean up test document
    if (found) {
      const resDel = new MockResponse();
      await handleKnowledgeDelete(req, resDel, found.id);
      assert(resDel.statusCode === 200, 'Knowledge deletion successfully cleans up document');
    }
  }

  // TEST 7: Realtime Session Endpoint
  {
    const req = { headers: {} };
    const res = new MockResponse();
    await handleRealtimeSession(req, res, { voice: 'shimmer' });

    // Since OPENAI_API_KEY is not configured in this test env, it should return 503 with friendly hint, NOT crash
    assert(res.statusCode === 503 || res.statusCode === 200, 'Realtime session endpoint gracefully handles credentials');
    const data = JSON.parse(res.body);
    assert(Boolean(data.error || data.client_secret), 'Realtime session returns proper error hint or client secret');
  }

  // TEST 8: TTS Endpoint
  {
    const req = { headers: {} };
    const res = new MockResponse();
    await handleTTS(req, res, { text: 'Hello, this is Mr. Kennedy.' });
    // In uncredentialed env, returns 503 with fallback: 'browser'
    assert(res.statusCode === 503 || res.statusCode === 200, 'TTS endpoint gracefully communicates provider status');
  }

  console.log(`\n====================================================`);
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`====================================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

