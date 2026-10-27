import type { VisemeType } from '../components/chat/KennedyTalkingAvatar';

export interface LipSyncFrame {
  audioLevel: number; // 0.0 to 1.0
  mouthOpen: number;  // 0.0 to 1.0
  viseme: VisemeType;
}

export type LipSyncCallback = (frame: LipSyncFrame) => void;

/**
 * AudioLipSyncManager
 * Coordinates Web Audio API playback, real-time FFT frequency spectrum analysis,
 * formant energy extraction, and precise lip-sync viseme calculation for Mr. Kennedy's talking avatar.
 */
export class AudioLipSyncManager {
  private static instance: AudioLipSyncManager;

  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private currentMediaElementSource: MediaElementAudioSourceNode | null = null;
  private currentStreamSource: MediaStreamAudioSourceNode | null = null;
  private animFrameId: number | null = null;
  private isPlaying = false;
  private onEndCallback: (() => void) | null = null;

  // Smoothing buffers
  private smoothedLevel = 0;
  private smoothedMouth = 0;
  private lastViseme: VisemeType = 'rest';

  public static getInstance(): AudioLipSyncManager {
    if (!AudioLipSyncManager.instance) {
      AudioLipSyncManager.instance = new AudioLipSyncManager();
    }
    return AudioLipSyncManager.instance;
  }

  /**
   * Get or initialize the shared AudioContext
   */
  public async getAudioContext(): Promise<AudioContext> {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Get or setup the shared AnalyserNode
   */
  private async getAnalyser(): Promise<AnalyserNode> {
    const ctx = await this.getAudioContext();
    if (!this.analyser) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.5;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      this.analyser = analyser;
    }
    return this.analyser;
  }

  /**
   * Plays an audio buffer decoded from TTS API (OpenAI / ElevenLabs) with real-time lip-sync
   */
  public async playAudioBuffer(
    audioData: ArrayBuffer,
    onFrame?: LipSyncCallback,
    onEnd?: () => void
  ): Promise<void> {
    this.stop(); // Stop any currently playing speech

    const ctx = await this.getAudioContext();
    const analyser = await this.getAnalyser();

    // Decode audio binary
    const audioBuffer = await ctx.decodeAudioData(audioData.slice(0));

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;

    // Connect: Source -> Analyser -> Output Destination
    source.connect(analyser);
    analyser.connect(ctx.destination);

    this.currentSource = source;
    this.isPlaying = true;
    this.onEndCallback = onEnd || null;

    source.onended = () => {
      if (this.currentSource === source) {
        this.stopLipSyncLoop(onFrame);
        this.isPlaying = false;
        this.currentSource = null;
        if (this.onEndCallback) {
          const cb = this.onEndCallback;
          this.onEndCallback = null;
          cb();
        }
      }
    };

    source.start(0);
    this.startLipSyncLoop(analyser, onFrame);
  }

  /**
   * Attaches an HTML5 Audio element or remote WebRTC audio stream for real-time lip-sync
   */
  public async attachMediaStream(
    stream: MediaStream,
    onFrame?: LipSyncCallback
  ): Promise<void> {
    this.stop();
    const ctx = await this.getAudioContext();
    const analyser = await this.getAnalyser();

    const streamSource = ctx.createMediaStreamSource(stream);
    streamSource.connect(analyser);
    // Don't connect mic or we get acoustic feedback; if remote stream, connect to destination if needed:
    this.currentStreamSource = streamSource;
    this.isPlaying = true;

    this.startLipSyncLoop(analyser, onFrame);
  }

  /**
   * Real-time FFT analysis loop running at requestAnimationFrame rate
   */
  private startLipSyncLoop(analyser: AnalyserNode, onFrame?: LipSyncCallback) {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }

    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    const timeData = new Uint8Array(analyser.fftSize);

    const sampleRate = analyser.context.sampleRate;
    const binSize = sampleRate / analyser.fftSize;

    const getEnergyInRange = (lowFreq: number, highFreq: number) => {
      const startBin = Math.floor(lowFreq / binSize);
      const endBin = Math.min(frequencyData.length - 1, Math.ceil(highFreq / binSize));
      let sum = 0;
      let count = 0;
      for (let i = startBin; i <= endBin; i++) {
        sum += frequencyData[i];
        count++;
      }
      return count > 0 ? sum / (count * 255) : 0;
    };

