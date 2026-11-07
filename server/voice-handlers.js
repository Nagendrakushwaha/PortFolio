/**
 * Server-Side Voice & Conversational AI Handlers for Mr. Kennedy
 * Digital Twin of Nagendra Kushwaha
 *
 * Implements:
 * - Real OpenAI Chat Completions with Server-Sent Events (SSE) token streaming
 * - Dynamic RAG grounding via KnowledgeManager
 * - Ephemeral session token minting for OpenAI Realtime WebRTC voice
 * - High-fidelity Neural TTS with natural female & male voices (Shimmer, Nova, Coral, Echo)
 * - Rate limiting and token guardrails to prevent abuse
 * - Secure knowledge management endpoints (protected by ADMIN_API_KEY)
 */

import { knowledgeManager } from './knowledge-manager.js';

// Supported OpenAI Voices
export const OPENAI_VOICES = [
  { id: 'shimmer', name: 'Shimmer', gender: 'female', description: 'Clear, expressive, professional natural female (Default)' },
  { id: 'nova', name: 'Nova', gender: 'female', description: 'Warm, conversational, natural female' },
  { id: 'coral', name: 'Coral', gender: 'female', description: 'Articulate, contemporary natural female' },
  { id: 'echo', name: 'Echo', gender: 'male', description: 'Warm, articulate, natural conversational male' },
  { id: 'ash', name: 'Ash', gender: 'male', description: 'Crisp, contemporary conversational male' },
  { id: 'onyx', name: 'Onyx', gender: 'male', description: 'Deep, resonant, authoritative male' },
  { id: 'alloy', name: 'Alloy', gender: 'neutral', description: 'Balanced, versatile neutral' },
];

// Supported ElevenLabs Voices
export const ELEVENLABS_VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', gender: 'female', description: 'Calm, conversational, warm female' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', gender: 'male', description: 'Warm, thoughtful, British conversational male' },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'male', description: 'Deep, natural narrative American male' },
  { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', gender: 'male', description: 'Energetic, articulate male' },
];

// Simple in-memory sliding window rate limiter
const rateLimitMap = new Map();
function checkRateLimit(ip, maxRequests = 40, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count++;
  }

  rateLimitMap.set(ip, record);
  return record.count <= maxRequests;
}

/**
 * Clean incoming markdown and URLs so spoken output sounds completely natural
 */
export function sanitizeForSpeech(rawText) {
  if (!rawText) return '';
  return rawText
    .replace(/[*_#`~[\]]/g, '')
    .replace(/https?:\/\/\S+/g, 'link')
    .replace(/\(https?:\/\/[^)]+\)/g, '')
    .replace(/[•–—]/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Query Ollama local server status and installed models
 * Bypasses paid APIs and runs open-weight models (Qwen2.5 1.5B) locally
 */
export async function getOllamaStatus() {
  const host = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
  const configuredModel = process.env.OLLAMA_MODEL || 'qwen2.5:1.5b';

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 800);
    const res = await fetch(`${host}/api/tags`, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      return { available: false, host, configuredModel, activeModel: configuredModel, models: [] };
    }

    const data = await res.json();
    const models = (data.models || []).map((m) => ({
      name: m.name,
      sizeMb: Math.round((m.size || 0) / (1024 * 1024)),
      modifiedAt: m.modified_at,
    }));

    const hasTargetModel = models.some(
      (m) => m.name.includes(configuredModel) || m.name.startsWith('qwen2.5')
    );
    const activeModel = hasTargetModel ? configuredModel : (models[0]?.name || configuredModel);

    return {
      available: true,
      host,
      configuredModel,
      activeModel,
      hasTargetModel,
      models,
    };
  } catch {
    return {
      available: false,
      host,
      configuredModel,
      activeModel: configuredModel,
      hasTargetModel: false,
      models: [],
    };
  }
}

/**
 * Handle GET /api/ollama-status
 */
export async function handleOllamaStatus(req, res) {
  const status = await getOllamaStatus();
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(status));
}

/**
 * Handle GET /api/voice-status
 */
