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
} from '../lib/kennedyKnowledgeEngine';
import { matchNavigationIntent } from '../lib/voiceNavigationRouter';
import { profileData } from '../data/profile';
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
  engine?: string;
  model?: string;
  tokensPerSec?: number;
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

  // Language & Open-Weight Engine Info
  voiceLanguage: 'auto' | 'en' | 'hi';
  setVoiceLanguage: (lang: 'auto' | 'en' | 'hi') => void;
  ollamaStatus: any;
  isOllamaActive: boolean;
  activeLLMEngine: string;

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
  const [voiceLanguage, setVoiceLanguage] = useState<'auto' | 'en' | 'hi'>('auto');
  const [ollamaStatus, setOllamaStatus] = useState<any>(null);
  const [activeLLMEngine, setActiveLLMEngine] = useState<string>('Detecting AI Engine...');
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('shimmer');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [activeProvider, setActiveProvider] = useState<'openai' | 'elevenlabs' | 'browser'>('browser');
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
  const currentAbortRef = useRef<(() => void) | null>(null);
  const submissionLockRef = useRef<boolean>(false);
  const latestTranscriptRef = useRef<string>('');
  const watchdogTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackAnimFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const useWhisperModeRef = useRef<boolean>(false);

  // Active state mirrors for non-stale callbacks
  const isSpeakingRef = useRef<boolean>(false);
  const isListeningRef = useRef<boolean>(false);
  const isVoiceSessionActiveRef = useRef<boolean>(false);
  const isMicMutedRef = useRef<boolean>(false);
  const activeProviderRef = useRef<'openai' | 'elevenlabs' | 'browser'>('openai');
  const selectedVoiceIdRef = useRef<string>('shimmer');

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

    // 1. Fetch AI Provider Status from Backend (Ollama / Open-Weights / TTS)
    try {
      const status = await voiceService.getVoiceStatus();
      logDiag('Init', 'Backend voice & AI status retrieved:', status);

      if (status.ollama?.available) {
        setOllamaStatus(status.ollama);
        setActiveLLMEngine(`Qwen2.5 1.5B (Local Ollama)`);
      } else {
        setActiveLLMEngine('Grounded Knowledge Engine (Demo Mode)');
      }

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
      setActiveLLMEngine('Grounded Knowledge Engine (Client Mode)');
    }

    // 2. Add Browser Speech Synthesis Voices (English + Hindi Support)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const browserVoices = window.speechSynthesis.getVoices();
      const maleKeywords = [
        'david', 'mark', 'george', 'james', 'daniel', 'alex', 'fred', 'oliver',
        'arthur', 'rishi', 'guy', 'male', 'richard', 'thomas', 'brian', 'steven', 'tom', 'hemant'
      ];

      browserVoices.forEach((v) => {
        const nameLower = v.name.toLowerCase();
        let gender: 'male' | 'female' | 'neutral' = 'neutral';
        if (maleKeywords.some((kw) => nameLower.includes(kw)) || (nameLower.includes('male') && !nameLower.includes('female'))) {
          gender = 'male';
        } else if (nameLower.includes('female') || nameLower.includes('kalpana') || nameLower.includes('zira')) {
          gender = 'female';
        }

        const isHindi = v.lang.startsWith('hi') || nameLower.includes('hindi');
        const langTag = isHindi ? ' [Hindi / हिन्दी]' : ` (${v.lang})`;

        list.push({
          id: `browser:${v.name}`,
          displayName: `[Standard] ${v.name}${langTag}${gender === 'male' ? ' — Male' : ''}`,
          gender,
          lang: v.lang,
          isNeural: false,
          provider: 'browser',
          voice: v,
        });
      });

      // Natural female voice preferred, with Indian English voice prioritized
      const femaleKeywords = [
        'female', 'woman', 'zira', 'jenny', 'samantha', 'victoria', 'karen', 'fiona',
        'neerja', 'heera', 'kalpana', 'veena', 'ananya', 'leena', 'swara'
      ];

      const indianEnFemale = browserVoices.find((v) => {
        const lang = v.lang.toLowerCase();
        const name = v.name.toLowerCase();
        const isIndianEn = lang.includes('en-in') || lang.includes('en_in') || name.includes('india');
        const isFemale = femaleKeywords.some((kw) => name.includes(kw));
        return isIndianEn && isFemale;
      });

      const indianEn = browserVoices.find((v) => {
        const lang = v.lang.toLowerCase();
        const name = v.name.toLowerCase();
        return lang.includes('en-in') || lang.includes('en_in') || name.includes('india');
      });

      const englishFemale = browserVoices.find((v) => {
        const lang = v.lang.toLowerCase();
        const name = v.name.toLowerCase();
        const isEnglish = lang.startsWith('en');
        const isFemale = femaleKeywords.some((kw) => name.includes(kw)) || (!maleKeywords.some((kw) => name.includes(kw)));
        return isEnglish && isFemale;
      });

      const englishAny = browserVoices.find((v) => v.lang.toLowerCase().startsWith('en'));

      const preferredVoice = indianEnFemale || indianEn || englishFemale || englishAny || browserVoices[0];
      if (preferredVoice) {
        setSelectedVoice(preferredVoice);
        setSelectedVoiceId(`browser:${preferredVoice.name}`);
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
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch {}
      mediaRecorderRef.current = null;
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

  // 6. Speech-to-Text Listening Loop (Dual-Engine: Web Speech API + MediaRecorder Whisper)
  const startListeningLoop = useCallback(() => {
    clearTimers();

    if (isSpeakingRef.current || isMicMutedRef.current || !isVoiceSessionActiveRef.current) {
      logDiag('STT', `Cannot start listening: isSpeaking=${isSpeakingRef.current}, isMuted=${isMicMutedRef.current}, isActive=${isVoiceSessionActiveRef.current}`);
      return;
    }

    submissionLockRef.current = false;
    latestTranscriptRef.current = '';
    audioChunksRef.current = [];

    // 1. Initialize MediaRecorder audio capture in parallel
    if (mediaStreamRef.current && typeof MediaRecorder !== 'undefined') {
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          try { mediaRecorderRef.current.stop(); } catch {}
        }

        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : '';

        const recorder = new MediaRecorder(mediaStreamRef.current, mimeType ? { mimeType } : undefined);
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = async () => {
          logDiag('STT', 'MediaRecorder onstop fired.');
          if (submissionLockRef.current || !isVoiceSessionActiveRef.current) return;

          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
          if (audioBlob.size > 1800) {
            submissionLockRef.current = true;
            setIsListening(false);
            setIsProcessing(true);
            setInterimTranscript('Transcribing speech with Whisper AI...');

            try {
              const reader = new FileReader();
              reader.onload = async () => {
                const base64 = (reader.result as string).split(',')[1];
                const res = await voiceService.transcribeAudio(base64, mimeType || 'audio/webm');
                if (res.text && res.text.trim().length > 1) {
                  setTranscript(res.text.trim());
                  setInterimTranscript('');
                  handleUserMessageRef.current(res.text.trim());
                } else if (res.hint === 'brave_privacy_setting') {
                  setSttError("In Brave Browser, Google speech service is disabled by default. You can enable it in brave://settings/privacy ('Use Google services for speech recognition') or add OPENAI_API_KEY for Whisper STT.");
                  setIsProcessing(false);
                } else {
                  setSttError('No speech was detected. Please ask your question again or type below.');
                  setIsProcessing(false);
                }
              };
              reader.readAsDataURL(audioBlob);
            } catch (err: any) {
              logDiag('STT', 'Whisper audio transcription error:', err);
              setIsProcessing(false);
            }
          }
        };

        recorder.start(200);
        mediaRecorderRef.current = recorder;
      } catch (err) {
        logDiag('STT', 'MediaRecorder initialization error:', err);
      }
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    // If Web Speech API was previously network-blocked (e.g. Brave), run in Direct Audio mode
    if (!SpeechRecognitionClass || useWhisperModeRef.current) {
      logDiag('STT', 'Running in Direct Audio Whisper mode.');
      setIsListening(true);
      setIsProcessing(false);
      setTranscript('');
      setInterimTranscript('Listening... Speak now');
      setSttError(null);

      // Auto-submit after silence or max 9s
      watchdogTimerRef.current = setTimeout(() => {
        if (!submissionLockRef.current && isListeningRef.current && mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          try { mediaRecorderRef.current.stop(); } catch {}
        }
      }, 7500);

      return;
    }

    // Interrupt assistant if it was speaking (Voice Barge-In)
    if (isSpeakingRef.current) {
      stopSpeaking();
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
        recognitionRef.current = null;
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = voiceLanguage === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        logDiag('STT', 'SpeechRecognition onstart fired. State -> listening');
        setIsListening(true);
        setIsProcessing(false);
        setTranscript('');
        setInterimTranscript('');
        setSttError(null);

        watchdogTimerRef.current = setTimeout(() => {
          if (!submissionLockRef.current && isListeningRef.current) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              try { mediaRecorderRef.current.stop(); } catch {}
            }
            try { recognition.stop(); } catch {}
            setIsListening(false);
          }
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

        if (currentFinal.trim()) {
          setTranscript(currentFinal);
          setInterimTranscript('');

          if (!submissionLockRef.current) {
            submissionLockRef.current = true;
            setIsListening(false);
            setIsProcessing(true);
            try { recognition.stop(); } catch {}
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              try { mediaRecorderRef.current.stop(); } catch {}
            }
            handleUserMessageRef.current(currentFinal);
          }
        } else if (currentInterim.trim()) {
          setInterimTranscript(currentInterim);
        }
      };

      recognition.onerror = (event: { error: string; message?: string }) => {
        logDiag('STT', `recognition.onerror: ${event.error}`, event);
        clearTimers();

        if (event.error === 'network') {
          // KEY RESOLUTION: Google Speech endpoint blocked (Brave Browser or network firewall)
          // Seamlessly switch to MediaRecorder + Whisper engine with ZERO error alert!
          logDiag('STT', 'Google Speech network block detected. Seamlessly activating Whisper engine.');
          useWhisperModeRef.current = true;
          try { recognition.abort(); } catch {}
          recognitionRef.current = null;
          setInterimTranscript('Listening... Speak your question');
          setSttError(null);

          // Allow MediaRecorder to capture the rest of the speech and transcribe with Whisper
          watchdogTimerRef.current = setTimeout(() => {
            if (!submissionLockRef.current && isListeningRef.current && mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              try { mediaRecorderRef.current.stop(); } catch {}
            }
          }, 6500);
          return;
        }

        setIsListening(false);

        if (event.error === 'not-allowed') {
          setSttError('Microphone permission was denied. Please allow microphone access in your browser to speak with Mr. Kennedy.');
          setIsVoiceSessionActive(false);
        } else if (event.error === 'no-speech') {
          if (!submissionLockRef.current && !latestTranscriptRef.current.trim()) {
            setSttError('No speech was detected. Click below to retry or type your question.');
          }
        } else if (event.error !== 'aborted') {
          setSttError(`Voice input error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        logDiag('STT', 'recognition.onend fired.');
        clearTimers();

        // If Web Speech didn't trigger submission, stop MediaRecorder to transcribe with Whisper
        if (!submissionLockRef.current && mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          try { mediaRecorderRef.current.stop(); } catch {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      logDiag('STT', 'recognition.start() called.');
    } catch (err: any) {
      logDiag('STT', 'Speech recognition loop fallback:', err);
      useWhisperModeRef.current = true;
      setIsListening(true);
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

      // STEP B: Fallback to Browser SpeechSynthesis if Neural Voice unavailable (English + Hindi Support)
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        logDiag('TTS', 'Executing browser speech synthesis.');
        const utterance = new SpeechSynthesisUtterance(cleanText);

        const isHindi = /[\u0900-\u097F]/.test(cleanText) || voiceLanguage === 'hi';
        if (isHindi) {
          const hindiVoice = availableVoices.find((v) => v.lang.startsWith('hi') && v.voice)?.voice;
          if (hindiVoice) {
            utterance.voice = hindiVoice;
            utterance.lang = 'hi-IN';
          } else {
            utterance.lang = 'hi-IN';
          }
        } else if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang || 'en-US';
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

  // 8. Send user message & stream response using OpenAI / RAG Knowledge Engine
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

      // 1. FAST DETERMINISTIC VOICE NAVIGATION INTENT ROUTER
      const navIntent = matchNavigationIntent(text);
      if (navIntent.matched) {
        logDiag('Nav', `Matched navigation intent: ${navIntent.actionType} -> ${navIntent.targetId || navIntent.projectSlug || navIntent.direction}`);
        setIsProcessing(false);

        // A. Trigger specific navigation action
        if (navIntent.actionType === 'scroll_section' && navIntent.targetId) {
          if (onScrollToSection) {
            onScrollToSection(navIntent.targetId);
          }
        } else if (navIntent.actionType === 'open_resume') {
          const resumeUrl = profileData.resumes?.[0]?.url || '/AI_ML%20resume.pdf';
          try {
            window.open(resumeUrl, '_blank');
          } catch {}
          if (onScrollToSection) {
            onScrollToSection('hero');
          }
        } else if (navIntent.actionType === 'open_project' && navIntent.projectSlug) {
          if (onOpenProjectModal) {
            onOpenProjectModal(navIntent.projectSlug);
          }
        } else if (navIntent.actionType === 'close_modal') {
          window.dispatchEvent(new CustomEvent('close-project-modal'));
        } else if (navIntent.actionType === 'scroll_direction') {
          if (navIntent.direction === 'down') {
            window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
          } else if (navIntent.direction === 'up') {
            window.scrollBy({ top: -window.innerHeight * 0.75, behavior: 'smooth' });
          }
        }

        // B. Determine Response Text
        const isHindi = voiceLanguage === 'hi' || /[\u0900-\u097F]/.test(text);
        const spokenText = isHindi ? navIntent.spokenResponseHindi : navIntent.spokenResponse;
        const displayText = navIntent.displayMessage;

        const navActions: ChatAction[] = [];
        if (navIntent.actionType === 'scroll_section' && navIntent.targetId) {
          navActions.push({
            type: 'scroll',
            label: navIntent.actionLabel || `View ${navIntent.targetId}`,
            payload: navIntent.targetId,
          });
        } else if (navIntent.actionType === 'open_resume') {
          navActions.push({
            type: 'external_link',
            label: 'Download Resume (PDF)',
            payload: profileData.resumes?.[0]?.url || '/AI_ML%20resume.pdf',
          });
        } else if (navIntent.actionType === 'open_project' && navIntent.projectSlug) {
          navActions.push({
            type: 'project_modal',
            label: navIntent.actionLabel || 'View Case Study',
            payload: navIntent.projectSlug,
          });
        }

        const navAssistantMsg: ChatMessage = {
          id: `assistant-nav-${Date.now()}`,
          sender: 'assistant',
          text: displayText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: navActions,
          engine: 'voice_navigation_router',
          model: 'Deterministic Portfolio Navigator',
        };

        setMessages((prev) => [...prev, navAssistantMsg]);

        // C. Speak response aloud if voice output enabled
        if (isVoiceOutputEnabled) {
          await speakText(spokenText);
        }
        return;
      }

      try {
        const historyContext = messages.map((m) => ({ sender: m.sender, text: m.text }));

        const assistantMsgId = `assistant-${Date.now()}`;
        let accumulatedText = '';
        let streamFinished = false;

        // Visual streaming placeholder
        const streamingMsg: ChatMessage = {
          id: assistantMsgId,
          sender: 'assistant',
          text: '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStreaming: true,
        };

        setMessages((prev) => [...prev, streamingMsg]);

        // Stream tokens in real time from OpenAI via /api/chat
        const cancelStream = voiceService.streamChat(
          text,
          historyContext,
          {
            onToken: (token) => {
              if (generationAbortRef.current) return;
              accumulatedText += token;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantMsgId ? { ...m, text: accumulatedText } : m))
              );
            },
            onDone: async ({ sources, actions, engine, model, tokensPerSec }) => {
              if (generationAbortRef.current || streamFinished) return;
              streamFinished = true;
              currentAbortRef.current = null;
              setIsProcessing(false);

              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        text: accumulatedText,
                        isStreaming: false,
                        sources,
                        actions,
                        engine: engine || 'grounded_knowledge_engine',
                        model,
                        tokensPerSec,
                      }
                    : m
                )
              );

              // Speak aloud using natural AI voice if output is enabled
              if (!generationAbortRef.current && accumulatedText.trim()) {
                await speakText(accumulatedText);
              }
            },
            onError: async (errMsg) => {
              logDiag('AI', 'Backend stream error, using grounded knowledge fallback:', errMsg);
              currentAbortRef.current = null;
              const fallbackResponse = await kennedyEngine.query(text, historyContext);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        text: fallbackResponse.text,
                        isStreaming: false,
                        sources: fallbackResponse.sources,
                        actions: fallbackResponse.actions,
                        engine: 'grounded_knowledge_engine',
                        model: 'Grounded RAG Knowledge Engine (Zero-Cost / Public Demo)',
                      }
                    : m
                )
              );
              setIsProcessing(false);
              if (!generationAbortRef.current && fallbackResponse.text) {
                await speakText(fallbackResponse.text);
              }
            },
          }
        );

        currentAbortRef.current = cancelStream;
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
    [messages, speakText, stopSpeaking, onScrollToSection, onOpenProjectModal, isVoiceOutputEnabled, voiceLanguage]
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

    // Language & Open-Weight Engine Info
    voiceLanguage,
    setVoiceLanguage,
    ollamaStatus,
    isOllamaActive: Boolean(ollamaStatus?.available),
    activeLLMEngine,

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
      if (currentAbortRef.current) {
        currentAbortRef.current();
        currentAbortRef.current = null;
      }
      setIsProcessing(false);
      stopSpeaking();
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
