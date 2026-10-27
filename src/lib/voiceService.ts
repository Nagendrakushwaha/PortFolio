/**
 * Voice Service Client
 * Handles communication with backend AI voice and speech endpoints (/api/tts, /api/realtime-session, /api/stt, /api/voice-status)
 * Never exposes API keys or secrets on the frontend.
 */

export interface VoiceProviderStatus {
  openai: {
    available: boolean;
    realtimeAvailable: boolean;
    defaultVoice: string;
    supportedVoices: Array<{ id: string; name: string; gender: 'male' | 'female' | 'neutral'; description: string }>;
  };
  elevenlabs: {
    available: boolean;
    defaultVoice: string;
    supportedVoices: Array<{ id: string; name: string; gender: 'male' | 'female' | 'neutral'; description: string }>;
  };
  activeProvider: 'openai' | 'elevenlabs' | 'browser';
  activeVoice: string;
  isRealtimeCapable: boolean;
  message?: string;
}

export interface RealtimeSessionResponse {
  client_secret?: {
    value: string;
    expires_at: number;
  };
  error?: string;
}

export class VoiceServiceClient {
  private static instance: VoiceServiceClient;
  private statusCache: VoiceProviderStatus | null = null;
  private statusPromise: Promise<VoiceProviderStatus> | null = null;

  public static getInstance(): VoiceServiceClient {
    if (!VoiceServiceClient.instance) {
      VoiceServiceClient.instance = new VoiceServiceClient();
    }
    return VoiceServiceClient.instance;
  }

  /**
   * Fetch current backend voice capabilities and configured providers
   */
  public async getVoiceStatus(): Promise<VoiceProviderStatus> {
    if (this.statusCache) return this.statusCache;
    if (this.statusPromise) return this.statusPromise;

    this.statusPromise = (async () => {
      try {
        const res = await fetch('/api/voice-status', {
          headers: { 'Accept': 'application/json' },
        });

        if (res.ok) {
          const data = await res.json();
          this.statusCache = data;
          return data;
        }
      } catch (err) {
        console.warn('[VoiceService] /api/voice-status not available, using default client profile:', err);
      }

      // Default fallback profile if backend endpoint is unavailable or running purely static
      const fallback: VoiceProviderStatus = {
        openai: {
          available: false,
          realtimeAvailable: false,
          defaultVoice: 'echo',
          supportedVoices: [
            { id: 'echo', name: 'Echo', gender: 'male', description: 'Warm, articulate, natural conversational male' },
            { id: 'ash', name: 'Ash', gender: 'male', description: 'Clear, modern conversational male' },
            { id: 'onyx', name: 'Onyx', gender: 'male', description: 'Deep, resonant, authoritative male' },
            { id: 'fable', name: 'Fable', gender: 'male', description: 'Expressive British accent male' },
            { id: 'alloy', name: 'Alloy', gender: 'neutral', description: 'Balanced, versatile neutral' },
          ],
        },
        elevenlabs: {
          available: false,
          defaultVoice: 'George',
          supportedVoices: [
            { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', gender: 'male', description: 'Warm, thoughtful, natural cadence' },
            { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'male', description: 'Deep narrative American voice' },
            { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', gender: 'male', description: 'Engaging, crisp conversational male' },
          ],
        },
        activeProvider: 'browser',
        activeVoice: 'echo',
        isRealtimeCapable: false,
        message: 'Running in zero-credential client mode with local grounded knowledge engine.',
      };

      this.statusCache = fallback;
      return fallback;
    })();

    return this.statusPromise;
  }

  /**
   * Synthesize natural speech audio via backend TTS endpoint
   * Returns ArrayBuffer of MP3/WAV audio if successful, or null if provider is unavailable
   */
  public async synthesizeSpeech(options: {
    text: string;
    voice?: string;
    provider?: 'openai' | 'elevenlabs' | 'browser';
    speed?: number;
  }): Promise<ArrayBuffer | null> {
    const { text, voice = 'echo', provider = 'openai', speed = 1.0 } = options;

    if (!text.trim()) return null;

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg, audio/wav, application/json',
        },
        body: JSON.stringify({
          text,
          voice,
          provider,
          speed,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        console.warn(`[VoiceService] TTS endpoint returned status ${res.status}:`, errorText);
        return null;
      }

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        if (json.error) {
          console.warn('[VoiceService] TTS backend returned error:', json.error);
          return null;
        }
      }

      const buffer = await res.arrayBuffer();
      return buffer.byteLength > 0 ? buffer : null;
    } catch (err) {
      console.warn('[VoiceService] Failed to synthesize speech via /api/tts:', err);
      return null;
    }
  }

  /**
   * Mint an ephemeral token for OpenAI Realtime WebRTC voice session
   */
  public async createRealtimeSession(voice = 'echo'): Promise<RealtimeSessionResponse | null> {
    try {
      const res = await fetch('/api/realtime-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ voice }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to mint realtime session' }));
        return err;
      }

      return await res.json();
    } catch (err: any) {
      console.warn('[VoiceService] Realtime session minting error:', err);
      return { error: err.message || 'Network error reaching /api/realtime-session' };
    }
  }

  /**
   * Transcribe audio blob via OpenAI Whisper endpoint
   */
  public async transcribeAudio(audioBlob: Blob): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'speech.webm');

      const res = await fetch('/api/stt', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        return data.text || null;
      }
    } catch (err) {
      console.warn('[VoiceService] Whisper transcription failed:', err);
    }
    return null;
  }

  /**
   * Query conversational LLM proxy endpoint with portfolio grounding
   */
  public async queryChat(
    message: string,
    history: Array<{ sender: string; text: string }> = []
  ): Promise<{ text: string; error?: string } | null> {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ message, history }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          return { text: data.text };
        }
      }
    } catch (err) {
      console.warn('[VoiceService] /api/chat error, falling back to local knowledge engine:', err);
    }
    return null;
  }
}

export const voiceService = VoiceServiceClient.getInstance();
