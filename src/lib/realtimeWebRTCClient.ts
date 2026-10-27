/**
 * Realtime WebRTC Client for OpenAI Realtime Voice API
 * Establishes low-latency, full-duplex conversational audio connection using ephemeral session tokens.
 * Intercepts remote audio track with Web Audio API for mouth lip-sync and viseme rendering.
 */

import { audioLipSync, type LipSyncCallback } from './audioLipSync';
import { voiceService } from './voiceService';

export interface RealtimeClientCallbacks {
  onStateChange?: (state: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  onUserTranscript?: (text: string, isFinal: boolean) => void;
  onAssistantTranscript?: (text: string, isFinal: boolean) => void;
  onAssistantSpeechStarted?: () => void;
  onAssistantSpeechEnded?: () => void;
  onUserSpeechStarted?: () => void; // Interruption / barge-in event
  onError?: (error: string) => void;
  onLipSyncFrame?: LipSyncCallback;
}

export class RealtimeWebRTCClient {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private localStream: MediaStream | null = null;
  private remoteAudioElement: HTMLAudioElement | null = null;
  private callbacks: RealtimeClientCallbacks = {};
  private isConnected = false;
  private isMuted = false;
  private currentAssistantTranscript = '';

  constructor(callbacks: RealtimeClientCallbacks = {}) {
    this.callbacks = callbacks;
  }

  public setCallbacks(callbacks: RealtimeClientCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Start WebRTC real-time voice session
   */
  public async connect(selectedVoice = 'echo'): Promise<boolean> {
    this.disconnect();
    this.callbacks.onStateChange?.('connecting');

    try {
      // 1. Mint ephemeral session token from backend
      const sessionData = await voiceService.createRealtimeSession(selectedVoice);
      if (!sessionData || sessionData.error || !sessionData.client_secret?.value) {
        throw new Error(sessionData?.error || 'Unable to mint realtime session from backend.');
      }
      const ephemeralKey = sessionData.client_secret.value;

      // 2. Capture microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      this.localStream = stream;

      // 3. Initialize RTCPeerConnection
      const pc = new RTCPeerConnection();
      this.pc = pc;

      // Create hidden audio element for remote stream output
      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      (audioEl as any).playsInline = true;
      this.remoteAudioElement = audioEl;

      // Listen for remote audio track from OpenAI
      pc.ontrack = (event) => {
        const remoteStream = event.streams[0];
        audioEl.srcObject = remoteStream;

        // Attach remote audio stream to Web Audio Analyser for dynamic lip-sync
        audioLipSync.attachMediaStream(remoteStream, (frame) => {
          this.callbacks.onLipSyncFrame?.(frame);
        });
      };

      // Add local microphone audio track to WebRTC connection
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Setup Data Channel for bidirectional events
      const dc = pc.createDataChannel('oai-events');
      this.dc = dc;

      dc.onopen = () => {
        this.isConnected = true;
        this.callbacks.onStateChange?.('connected');
      };

      dc.onclose = () => {
        this.isConnected = false;
        this.callbacks.onStateChange?.('disconnected');
      };

      dc.onmessage = (e) => {
        this.handleServerEvent(JSON.parse(e.data));
      };

      // 4. Create and set local SDP Offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 5. Send SDP offer to OpenAI Realtime endpoint
      const baseUrl = 'https://api.openai.com/v1/realtime';
      const model = 'gpt-4o-mini-realtime-preview';
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          'Authorization': `Bearer ${ephemeralKey}`,
          'Content-Type': 'application/sdp',
        },
      });

      if (!sdpResponse.ok) {
        const errText = await sdpResponse.text();
        throw new Error(`OpenAI Realtime SDP handshake failed (${sdpResponse.status}): ${errText}`);
      }

      const answerSdp = await sdpResponse.text();
      const answer: RTCSessionDescriptionInit = {
        type: 'answer',
        sdp: answerSdp,
      };

      await pc.setRemoteDescription(answer);
      this.isConnected = true;
      this.callbacks.onStateChange?.('connected');
      return true;
    } catch (err: any) {
      console.warn('[RealtimeWebRTC] Connection failed:', err);
      this.callbacks.onError?.(err.message || 'Realtime WebRTC connection error');
      this.callbacks.onStateChange?.('error');
      this.disconnect();
      return false;
    }
  }

  /**
   * Parse Realtime Server Events
   */
  private handleServerEvent(event: any) {
    switch (event.type) {
      case 'input_audio_buffer.speech_started':
        // Visitor began speaking -> server VAD detected barge-in!
        audioLipSync.stop(this.callbacks.onLipSyncFrame);
        this.callbacks.onUserSpeechStarted?.();
        break;

      case 'conversation.item.input_audio_transcription.completed':
        if (event.transcript) {
          this.callbacks.onUserTranscript?.(event.transcript.trim(), true);
        }
        break;

      case 'response.audio_transcript.delta':
        this.currentAssistantTranscript += event.delta || '';
        this.callbacks.onAssistantTranscript?.(this.currentAssistantTranscript, false);
        break;

      case 'response.audio_transcript.done':
        this.callbacks.onAssistantTranscript?.(event.transcript || this.currentAssistantTranscript, true);
        this.currentAssistantTranscript = '';
        break;

      case 'response.audio.started':
        this.callbacks.onAssistantSpeechStarted?.();
        break;

      case 'response.audio.done':
        this.callbacks.onAssistantSpeechEnded?.();
        break;

      case 'error':
        console.error('[RealtimeWebRTC] Server error:', event.error);
        this.callbacks.onError?.(event.error?.message || 'OpenAI realtime error');
        break;
    }
  }

  /**
   * Send text message over WebRTC data channel
   */
  public sendTextMessage(text: string) {
    if (!this.dc || this.dc.readyState !== 'open') return;

    // Send client event to trigger conversation response
    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text,
          },
        ],
      },
    };
    this.dc.send(JSON.stringify(event));

    // Request response generation
    this.dc.send(JSON.stringify({ type: 'response.create' }));
  }

  /**
   * Toggle microphone track mute
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = !this.isMuted;
      });
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Cleanly terminate WebRTC session and release devices
   */
  public disconnect() {
    this.isConnected = false;

    if (this.dc) {
      try { this.dc.close(); } catch {}
      this.dc = null;
    }

    if (this.pc) {
      try { this.pc.close(); } catch {}
      this.pc = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
      this.localStream = null;
    }

    if (this.remoteAudioElement) {
      this.remoteAudioElement.pause();
      this.remoteAudioElement.srcObject = null;
      this.remoteAudioElement.remove();
      this.remoteAudioElement = null;
    }

    audioLipSync.stop(this.callbacks.onLipSyncFrame);
    this.currentAssistantTranscript = '';
    this.callbacks.onStateChange?.('disconnected');
  }
}
