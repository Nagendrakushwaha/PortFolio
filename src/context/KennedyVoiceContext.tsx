import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';
import {
  kennedyEngine,
  type ChatAction,
  type AssistantResponse,
} from '../lib/kennedyKnowledgeEngine';
import { soundSynth } from '../lib/soundSynthesizer';
import { audioLipSync } from '../lib/audioLipSync';
import { voiceService } from '../lib/voiceService';
import type {
  AssistantState,
  VisemeType,
} from '../components/chat/KennedyTalkingAvatar';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actions?: ChatAction[];
  sources?: string[];
  isStreaming?: boolean;
}

export interface VoiceOption {
  id: string;
  displayName: string;
  gender: 'male' | 'female' | 'neutral';
  lang: string;
  isNeural: boolean;
  provider: 'openai' | 'elevenlabs' | 'browser';
  voice?: SpeechSynthesisVoice;
}

export interface KennedyVoiceContextType {
  // Modal Visibility (Decoupled from voice session)
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  isChatMinimized: boolean;
  setIsChatMinimized: (min: boolean) => void;

  // Voice Session State Machine
  isVoiceSessionActive: boolean;
  assistantState: AssistantState;
  isSpeaking: boolean;
  isListening: boolean;
  isProcessing: boolean;
  isMicMuted: boolean;
  sttSupported: boolean;
  sttError: string | null;
  transcript: string;
  interimTranscript: string;
  lastAssistantSnippet: string;

  // Real-time Audio & Mouth Lip Sync
  audioLevel: number;
  mouthOpen: number;
  currentViseme: VisemeType;

  // Voice Session Controls
  startVoiceSession: () => Promise<void>;
  endVoiceSession: () => void;
  toggleMicMute: () => void;
  stopSpeaking: () => void;
  retryListening: () => void;

  // Conversation & Messaging
  messages: ChatMessage[];
  sendMessage: (textToSend?: string) => Promise<void>;
  stopGeneration: () => void;
  clearChat: () => void;

  // Voice Synthesis Configuration
  isVoiceOutputEnabled: boolean;
  toggleVoiceOutput: () => void;
  availableVoices: VoiceOption[];
  selectedVoiceId: string;
  setSelectedVoiceId: (voiceId: string) => void;
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  speechPitch: number;
  setSpeechPitch: (pitch: number) => void;
  activeProvider: 'openai' | 'elevenlabs' | 'browser';
  setActiveProvider: (provider: 'openai' | 'elevenlabs' | 'browser') => void;
  isNeuralVoiceActive: boolean;

  // External Action Handlers
  onOpenProjectModal?: (slug: string) => void;
  onScrollToSection?: (sectionId: string) => void;
  onOpenLabTab?: (tab: string) => void;
  handleActionClick: (action: ChatAction) => void;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-1',
  sender: 'assistant',
  text: "Hello! I'm **Mr. Kennedy**, Nagendra Kushwaha's AI portfolio voice companion. I have complete, verified knowledge of his machine learning research, data analytics projects, and background. You can speak with me using your microphone or type your questions, and I will respond aloud with a natural AI voice.",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  actions: [
    { type: 'scroll', label: 'Explore Verified Projects', payload: 'projects' },
    { type: 'scroll', label: 'View Skills Matrix', payload: 'skills' },
    { type: 'scroll', label: 'Contact Nagendra', payload: 'contact' },
  ],
};

const KennedyVoiceContext = createContext<KennedyVoiceContextType | null>(null);

interface IWindowSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (event: Event) => void;
  onend: (event: Event) => void;
  onerror: (event: { error: string; message?: string }) => void;
  onresult: (event: any) => void;
}

interface KennedyVoiceProviderProps {
  children: ReactNode;
  onOpenProjectModal?: (slug: string) => void;
  onScrollToSection?: (sectionId: string) => void;
  onOpenLabTab?: (tab: string) => void;
}