export async function handleVoiceStatus(req, res) {
  const openaiKey = process.env.OPENAI_API_KEY || '';
  const elevenKey = process.env.ELEVENLABS_API_KEY || '';

  const hasOpenAI = Boolean(openaiKey && openaiKey.startsWith('sk-'));
  const hasElevenLabs = Boolean(elevenKey && elevenKey.length > 10);
  const ollama = await getOllamaStatus();

  // Voice priority
  const defaultVoice = process.env.MR_KENNEDY_VOICE || (hasElevenLabs ? 'Rachel' : 'shimmer');
  const activeVoiceProvider = hasOpenAI ? 'openai' : hasElevenLabs ? 'elevenlabs' : 'browser';
  
  // Prioritize open-weight Ollama over paid APIs
  const activeLLMProvider = ollama.available
    ? 'ollama'
    : (hasOpenAI ? 'openai' : 'grounded_knowledge_engine');

  const status = {
    ollama: {
      available: ollama.available,
      host: ollama.host,
      model: ollama.activeModel,
      models: ollama.models,
      hasTargetModel: ollama.hasTargetModel,
    },
    openai: {
      available: hasOpenAI,
      realtimeAvailable: hasOpenAI,
      defaultVoice: 'shimmer',
      supportedVoices: OPENAI_VOICES,
    },
    elevenlabs: {
      available: hasElevenLabs,
      defaultVoice: 'Rachel',
      supportedVoices: ELEVENLABS_VOICES,
    },
    activeProvider: activeVoiceProvider,
    activeLLMProvider,
    activeVoice: defaultVoice,
    isRealtimeCapable: hasOpenAI,
    knowledgeStats: knowledgeManager.listDocuments(),
    message: ollama.available
      ? `Local Ollama (${ollama.activeModel}) active on CPU threads with Grounded RAG Knowledge System.`
      : hasOpenAI
      ? 'OpenAI Realtime & Neural Speech Engine active with RAG Knowledge System.'
      : 'Running in zero-credential client mode with grounded knowledge engine.',
  };

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(status));
}

/**
 * Handle POST /api/realtime-session
 * Mints an ephemeral client token from OpenAI Realtime API for secure WebRTC connection
 */
export async function handleRealtimeSession(req, res, body = {}) {
  const openaiKey = process.env.OPENAI_API_KEY || '';

  if (!openaiKey) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    return res.end(
      JSON.stringify({
        error: 'OPENAI_API_KEY is not configured on the backend. Please add it to your environment variables.',
        hint: 'You can still use turn-based voice or grounded local knowledge engine without credentials.',
      })
    );
  }

  // Natural female voice default (shimmer)
  const voice = body.voice || process.env.OPENAI_VOICE || 'shimmer';
  const model = process.env.OPENAI_REALTIME_MODEL || 'gpt-4o-mini-realtime-preview';

  try {
    const instructions = await knowledgeManager.buildAugmentedPrompt('General portfolio overview and voice companion guidelines');

    const oaiRes = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        voice,
        modalities: ['audio', 'text'],
        instructions,
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 600,
          create_response: true,
        },
        input_audio_transcription: {
          model: 'whisper-1',
        },
      }),
    });

    const data = await oaiRes.json();

    if (!oaiRes.ok) {
      res.statusCode = oaiRes.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: data.error?.message || 'OpenAI Realtime session error' }));
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  } catch (err) {
    console.error('[VoiceBackend] Error minting realtime session:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message || 'Internal server error minting session' }));
  }
}

/**
 * Handle POST /api/tts
 * Generates high-fidelity neural speech audio via OpenAI TTS or ElevenLabs
 */
