/**
 * Voice Service Client & Knowledge API Bridge for Mr. Kennedy
 * Handles communication with backend AI voice, speech, streaming LLM chat,
 * and secure Knowledge Management endpoints.
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
  knowledgeStats?: {
    totalDocuments: number;
    totalChunks: number;
    baseDossierChunks: number;
    customDocuments: any[];
  };
  message?: string;
}

export interface RealtimeSessionResponse {
  client_secret?: {
    value: string;
    expires_at: number;
  };
  error?: string;
}

export interface ChatStreamCallbacks {
  onToken: (token: string) => void;
  onDone: (meta: { sources?: string[]; actions?: any[] }) => void;
  onError: (error: string) => void;
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
  public async getVoiceStatus(forceRefresh = false): Promise<VoiceProviderStatus> {
    if (!forceRefresh && this.statusCache) return this.statusCache;
    if (!forceRefresh && this.statusPromise) return this.statusPromise;

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

      // Default fallback profile (Natural female voice 'shimmer' by default)
      const fallback: VoiceProviderStatus = {
        openai: {
          available: false,
          realtimeAvailable: false,
          defaultVoice: 'shimmer',
          supportedVoices: [
            { id: 'shimmer', name: 'Shimmer', gender: 'female', description: 'Clear, expressive, professional natural female (Default)' },
            { id: 'nova', name: 'Nova', gender: 'female', description: 'Warm, conversational, natural female' },
            { id: 'coral', name: 'Coral', gender: 'female', description: 'Articulate, contemporary natural female' },
            { id: 'echo', name: 'Echo', gender: 'male', description: 'Warm, articulate, natural conversational male' },
            { id: 'ash', name: 'Ash', gender: 'male', description: 'Clear, modern conversational male' },
            { id: 'onyx', name: 'Onyx', gender: 'male', description: 'Deep, resonant, authoritative male' },
            { id: 'alloy', name: 'Alloy', gender: 'neutral', description: 'Balanced, versatile neutral' },
          ],
        },
        elevenlabs: {
          available: false,
          defaultVoice: 'Rachel',
          supportedVoices: [
            { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', gender: 'female', description: 'Calm, conversational, warm female' },
            { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', gender: 'male', description: 'Warm, thoughtful, British conversational male' },
            { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'male', description: 'Deep narrative American voice' },
            { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', gender: 'male', description: 'Engaging, crisp conversational male' },
          ],
        },
        activeProvider: 'browser',
        activeVoice: 'shimmer',
        isRealtimeCapable: false,
        message: 'Running in zero-credential client mode with grounded knowledge engine.',
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
    const { text, voice = 'shimmer', provider = 'openai', speed = 1.0 } = options;

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
  public async createRealtimeSession(voice = 'shimmer'): Promise<RealtimeSessionResponse | null> {
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
   * Real-time Streaming Chat with Server-Sent Events (SSE)
   */
  public streamChat(
    message: string,
    history: Array<{ sender: string; text: string }> = [],
    callbacks: ChatStreamCallbacks,
    signal?: AbortSignal
  ): () => void {
    let isAborted = false;

    (async () => {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream, application/json',
          },
          body: JSON.stringify({ message, history, stream: true }),
          signal,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          callbacks.onError(errData.error || `Server responded with status ${res.status}`);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          callbacks.onError('ReadableStream not supported by browser environment.');
          return;
        }

        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (!isAborted) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              const dataStr = trimmed.slice(6);
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.error) {
                  callbacks.onError(parsed.error);
                  return;
                }
                if (parsed.token) {
                  callbacks.onToken(parsed.token);
                }
                if (parsed.done) {
                  callbacks.onDone({ sources: parsed.sources, actions: parsed.actions });
                  return;
                }
              } catch {
                // Ignore non-json lines
              }
            }
          }
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return;
        }
        callbacks.onError(err.message || 'Error communicating with AI assistant.');
      }
    })();

    return () => {
      isAborted = true;
    };
  }

  /**
   * Non-streaming fallback chat query
   */
  public async queryChat(
    message: string,
    history: Array<{ sender: string; text: string }> = []
  ): Promise<{ text: string; sources?: string[]; actions?: any[]; error?: string } | null> {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ message, history, stream: false }),
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (err: any) {
      console.warn('[VoiceService] /api/chat error:', err);
    }
    return null;
  }

  // ==============================================================================
  // KNOWLEDGE MANAGEMENT ADMIN CLIENT METHODS
  // ==============================================================================

  public async uploadKnowledge(data: {
    filename?: string;
    fileBase64?: string;
    textContent?: string;
    category?: string;
    title?: string;
    adminKey: string;
  }): Promise<{ status: string; document?: any; message?: string; chunksCreated?: number; error?: string }> {
    try {
      const res = await fetch('/api/knowledge/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.adminKey}`,
          'x-admin-key': data.adminKey,
        },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (err: any) {
      return { status: 'error', error: err.message || 'Network error uploading knowledge' };
    }
  }

  public async listKnowledge(adminKey: string): Promise<any> {
    try {
      const res = await fetch('/api/knowledge/documents', {
        headers: {
          'Authorization': `Bearer ${adminKey}`,
          'x-admin-key': adminKey,
        },
      });
      return await res.json();
    } catch (err: any) {
      return { error: err.message || 'Network error listing knowledge' };
    }
  }

  public async deleteKnowledge(docId: string, adminKey: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/knowledge/documents/${docId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminKey}`,
          'x-admin-key': adminKey,
        },
      });
      const data = await res.json();
      return Boolean(data.success);
    } catch {
      return false;
    }
  }
}

export const voiceService = VoiceServiceClient.getInstance();