const logDiag = (category: string, message: string, data?: any) => {
  if (typeof window !== 'undefined') {
    const time = new Date().toISOString().substring(11, 23);
    const prefix = `[KennedyVoice:${category}] [${time}]`;
    if (data !== undefined) {
      console.log(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }
};

export const KennedyVoiceProvider: React.FC<KennedyVoiceProviderProps> = ({
  children,
  onOpenProjectModal,
  onScrollToSection,
  onOpenLabTab,
}) => {
  // 1. Separate Chat Panel Visibility from Voice Session
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isChatMinimized, setIsChatMinimized] = useState<boolean>(false);

  // 2. Persistent Conversation Messages
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastAssistantSnippet, setLastAssistantSnippet] = useState<string>('');

  // 3. Persistent Voice Session State Machine
  const [isVoiceSessionActive, setIsVoiceSessionActive] = useState<boolean>(false);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [sttError, setSttError] = useState<string | null>(null);
  const [sttSupported, setSttSupported] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');

  // 4. Voice Output Configuration
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState<boolean>(true);
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('echo');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [activeProvider, setActiveProvider] = useState<'openai' | 'elevenlabs' | 'browser'>('openai');
  const [isNeuralVoiceActive, setIsNeuralVoiceActive] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);

  // 5. Lip Sync & Real-time Audio Amplitude
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [mouthOpen, setMouthOpen] = useState<number>(0);
  const [currentViseme, setCurrentViseme] = useState<VisemeType>('rest');

  // Internal References
  const recognitionRef = useRef<IWindowSpeechRecognition | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micPollingFrameRef = useRef<number | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const generationAbortRef = useRef<boolean>(false);
  const submissionLockRef = useRef<boolean>(false);
  const latestTranscriptRef = useRef<string>('');
  const watchdogTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackAnimFrameRef = useRef<number | null>(null);

  // Active state mirrors for non-stale callbacks
  const isSpeakingRef = useRef<boolean>(false);
  const isListeningRef = useRef<boolean>(false);
  const isVoiceSessionActiveRef = useRef<boolean>(false);
  const isMicMutedRef = useRef<boolean>(false);
  const activeProviderRef = useRef<'openai' | 'elevenlabs' | 'browser'>('openai');
  const selectedVoiceIdRef = useRef<string>('echo');

  isSpeakingRef.current = isSpeaking;
  isListeningRef.current = isListening;
  isVoiceSessionActiveRef.current = isVoiceSessionActive;
  isMicMutedRef.current = isMicMuted;
  activeProviderRef.current = activeProvider;
  selectedVoiceIdRef.current = selectedVoiceId;

  // Function refs for safe recursion
  const startListeningLoopRef = useRef<() => void>(() => {});
  const handleUserMessageRef = useRef<(text?: string) => Promise<void>>(async () => {});
  const cleanupAudioResourcesRef = useRef<() => void>(() => {});

  // Clear watchdog and silence timers
  const clearTimers = useCallback(() => {
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  }, []);

  // Initialize Available Voices (Neural AI + Browser Fallback)
  const populateVoices = useCallback(async () => {
    const list: VoiceOption[] = [];

    // 1. Fetch AI Voice Provider Status from Backend
    try {
      const status = await voiceService.getVoiceStatus();
      logDiag('Init', 'Backend voice status retrieved:', status);

      if (status.openai?.supportedVoices) {
        status.openai.supportedVoices.forEach((v) => {
          list.push({
            id: v.id,
            displayName: `[Neural AI] ${v.name} (${v.gender === 'male' ? 'Male' : v.gender}) — ${v.description}`,
            gender: v.gender,
            lang: 'en-US',
            isNeural: true,
            provider: 'openai',
          });
        });
      }

      if (status.elevenlabs?.supportedVoices) {
        status.elevenlabs.supportedVoices.forEach((v) => {
          list.push({
            id: v.id,
            displayName: `[ElevenLabs] ${v.name} (${v.gender}) — ${v.description}`,
            gender: v.gender,
            lang: 'en-US',
            isNeural: true,
            provider: 'elevenlabs',
          });
        });
      }

      if (status.activeProvider === 'openai' || status.activeProvider === 'elevenlabs') {
        setActiveProvider(status.activeProvider);
        setIsNeuralVoiceActive(true);
        if (status.activeVoice) {
          setSelectedVoiceId(status.activeVoice);
        }
      }
    } catch (err) {
      logDiag('Init', 'Failed to fetch backend voice status, proceeding with browser fallback:', err);
    }

    // 2. Add Browser Speech Synthesis Voices as Fallback Options
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const browserVoices = window.speechSynthesis.getVoices();
      const maleKeywords = [
        'david', 'mark', 'george', 'james', 'daniel', 'alex', 'fred', 'oliver',
        'arthur', 'rishi', 'guy', 'male', 'richard', 'thomas', 'brian', 'steven', 'tom'
      ];

      browserVoices.forEach((v) => {
        const nameLower = v.name.toLowerCase();
        let gender: 'male' | 'female' | 'neutral' = 'neutral';
        if (maleKeywords.some((kw) => nameLower.includes(kw)) || (nameLower.includes('male') && !nameLower.includes('female'))) {
          gender = 'male';
        } else if (nameLower.includes('female')) {
          gender = 'female';
        }

        list.push({
          id: `browser:${v.name}`,
          displayName: `[Standard] ${v.name} (${v.lang})${gender === 'male' ? ' — Male' : ''}`,
          gender,
          lang: v.lang,
          isNeural: false,
          provider: 'browser',
          voice: v,
        });
      });

      const englishMale = browserVoices.find((v) =>
        maleKeywords.some((kw) => v.name.toLowerCase().includes(kw)) && v.lang.startsWith('en')
      );
      if (englishMale) {
        setSelectedVoice(englishMale);
      } else if (browserVoices[0]) {
        setSelectedVoice(browserVoices[0]);
      }
    }

    setAvailableVoices(list);
  }, []);

  // Check STT & populate voices on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    populateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => populateVoices();
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const supported = !!SpeechRecognitionClass;
    setSttSupported(supported);
    logDiag('STT', `SpeechRecognition API supported: ${supported}`);

    // Tab visibility handling: pause STT if tab hidden, keep audio playing if minimized
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logDiag('Lifecycle', 'Browser tab hidden. Pausing speech recognition.');
        if (recognitionRef.current) {
          try { recognitionRef.current.abort(); } catch {}
          setIsListening(false);
        }
      } else {
        logDiag('Lifecycle', 'Browser tab visible again.');
        if (isVoiceSessionActiveRef.current && !isMicMutedRef.current && !isSpeakingRef.current) {
          startListeningLoopRef.current();
        }
      }
    };

    const handleBeforeUnload = () => {
      cleanupAudioResourcesRef.current();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cleanupAudioResourcesRef.current();
    };
  }, [populateVoices]);

  // Clean all audio and microphone capture resources
  const cleanupAudioResources = useCallback(() => {
    logDiag('Mic', 'Cleaning up all audio, speech, and microphone resources.');
    clearTimers();

    audioLipSync.stop();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }
    if (micPollingFrameRef.current) {
      cancelAnimationFrame(micPollingFrameRef.current);
      micPollingFrameRef.current = null;
    }
    if (fallbackAnimFrameRef.current) {
      cancelAnimationFrame(fallbackAnimFrameRef.current);
      fallbackAnimFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try { audioContextRef.current.close(); } catch {}
      audioContextRef.current = null;
    }

    setIsSpeaking(false);
    setIsListening(false);
    setIsProcessing(false);
    setAudioLevel(0);
    setMouthOpen(0);
    setCurrentViseme('rest');
    submissionLockRef.current = false;
    latestTranscriptRef.current = '';
  }, [clearTimers]);
  cleanupAudioResourcesRef.current = cleanupAudioResources;

  // Stop Speaking Immediately (Interruption / Barge-in)
  const stopSpeaking = useCallback(() => {
    logDiag('TTS', 'Stop speaking (Interruption / Barge-in) triggered.');
    audioLipSync.stop();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (fallbackAnimFrameRef.current) {
      cancelAnimationFrame(fallbackAnimFrameRef.current);
      fallbackAnimFrameRef.current = null;
    }

    setIsSpeaking(false);
    isSpeakingRef.current = false;
    currentUtteranceRef.current = null;
    setAudioLevel(0);
    setMouthOpen(0);
    setCurrentViseme('rest');

    // If voice session is active and mic not muted, resume listening immediately
    if (isVoiceSessionActiveRef.current && !isMicMutedRef.current) {
      setTimeout(() => {
        startListeningLoopRef.current();
      }, 150);
    }
  }, []);

  // 6. Speech-to-Text Listening Loop
  const startListeningLoop = useCallback(() => {
    clearTimers();

    if (isSpeakingRef.current || isMicMutedRef.current || !isVoiceSessionActiveRef.current) {
      logDiag('STT', `Cannot start listening: isSpeaking=${isSpeakingRef.current}, isMuted=${isMicMutedRef.current}, isActive=${isVoiceSessionActiveRef.current}`);
      return;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      const err = 'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.';
      logDiag('STT', `Error: ${err}`);
      setSttError(err);
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
        recognitionRef.current = null;
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      submissionLockRef.current = false;
      latestTranscriptRef.current = '';

      recognition.onstart = () => {
        logDiag('STT', 'SpeechRecognition onstart fired. State -> listening');
        setIsListening(true);
        setIsProcessing(false);
        setTranscript('');
        setInterimTranscript('');
        setSttError(null);

        // Watchdog: detect complete silence after 8s and 14s
        watchdogTimerRef.current = setTimeout(() => {
          logDiag('STT', 'Watchdog 8s fired: No speech activity detected yet.');
          watchdogTimerRef.current = setTimeout(() => {
            logDiag('STT', 'Watchdog 14s fired: No speech detected.');
            if (!submissionLockRef.current && isListeningRef.current) {
              setSttError('No speech was detected. Please ask a question or click the mic.');
              try { recognition.stop(); } catch {}
              setIsListening(false);
            }
          }, 6000);
        }, 8000);
      };

      recognition.onresult = (event: any) => {
        clearTimers();
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          const text = item[0]?.transcript || '';
          if (item.isFinal) {
            currentFinal += text;
          } else {
            currentInterim += text;
          }
        }

        const recognizedText = (currentFinal || currentInterim).trim();
        if (recognizedText) {
          latestTranscriptRef.current = recognizedText;
        }

        logDiag('STT', `onresult: interim="${currentInterim}", final="${currentFinal}"`);

        if (currentFinal.trim()) {
          setTranscript(currentFinal);
          setInterimTranscript('');

          if (!submissionLockRef.current) {
            submissionLockRef.current = true;
            logDiag('STT', `Final transcript locked: "${currentFinal}". Transitioning -> Processing.`);
            setIsListening(false);
            setIsProcessing(true);
            try { recognition.stop(); } catch {}
            handleUserMessageRef.current(currentFinal);
          }
        } else if (currentInterim.trim()) {
          setInterimTranscript(currentInterim);

          if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = setTimeout(() => {
            if (!submissionLockRef.current && latestTranscriptRef.current.trim().length > 1) {
              submissionLockRef.current = true;
              const pendingText = latestTranscriptRef.current.trim();
              logDiag('STT', `Silence timeout submitting interim: "${pendingText}". Transitioning -> Processing.`);
              setTranscript(pendingText);
              setInterimTranscript('');
              setIsListening(false);
              setIsProcessing(true);
              try { recognition.stop(); } catch {}
              handleUserMessageRef.current(pendingText);
            }
          }, 1400);
        }
      };

      recognition.onerror = (event: { error: string; message?: string }) => {
        logDiag('STT', `onerror fired: ${event.error}`, event);
        clearTimers();
        setIsListening(false);

        if (event.error === 'not-allowed') {
          const err = 'Microphone permission was denied. Please allow microphone access in your browser to speak with Mr. Kennedy.';
          logDiag('Mic', err);
          setSttError(err);
          setIsVoiceSessionActive(false);
        } else if (event.error === 'no-speech') {
          logDiag('STT', 'SpeechRecognition reported no-speech.');
          if (!submissionLockRef.current && !latestTranscriptRef.current.trim()) {
            setSttError('No speech was detected. Click below to retry or type your question.');
          }
        } else if (event.error === 'audio-capture') {
          setSttError('No microphone audio received. Please check your system audio input.');
        } else if (event.error === 'network') {
          setSttError('Speech recognition network error. Please check your internet connection or use text chat.');
        } else if (event.error !== 'aborted') {
          setSttError(`Voice input error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        logDiag('STT', 'onend fired.');
        clearTimers();
        setIsListening(false);

        // Fallback recovery if unsubmitted interim text exists
        if (!submissionLockRef.current && latestTranscriptRef.current.trim().length > 1) {
          submissionLockRef.current = true;
          const capturedText = latestTranscriptRef.current.trim();
          logDiag('STT', `onend fallback submitting transcript: "${capturedText}"`);
          setTranscript(capturedText);
          setInterimTranscript('');
          setIsProcessing(true);
          handleUserMessageRef.current(capturedText);
          return;
        }

        // Re-arm listening loop if active and no speech was in flight
        if (
          isVoiceSessionActiveRef.current &&
          !isMicMutedRef.current &&
          !isSpeakingRef.current &&
          !submissionLockRef.current
        ) {
          logDiag('STT', 'Auto-rearming listening loop for next turn.');
          setTimeout(() => {
            if (isVoiceSessionActiveRef.current && !isSpeakingRef.current && !isMicMutedRef.current) {
              startListeningLoopRef.current();
            }
          }, 400);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      logDiag('STT', 'recognition.start() called.');
    } catch (err: any) {
      logDiag('STT', 'Failed to start speech recognition loop:', err);
      setSttError(`Unable to start speech recognition: ${err.message || 'Unknown error'}`);
      setIsListening(false);
    }
  }, [clearTimers]);
  startListeningLoopRef.current = startListeningLoop;

  // 7. Spoken Audio Synthesis (Neural AI Voice with Browser Fallback)
  const speakText = useCallback(
    async (rawText: string) => {
      if (!isVoiceOutputEnabled) {
        logDiag('TTS', 'Speech synthesis skipped: output muted.');
        setIsProcessing(false);
        if (isVoiceSessionActiveRef.current && !isMicMutedRef.current) {
          setTimeout(() => startListeningLoopRef.current(), 600);
        }
        return;
      }

      stopSpeaking();

      // Clean text for natural spoken prosody
      const cleanText = rawText
        .replace(/[*_#`~[\]]/g, '')
        .replace(/https?:\/\/\S+/g, 'link')
        .replace(/\(https?:\/\/[^)]+\)/g, '')
        .replace(/[•–—]/g, ', ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) {
        setIsProcessing(false);
        if (isVoiceSessionActiveRef.current && !isMicMutedRef.current) {
          startListeningLoopRef.current();
        }
        return;
      }

      setLastAssistantSnippet(cleanText.slice(0, 85) + (cleanText.length > 85 ? '...' : ''));

      // STEP A: Attempt Neural AI Voice via Backend TTS API (OpenAI or ElevenLabs)
      if (activeProviderRef.current !== 'browser') {
        try {
          logDiag('TTS', `Synthesizing neural voice via /api/tts (provider=${activeProviderRef.current}, voice=${selectedVoiceIdRef.current})`);
          setIsProcessing(true);

          const audioBuffer = await voiceService.synthesizeSpeech({
            text: cleanText,
            voice: selectedVoiceIdRef.current,
            provider: activeProviderRef.current,
            speed: speechRate,
          });

          if (audioBuffer && audioBuffer.byteLength > 0) {
            logDiag('TTS', `Neural audio received (${audioBuffer.byteLength} bytes). Playing through Web Audio Analyser.`);
            setIsProcessing(false);
            setIsSpeaking(true);
            isSpeakingRef.current = true;

            // Pause microphone STT while assistant speaks to prevent acoustic feedback loop
            if (recognitionRef.current) {
              try { recognitionRef.current.abort(); } catch {}
              setIsListening(false);
            }

            // Play decoded audio buffer with real-time FFT frequency lip-sync!
            await audioLipSync.playAudioBuffer(
              audioBuffer,
              (frame) => {
                setAudioLevel(frame.audioLevel);
                setMouthOpen(frame.mouthOpen);
                setCurrentViseme(frame.viseme);
              },
              () => {
                logDiag('TTS', 'Neural audio playback completed.');
                setIsSpeaking(false);
                isSpeakingRef.current = false;
                setAudioLevel(0);
                setMouthOpen(0);
                setCurrentViseme('rest');

                // Continuous conversational loop: auto-relaunch listening after speech finishes
                if (isVoiceSessionActiveRef.current && !isMicMutedRef.current) {
                  logDiag('State', 'Auto-transitioning from Speaking -> Listening.');
                  setTimeout(() => {
                    if (isVoiceSessionActiveRef.current && !isSpeakingRef.current) {
                      soundSynth.playAssistantListeningPing();
                      startListeningLoopRef.current();
                    }
                  }, 350);
                }
              }
            );
            return;
          }
        } catch (err) {
          logDiag('TTS', 'Neural TTS synthesis failed, falling back to browser speech synthesis:', err);
        }
      }

      // STEP B: Fallback to Browser SpeechSynthesis if Neural Voice unavailable
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        logDiag('TTS', 'Executing browser speech synthesis fallback.');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        utterance.rate = speechRate;
        utterance.pitch = speechPitch;
        utterance.volume = 1.0;

        let animAngle = 0;
        let activeWord = '';

        const animateMouthFallback = () => {
          if (!isSpeakingRef.current) return;
          animAngle += 0.32;
          const base = 0.55;
          const wave = Math.sin(animAngle) * 0.3 + Math.cos(animAngle * 2.3) * 0.15;
          const level = Math.max(0.08, Math.min(1.0, base + wave));

          setAudioLevel(level);
          setMouthOpen(level);

          if (activeWord) {
            const w = activeWord.toLowerCase();
            if (w.includes('o') || w.includes('u')) setCurrentViseme('oh');
            else if (w.includes('e') || w.includes('i')) setCurrentViseme('ee');
            else if (w.includes('m') || w.includes('b') || w.includes('p')) setCurrentViseme('mm');
            else setCurrentViseme('aa');
          } else {
            setCurrentViseme(animAngle % 2 > 1 ? 'aa' : 'ee');
          }

          fallbackAnimFrameRef.current = requestAnimationFrame(animateMouthFallback);
        };

        utterance.onboundary = (e: SpeechSynthesisEvent) => {
          if (e.name === 'word') {
            const word = cleanText.substring(e.charIndex).split(/\s+/)[0] || '';
            activeWord = word;
          }
        };

        utterance.onstart = () => {
          setIsSpeaking(true);
          setIsProcessing(false);
          isSpeakingRef.current = true;
          if (recognitionRef.current) {
            try { recognitionRef.current.abort(); } catch {}
            setIsListening(false);
          }
          fallbackAnimFrameRef.current = requestAnimationFrame(animateMouthFallback);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          isSpeakingRef.current = false;
          currentUtteranceRef.current = null;
          if (fallbackAnimFrameRef.current) {
            cancelAnimationFrame(fallbackAnimFrameRef.current);
            fallbackAnimFrameRef.current = null;
          }
          setAudioLevel(0);
          setMouthOpen(0);
          setCurrentViseme('rest');

          if (isVoiceSessionActiveRef.current && !isMicMutedRef.current) {
            setTimeout(() => {
              if (isVoiceSessionActiveRef.current && !isSpeakingRef.current) {
                soundSynth.playAssistantListeningPing();
                startListeningLoopRef.current();
              }
            }, 350);
          }
        };

        utterance.onerror = (e) => {
          logDiag('TTS', 'Browser speech synthesis error:', e);
          setIsSpeaking(false);
          setIsProcessing(false);
          isSpeakingRef.current = false;
          currentUtteranceRef.current = null;
          setAudioLevel(0);
          setMouthOpen(0);
          setCurrentViseme('rest');
        };

        currentUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    },
    [isVoiceOutputEnabled, selectedVoice, speechRate, speechPitch, stopSpeaking]
  );

  // 8. Send user message & generate response using verified portfolio knowledge engine
  const handleUserMessage = useCallback(
    async (textToSend?: string) => {
      const text = (textToSend || '').trim();
      if (!text) {
        setIsProcessing(false);
        return;
      }

      logDiag('AI', `Submitting question: "${text}"`);
      stopSpeaking();
      generationAbortRef.current = false;
      setIsProcessing(true);
      setSttError(null);

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text,
        timestamp,
      };

      setMessages((prev) => [...prev, userMsg]);

      try {
        const historyContext = messages.map((m) => ({ sender: m.sender, text: m.text }));

        // 1. Query Verified Knowledge Engine for Grounded Answer
        const response: AssistantResponse = await kennedyEngine.query(text, historyContext);

        if (generationAbortRef.current) {
          setIsProcessing(false);
          return;
        }

        const assistantMsgId = `assistant-${Date.now()}`;
        const fullText = response.text;

        // Visual streaming text display
        const streamingMsg: ChatMessage = {
          id: assistantMsgId,
          sender: 'assistant',
          text: '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: response.actions,
          sources: response.sources,
          isStreaming: true,
        };

        setMessages((prev) => [...prev, streamingMsg]);

        const words = fullText.split(' ');
        const step = Math.max(1, Math.floor(words.length / 24));

        for (let i = 0; i < words.length; i += step) {
          if (generationAbortRef.current) break;
          const currentSlice = words.slice(0, i + step).join(' ');

          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsgId ? { ...m, text: currentSlice } : m))
          );
          await new Promise((r) => setTimeout(r, 16));
        }

        // Finalize text
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, text: fullText, isStreaming: false }
              : m
          )
        );

        // Speak aloud using natural AI voice
        if (!generationAbortRef.current) {
          await speakText(fullText);
        }
      } catch (err: any) {
        logDiag('AI', 'Error querying assistant engine:', err);
        const errorMsg: ChatMessage = {
          id: `assistant-err-${Date.now()}`,
          sender: 'assistant',
          text: "I encountered an issue processing that query. Please ask again or feel free to explore Nagendra's projects, technical skills, or contact info.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
        setSttError('Unable to generate response from portfolio knowledge engine.');
        setIsProcessing(false);
      }
    },
    [messages, speakText, stopSpeaking]
  );
  handleUserMessageRef.current = handleUserMessage;

  // 9. Start Voice Session (Explicit User Trigger with Mic Permission)
  const startVoiceSession = useCallback(async () => {
    logDiag('Session', 'startVoiceSession explicitly triggered by visitor.');
    setSttError(null);
    stopSpeaking();

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        logDiag('Mic', 'Requesting microphone permission with acoustic constraints...');
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        logDiag('Mic', 'Microphone permission granted successfully.');
        mediaStreamRef.current = stream;

        // Real-time mic audio analyser
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          if (ctx.state === 'suspended') {
            await ctx.resume();
          }
          audioContextRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const pollMicLevel = () => {
            if (!isVoiceSessionActiveRef.current) return;

            if (analyserRef.current && isListeningRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              const normalized = Math.min(1.0, avg / 128);
              setAudioLevel(normalized);
            } else if (!isSpeakingRef.current) {
              setAudioLevel(0);
            }
            micPollingFrameRef.current = requestAnimationFrame(pollMicLevel);
          };
          micPollingFrameRef.current = requestAnimationFrame(pollMicLevel);
        }
      }

      setIsVoiceSessionActive(true);
      isVoiceSessionActiveRef.current = true;
      setIsMicMuted(false);
      isMicMutedRef.current = false;

      soundSynth.playAssistantSessionStart();

      setTimeout(() => {
        startListeningLoopRef.current();
      }, 250);
    } catch (err: any) {
      logDiag('Mic', 'Microphone permission denied or device error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setSttError('Microphone permission was denied. Please allow microphone access in your browser or type your questions below.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setSttError('No microphone hardware detected on your device.');
      } else {
        setSttError(`Could not access microphone: ${err.message || 'Check audio input settings'}`);
      }
      setIsVoiceSessionActive(false);
      isVoiceSessionActiveRef.current = false;
    }
  }, [stopSpeaking]);

  // 10. End Voice Session
  const endVoiceSession = useCallback(() => {
    logDiag('Session', 'endVoiceSession triggered. Releasing all resources.');
    setIsVoiceSessionActive(false);
    isVoiceSessionActiveRef.current = false;
    cleanupAudioResources();
    soundSynth.playAssistantSessionEnd();
  }, [cleanupAudioResources]);

  // 11. Toggle Microphone Mute
  const toggleMicMute = useCallback(() => {
    setIsMicMuted((prev) => {
      const next = !prev;
      isMicMutedRef.current = next;
      logDiag('Mic', `Microphone mute toggled. isMuted=${next}`);

      if (next) {
        if (recognitionRef.current) {
          try { recognitionRef.current.abort(); } catch {}
        }
        setIsListening(false);
      } else {
        if (isVoiceSessionActiveRef.current && !isSpeakingRef.current) {
          soundSynth.playAssistantListeningPing();
          startListeningLoopRef.current();
        }
      }
      return next;
    });
  }, []);

  // 12. Retry Listening Control
  const retryListening = useCallback(() => {
    logDiag('Session', 'retryListening called.');
    setSttError(null);
    clearTimers();
    submissionLockRef.current = false;
    latestTranscriptRef.current = '';

    if (!isVoiceSessionActiveRef.current) {
      startVoiceSession();
    } else {
      stopSpeaking();
      startListeningLoopRef.current();
    }
  }, [clearTimers, startVoiceSession, stopSpeaking]);

  // Voice Selection handler
  const handleSelectVoiceId = useCallback((id: string) => {
    setSelectedVoiceId(id);
    const found = availableVoices.find((v) => v.id === id);
    if (found) {
      setActiveProvider(found.provider);
      setIsNeuralVoiceActive(found.isNeural);
      if (found.voice) {
        setSelectedVoice(found.voice);
      }
    }
  }, [availableVoices]);

  // State machine value
  const assistantState: AssistantState = sttError
    ? 'error'
    : isMicMuted
    ? 'muted'
    : isSpeaking
    ? 'speaking'
    : isProcessing
    ? 'processing'
    : isListening
    ? 'listening'
    : isVoiceSessionActive
    ? 'ready'
    : 'idle';

  const value: KennedyVoiceContextType = {
    isChatOpen,
    openChat: () => setIsChatOpen(true),
    closeChat: () => setIsChatOpen(false),
    toggleChat: () => setIsChatOpen((prev) => !prev),
    isChatMinimized,
    setIsChatMinimized,

    isVoiceSessionActive,
    assistantState,
    isSpeaking,
    isListening,
    isProcessing,
    isMicMuted,
    sttSupported,
    sttError,
    transcript,
    interimTranscript,
    lastAssistantSnippet,

    audioLevel,
    mouthOpen,
    currentViseme,

    startVoiceSession,
    endVoiceSession,
    toggleMicMute,
    stopSpeaking,
    retryListening,

    messages,
    sendMessage: handleUserMessage,
    stopGeneration: () => {
      generationAbortRef.current = true;
      setIsProcessing(false);
    },
    clearChat: () => {
      stopSpeaking();
      setMessages([WELCOME_MESSAGE]);
    },

    isVoiceOutputEnabled,
    toggleVoiceOutput: () => {
      setIsVoiceOutputEnabled((prev) => {
        const next = !prev;
        if (!next) stopSpeaking();
        return next;
      });
    },
    availableVoices,
    selectedVoiceId,
    setSelectedVoiceId: handleSelectVoiceId,
    selectedVoice,
    setSelectedVoice,
    speechRate,
    setSpeechRate,
    speechPitch,
    setSpeechPitch,
    activeProvider,
    setActiveProvider,
    isNeuralVoiceActive,

    onOpenProjectModal,
    onScrollToSection,
    onOpenLabTab,
    handleActionClick: (action: ChatAction) => {
      stopSpeaking();
      switch (action.type) {
        case 'project_modal':
          if (onOpenProjectModal) onOpenProjectModal(action.payload);
          break;
        case 'scroll':
          if (onScrollToSection) onScrollToSection(action.payload);
          break;
        case 'lab_tab':
          if (onOpenLabTab) onOpenLabTab(action.payload);
          else if (onScrollToSection) onScrollToSection('mllab');
          break;
        case 'external_link':
          window.open(action.payload, '_blank', 'noopener,noreferrer');
          break;
      }
    },
  };

  return (
    <KennedyVoiceContext.Provider value={value}>
      {children}
    </KennedyVoiceContext.Provider>
  );
};

export const useKennedyVoiceContext = (): KennedyVoiceContextType => {
  const context = useContext(KennedyVoiceContext);
  if (!context) {
    throw new Error('useKennedyVoiceContext must be used within a KennedyVoiceProvider');
  }
  return context;
};