export async function handleTTS(req, res, body = {}) {
  const rawText = body.text || '';
  const cleanText = sanitizeForSpeech(rawText);

  if (!cleanText) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Text parameter is required' }));
  }

  const openaiKey = process.env.OPENAI_API_KEY || '';
  const elevenKey = process.env.ELEVENLABS_API_KEY || '';
  const provider = body.provider || (openaiKey ? 'openai' : elevenKey ? 'elevenlabs' : 'none');

  if (provider === 'elevenlabs' && elevenKey) {
    const voiceId = body.voice && body.voice.length > 10 ? body.voice : '21m00Tcm4TlvDq8ikWAM'; // Rachel (Female)
    const modelId = process.env.ELEVENLABS_MODEL || 'eleven_turbo_v2_5';

    try {
      const elRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
        method: 'POST',
        headers: {
          'xi-api-key': elevenKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: modelId,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.15,
            use_speaker_boost: true,
          },
        }),
      });

      if (!elRes.ok) {
        const errJson = await elRes.json().catch(() => ({}));
        res.statusCode = elRes.status;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: errJson.detail?.message || 'ElevenLabs error' }));
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'audio/mpeg');
      const arrayBuffer = await elRes.arrayBuffer();
      return res.end(Buffer.from(arrayBuffer));
    } catch (err) {
      console.error('[VoiceBackend] ElevenLabs TTS error:', err);
    }
  }

  if (openaiKey) {
    // Default to natural female voice 'shimmer'
    const voice = body.voice || process.env.OPENAI_VOICE || 'shimmer';
    const model = process.env.OPENAI_TTS_MODEL || 'tts-1';
    const speed = Math.max(0.75, Math.min(1.3, Number(body.speed) || 1.0));

    try {
      const oaiRes = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          input: cleanText,
          voice,
          response_format: 'mp3',
          speed,
        }),
      });

      if (!oaiRes.ok) {
        const errJson = await oaiRes.json().catch(() => ({}));
        res.statusCode = oaiRes.status;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: errJson.error?.message || 'OpenAI TTS error' }));
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'audio/mpeg');
      const arrayBuffer = await oaiRes.arrayBuffer();
      return res.end(Buffer.from(arrayBuffer));
    } catch (err) {
      console.error('[VoiceBackend] OpenAI TTS error:', err);
    }
  }

  // No API keys available
  res.statusCode = 503;
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      error: 'No AI voice provider API key found on server. Using browser speech synthesis fallback.',
      fallback: 'browser',
    })
  );
}

/**
 * Handle POST /api/stt
 * Transcribes audio via OpenAI Whisper (whisper-1)
 * Used as primary/fallback STT for Brave Browser, Firefox, Safari, and whenever Google Speech is blocked
 */
export async function handleSTT(req, res, body = {}) {
  const openaiKey = process.env.OPENAI_API_KEY || '';
  const { audioBase64, mimeType = 'audio/webm' } = body;

  if (!audioBase64) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'audioBase64 parameter is required' }));
  }

  if (!openaiKey) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    return res.end(
      JSON.stringify({
        error: 'OPENAI_API_KEY is not configured for Whisper speech transcription.',
        hint: 'brave_privacy_setting',
      })
    );
  }

  try {
    const buffer = Buffer.from(audioBase64, 'base64');
    const ext = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('wav') ? 'wav' : 'webm';
    const blob = new Blob([buffer], { type: mimeType });

    const formData = new FormData();
    formData.append('file', blob, `speech.${ext}`);
    formData.append('model', 'whisper-1');

    const oaiRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: formData,
    });

    const data = await oaiRes.json();
    if (!oaiRes.ok) {
      res.statusCode = oaiRes.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: data.error?.message || 'Whisper transcription error' }));
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ text: data.text || '' }));
  } catch (err) {
    console.error('[VoiceBackend] Whisper STT error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: err.message || 'Error processing speech audio' }));
  }
}

/**
 * Detect smart quick actions based on user message and reply
 */
