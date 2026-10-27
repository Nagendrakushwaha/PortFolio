/**
 * Server-Side Voice Handlers for Mr. Kennedy AI Assistant
 * Compatible with Node.js HTTP, Express, Vite dev middleware, and serverless functions.
 * Securely uses backend API keys (OPENAI_API_KEY, ELEVENLABS_API_KEY).
 */

import { KENNEDY_SYSTEM_PROMPT } from './systemPrompt.js';

// Supported OpenAI Voices
export const OPENAI_VOICES = [
  { id: 'echo', name: 'Echo', gender: 'male', description: 'Warm, articulate, natural conversational male (Default)' },
  { id: 'ash', name: 'Ash', gender: 'male', description: 'Crisp, contemporary conversational male' },
  { id: 'onyx', name: 'Onyx', gender: 'male', description: 'Deep, resonant, authoritative male' },
  { id: 'fable', name: 'Fable', gender: 'male', description: 'Expressive British accent male' },
  { id: 'alloy', name: 'Alloy', gender: 'neutral', description: 'Balanced, versatile neutral' },
  { id: 'shimmer', name: 'Shimmer', gender: 'female', description: 'Clear, expressive female voice' },
];

// Supported ElevenLabs Voices
export const ELEVENLABS_VOICES = [
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', gender: 'male', description: 'Warm, thoughtful, British conversational male' },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'male', description: 'Deep, natural narrative American male' },
  { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', gender: 'male', description: 'Energetic, articulate male' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', gender: 'female', description: 'Calm, conversational female' },
];

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
 * Handle GET /api/voice-status
 */
export async function handleVoiceStatus(req, res) {
  const openaiKey = process.env.OPENAI_API_KEY || '';
  const elevenKey = process.env.ELEVENLABS_API_KEY || '';

  const hasOpenAI = Boolean(openaiKey && openaiKey.startsWith('sk-'));
  const hasElevenLabs = Boolean(elevenKey && elevenKey.length > 10);

  const defaultVoice = process.env.MR_KENNEDY_VOICE || (hasElevenLabs ? 'George' : 'echo');
  const activeProvider = hasOpenAI ? 'openai' : hasElevenLabs ? 'elevenlabs' : 'browser';

  const status = {
    openai: {
      available: hasOpenAI,
      realtimeAvailable: hasOpenAI,
      defaultVoice: 'echo',
      supportedVoices: OPENAI_VOICES,
    },
    elevenlabs: {
      available: hasElevenLabs,
      defaultVoice: 'George',
      supportedVoices: ELEVENLABS_VOICES,
    },
    activeProvider,
    activeVoice: defaultVoice,
    isRealtimeCapable: hasOpenAI,
    message: hasOpenAI
      ? 'OpenAI Realtime & Neural Voice active (Ultra-low latency male voice).'
      : hasElevenLabs
      ? 'ElevenLabs Neural Conversational Voice active.'
      : 'Running in zero-credential client mode with local knowledge engine and browser voice.',
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
        error: 'OPENAI_API_KEY is not configured on the backend. Please add it to your .env file.',
        hint: 'You can still use turn-based voice or local knowledge engine without credentials.',
      })
    );
  }

  const voice = body.voice || process.env.OPENAI_VOICE || 'echo';
  const model = process.env.OPENAI_REALTIME_MODEL || 'gpt-4o-mini-realtime-preview';

  try {
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
        instructions: KENNEDY_SYSTEM_PROMPT,
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
    // ElevenLabs TTS
    const voiceId = body.voice && body.voice.length > 10 ? body.voice : 'JBFqnCBsd6RMkjVDRZzb'; // George
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
    // OpenAI Speech Synthesis
    const voice = body.voice || process.env.OPENAI_VOICE || 'echo';
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
      error: 'No AI voice provider API key (OPENAI_API_KEY or ELEVENLABS_API_KEY) found on server.',
      fallback: 'browser',
    })
  );
}

/**
 * Handle POST /api/chat
 * Grounded LLM conversational proxy endpoint
 */
export async function handleChat(req, res, body = {}) {
  const openaiKey = process.env.OPENAI_API_KEY || '';
  const message = body.message || '';
  const history = body.history || [];

  if (!message.trim()) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Message is required' }));
  }

  if (!openaiKey) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'OPENAI_API_KEY not configured for LLM chat proxy' }));
  }

  const formattedMessages = [
    { role: 'system', content: KENNEDY_SYSTEM_PROMPT },
    ...history.slice(-8).map((m) => ({
      role: m.sender === 'assistant' ? 'assistant' : 'user',
      content: m.text,
    })),
    { role: 'user', content: message },
  ];

  try {
    const oaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',
        messages: formattedMessages,
        temperature: 0.6,
        max_tokens: 450,
      }),
    });

    const data = await oaiRes.json();
    if (!oaiRes.ok) {
      res.statusCode = oaiRes.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: data.error?.message || 'Chat completion error' }));
    }

    const reply = data.choices?.[0]?.message?.content || '';
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ text: reply }));
  } catch (err) {
    console.error('[VoiceBackend] Chat completion error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message || 'Internal chat error' }));
  }
}