    const update = () => {
      if (!this.isPlaying) return;

      analyser.getByteFrequencyData(frequencyData);
      analyser.getByteTimeDomainData(timeData);

      // 1. Calculate RMS Volume from time domain
      let sumSquares = 0;
      for (let i = 0; i < timeData.length; i++) {
        const norm = (timeData[i] - 128) / 128;
        sumSquares += norm * norm;
      }
      const rawRms = Math.sqrt(sumSquares / timeData.length);
      const instantLevel = Math.min(1.0, rawRms * 2.8);

      // Exponential smoothing for natural vocal inertia
      this.smoothedLevel = this.smoothedLevel * 0.4 + instantLevel * 0.6;

      // 2. Frequency Formant Bands for Phoneme & Viseme Classification
      // Low formant (100 - 500 Hz): Fundamental vocal energy & throat resonance -> 'oh' / 'aa'
      const lowEnergy = getEnergyInRange(100, 500);
      // Mid formant (500 - 1800 Hz): Open vowels -> 'aa'
      const midEnergy = getEnergyInRange(500, 1800);
      // High formant (1800 - 3500 Hz): High vowels and consonants -> 'ee'
      const highEnergy = getEnergyInRange(1800, 3500);
      // Sibilants & fricatives (3500 - 6500 Hz): 's', 't', 'f' -> 'ee' / 'mm'
      const fricativeEnergy = getEnergyInRange(3500, 6500);

      let viseme: VisemeType = 'rest';
      let targetMouthOpen = 0;

      if (this.smoothedLevel > 0.035) {
        targetMouthOpen = Math.min(1.0, this.smoothedLevel * 1.35 + midEnergy * 0.35);

        if (lowEnergy > midEnergy && lowEnergy > highEnergy && lowEnergy > 0.3) {
          viseme = targetMouthOpen > 0.5 ? 'oh' : 'oo';
        } else if (highEnergy > midEnergy * 1.2 || fricativeEnergy > 0.35) {
          viseme = 'ee';
        } else if (midEnergy > lowEnergy && midEnergy > 0.25) {
          viseme = 'aa';
        } else if (targetMouthOpen < 0.2) {
          viseme = 'mm';
        } else {
          viseme = 'aa';
        }
      } else {
        // Complete silence: Mouth returns to rest
        targetMouthOpen = 0;
        viseme = 'rest';
      }

      this.smoothedMouth = this.smoothedMouth * 0.4 + targetMouthOpen * 0.6;
      this.lastViseme = viseme;

      if (onFrame) {
        onFrame({
          audioLevel: Number(this.smoothedLevel.toFixed(3)),
          mouthOpen: Number(this.smoothedMouth.toFixed(3)),
          viseme,
        });
      }

      this.animFrameId = requestAnimationFrame(update);
    };

    this.animFrameId = requestAnimationFrame(update);
  }

  private stopLipSyncLoop(onFrame?: LipSyncCallback) {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.smoothedLevel = 0;
    this.smoothedMouth = 0;
    this.lastViseme = 'rest';
    if (onFrame) {
      onFrame({
        audioLevel: 0,
        mouthOpen: 0,
        viseme: 'rest',
      });
    }
  }

  /**
   * Stop any current speech playback immediately (Barge-in / interruption)
   */
  public stop(onFrame?: LipSyncCallback) {
    this.isPlaying = false;

    if (this.currentSource) {
      try {
        this.currentSource.stop(0);
        this.currentSource.disconnect();
      } catch {}
      this.currentSource = null;
    }

    if (this.currentStreamSource) {
      try {
        this.currentStreamSource.disconnect();
      } catch {}
      this.currentStreamSource = null;
    }

    if (this.currentMediaElementSource) {
      try {
        this.currentMediaElementSource.disconnect();
      } catch {}
      this.currentMediaElementSource = null;
    }

    this.stopLipSyncLoop(onFrame);

    if (this.onEndCallback) {
      const cb = this.onEndCallback;
      this.onEndCallback = null;
      cb();
    }
  }

  /**
   * Check if speech is currently playing
   */
  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Get the current or most recent viseme
   */
  public getLastViseme(): VisemeType {
    return this.lastViseme;
  }
}

export const audioLipSync = AudioLipSyncManager.getInstance();