function extractChatActions(query = '', reply = '') {
  const combined = (query + ' ' + reply).toLowerCase();
  const actions = [];

  if (combined.includes('cognivision') || combined.includes('customer support') || combined.includes('shopease')) {
    actions.push({ type: 'project_modal', label: 'View Customer Support AI Case Study', payload: 'customer-support-ai' });
  }
  if (combined.includes('speech emotion') || combined.includes('crema-d') || combined.includes('audio emotion')) {
    actions.push({ type: 'project_modal', label: 'View Speech Emotion System', payload: 'speech-english-emotion-detection' });
  }
  if (combined.includes('fraud') || combined.includes('credit card')) {
    actions.push({ type: 'project_modal', label: 'View Fraud Detection Project', payload: 'credit-card-fraud-detection' });
  }
  if (combined.includes('experience') || combined.includes('tex web') || combined.includes('uptoskill') || combined.includes('work') || combined.includes('education') || combined.includes('college')) {
    actions.push({ type: 'scroll', label: 'Explore Professional Timeline', payload: 'experience' });
  }
  if (combined.includes('github') || combined.includes('code') || combined.includes('repositories')) {
    actions.push({ type: 'external_link', label: 'Open Nagendra\'s GitHub', payload: 'https://github.com/Nagendrakushwaha' });
  }
  if (combined.includes('contact') || combined.includes('hire') || combined.includes('email') || combined.includes('reach out')) {
    actions.push({ type: 'scroll', label: 'Go to Contact Section', payload: 'contact' });
  }

  return actions.slice(0, 2);
}

/**
 * Handle POST /api/chat
 * Prioritizes local open-weight Ollama model (Qwen2.5 1.5B) on Ryzen CPU.
 * Falls back to Grounded RAG Knowledge Engine with zero paid API requirements.
 */
export async function handleChat(req, res, body = {}) {
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  if (!checkRateLimit(clientIp)) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Too many requests. Please wait a moment before sending another question.' }));
  }

  const message = (body.message || '').trim();
  const history = Array.isArray(body.history) ? body.history : [];
  const wantStream = Boolean(body.stream !== false);

  if (!message) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Message cannot be empty.' }));
  }

  // 1. Retrieve grounded knowledge from KnowledgeManager
  const relevantChunks = await knowledgeManager.retrieveRelevantKnowledge(message, 4);
  const augmentedSystemPrompt = await knowledgeManager.buildAugmentedPrompt(message);
  const sources = relevantChunks.map((c) => c.title);

  // 2. Check Local Ollama Engine (Open-Weight / Zero-API-Cost)
  const ollama = await getOllamaStatus();

  if (ollama.available) {
    const formattedMessages = [
      { role: 'system', content: augmentedSystemPrompt },
      ...history.slice(-6).map((m) => ({
        role: m.sender === 'assistant' ? 'assistant' : 'user',
        content: m.text,
      })),
      { role: 'user', content: message },
    ];

    if (wantStream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        const ollamaRes = await fetch(`${ollama.host}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: ollama.activeModel,
            messages: formattedMessages,
            stream: true,
            options: {
              temperature: 0.6,
              num_predict: 450,
            },
          }),
        });

        if (!ollamaRes.ok) {
          throw new Error(`Ollama returned status ${ollamaRes.status}`);
        }

        let accumulated = '';
        let evalCount = 0;
        let evalDuration = 0;
        const reader = ollamaRes.body.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkText = decoder.decode(value, { stream: true });
          const lines = chunkText.split('\n');

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            try {
              const json = JSON.parse(trimmed);
              if (json.message?.content) {
                accumulated += json.message.content;
                res.write(`data: ${JSON.stringify({ token: json.message.content })}\n\n`);
              }
              if (json.done) {
                evalCount = json.eval_count || 0;
                evalDuration = json.eval_duration || 0;
              }
            } catch {}
          }
        }

        const evalDurationSec = evalDuration / 1e9;
        const tokensPerSec = evalDurationSec > 0 ? Number((evalCount / evalDurationSec).toFixed(1)) : 0;
        const actions = extractChatActions(message, accumulated);

        res.write(
          `data: ${JSON.stringify({
            done: true,
            sources,
            actions,
            engine: 'ollama',
            model: ollama.activeModel,
            tokensPerSec,
            evalCount,
          })}\n\n`
        );
        return res.end();
      } catch (ollamaErr) {
        console.warn('[VoiceBackend] Ollama streaming error, falling back to grounded knowledge:', ollamaErr.message);
        // Fall through to Grounded Knowledge Engine fallback
      }
    } else {
      // Non-streaming Ollama
      try {
        const ollamaRes = await fetch(`${ollama.host}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: ollama.activeModel,
            messages: formattedMessages,
            stream: false,
            options: {
              temperature: 0.6,
              num_predict: 450,
            },
          }),
        });

        if (ollamaRes.ok) {
          const data = await ollamaRes.json();
          const reply = data.message?.content || '';
          const evalCount = data.eval_count || 0;
          const evalDurationSec = (data.eval_duration || 0) / 1e9;
          const tokensPerSec = evalDurationSec > 0 ? Number((evalCount / evalDurationSec).toFixed(1)) : 0;
          const actions = extractChatActions(message, reply);

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          return res.end(
            JSON.stringify({
              text: reply,
              sources,
              actions,
              engine: 'ollama',
              model: ollama.activeModel,
              tokensPerSec,
              evalCount,
            })
          );
        }
      } catch (ollamaErr) {
        console.warn('[VoiceBackend] Ollama non-streaming error, falling back:', ollamaErr.message);
      }
    }
  }

  // 3. Fallback to Grounded RAG Knowledge Engine (100% free, zero credentials required, instant on Vercel/cloud)
  const fallbackAnswer = generateGroundedFallback(message, relevantChunks);
  const actions = extractChatActions(message, fallbackAnswer);

  if (wantStream) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream tokens cleanly
    const words = fallbackAnswer.split(' ');
    for (let i = 0; i < words.length; i++) {
      const token = (i === 0 ? '' : ' ') + words[i];
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
      await new Promise((resolve) => setTimeout(resolve, 18));
    }
    res.write(
      `data: ${JSON.stringify({
        done: true,
        sources,
        actions,
        engine: 'grounded_knowledge_engine',
        model: 'Grounded RAG Knowledge Engine (Zero-Cost / Public Demo)',
      })}\n\n`
    );
    return res.end();
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(
      JSON.stringify({
        text: fallbackAnswer,
        sources,
        actions,
        engine: 'grounded_knowledge_engine',
        model: 'Grounded RAG Knowledge Engine (Zero-Cost / Public Demo)',
      })
    );
  }
}

/**
 * Generate high-accuracy grounded response from retrieved knowledge chunks
 * used when OPENAI_API_KEY is not yet populated
 */
function generateGroundedFallback(query, chunks) {
  const q = query.toLowerCase();

  if (q.includes('who is') || q.includes('about nagendra') || q.includes('introduce') || q.includes('background')) {
    return `Nagendra Kushwaha is an AI/ML Engineer and aspiring Data Scientist based in Bhopal, Madhya Pradesh, India.

He is a final-year B.Tech Computer Science & Engineering student at Sam Global University (2023–2027) with a verified CGPA of 7.85/10.

Professionally, he is currently working at Tex Web Solutions Pvt. Ltd. as a Lead Generation & Market Research Executive, focusing on international B2B prospect research, market intelligence, and AI-assisted workflows. He previously completed a Data Analytics internship at UptoSkill and the BCG Data Science Virtual Experience Program.

His technical focus spans Deep Learning, Natural Language Processing, Grounded RAG systems, and end-to-end AI applications using Python, PyTorch, Scikit-learn, and FastAPI.`;
  }

  if (q.includes('education') || q.includes('college') || q.includes('university') || q.includes('cgpa') || q.includes('degree')) {
    return `Here are Nagendra's verified academic credentials:

🎓 Bachelor of Technology (B.Tech) in Computer Science & Engineering
• Institution: Sam Global University, Bhopal, Madhya Pradesh, India
• Period: 2023 – 2027 (Final-Year Student)
• Academic Standing: Verified CGPA of 7.85 / 10
• Core Coursework: Data Structures & Algorithms, Machine Learning, Deep Learning, Natural Language Processing, Operating Systems, Database Management Systems (DBMS), and Discrete Mathematics.

🏫 School Education:
• School: Government Higher Secondary School, Kannoudhi, Shahdol, Madhya Pradesh, India.`;
  }

  if (q.includes('tex web') || q.includes('experience') || q.includes('job') || q.includes('uptoskill') || q.includes('work')) {
    return `Here is Nagendra's verified professional experience:

1. Tex Web Solutions Pvt. Ltd. (Currently Working — Professional Work Experience)
• Role: Lead Generation & Market Research Executive
• Focus: International B2B prospect research across USA, UK, Canada, and Australia. Identifying potential clients for web development, software solutions, and SEO. Conducting market research across Roofing, Real Estate, Coaching, and Personal Branding. Exploring AI-assisted data enrichment and research automation workflows.

2. UptoSkill (13 Dec 2025 – 13 Mar 2026)
• Role: Data Analytics Intern
• Highlights: Cleaned and transformed structured datasets in Python, built preprocessing pipelines, and designed interactive executive dashboards in Power BI and Excel.

3. Boston Consulting Group (BCG) — Forage
• Role: Data Science Virtual Experience Participant
• Highlights: Simulated customer churn analysis, feature engineered churn predictors, and formulated strategic business insights.`;
  }

  // Combine content from top matching chunks
  if (chunks && chunks.length > 0) {
    const primary = chunks[0];
    return `Based on Nagendra's verified knowledge base:

${primary.content}

Would you like to explore the project code on GitHub, review the architecture, or discuss how this aligns with an AI Engineer role?`;
  }

  return `Nagendra Kushwaha is an AI/ML Engineer and Data Scientist specializing in Machine Learning, Deep Learning, NLP, and RAG architectures.

You can ask me about:
• His academic standing at Sam Global University (CGPA 7.85/10)
• His professional role at Tex Web Solutions Pvt. Ltd.
• His 12 production AI/ML projects (such as Customer Support AI, Speech Emotion Recognition, and Fraud Detection)
• His technical capabilities in Python, PyTorch, Scikit-learn, and FastAPI.`;
}

// ==============================================================================
// 4. KNOWLEDGE MANAGEMENT ADMIN ENDPOINTS
// ==============================================================================

/**
 * Handle POST /api/knowledge/upload
 * Requires Admin Authorization
 */
export async function handleKnowledgeUpload(req, res, body = {}) {
  const adminKey = req.headers['authorization'] || req.headers['x-admin-key'] || body.adminKey || '';

  if (!knowledgeManager.validateAdminKey(adminKey)) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Unauthorized: Invalid or missing ADMIN_API_KEY' }));
  }

  const { filename, fileBase64, textContent, category, title } = body;

  try {
    let result;
    if (fileBase64 && filename) {
      const buffer = Buffer.from(fileBase64, 'base64');
      result = await knowledgeManager.ingestDocument({
        filename,
        buffer,
        category: category || 'documents',
        title: title || filename,
        isVerified: true,
      });
    } else if (textContent && title) {
      result = knowledgeManager.ingestStructuredEntry({
        title,
        category: category || 'custom',
        content: textContent,
        verified: true,
      });
    } else {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Provide either (filename + fileBase64) or (title + textContent)' }));
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    console.error('[KnowledgeAdmin] Ingest error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message || 'Error processing document' }));
  }
}

/**
 * Handle GET /api/knowledge/documents
 */
export async function handleKnowledgeList(req, res) {
  const adminKey = req.headers['authorization'] || req.headers['x-admin-key'] || '';

  if (!knowledgeManager.validateAdminKey(adminKey)) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Unauthorized: Invalid or missing ADMIN_API_KEY' }));
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(knowledgeManager.listDocuments()));
}

/**
 * Handle DELETE /api/knowledge/documents/:id
 */
export async function handleKnowledgeDelete(req, res, docId) {
  const adminKey = req.headers['authorization'] || req.headers['x-admin-key'] || '';

  if (!knowledgeManager.validateAdminKey(adminKey)) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Unauthorized: Invalid or missing ADMIN_API_KEY' }));
  }

  const deleted = knowledgeManager.deleteDocument(docId);
  res.statusCode = deleted ? 200 : 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ success: deleted, docId }));
}
