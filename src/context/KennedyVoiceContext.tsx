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
  voice: SpeechSynthesisVoice;
  displayName: string;
  gender: 'male' | 'female' | 'neutral';
  lang: string;
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
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  speechPitch: number;
  setSpeechPitch: (pitch: number) => void;

  // External Action Handlers
  onOpenProjectModal?: (slug: string) => void;
  onScrollToSection?: (sectionId: string) => void;
  onOpenLabTab?: (tab: string) => void;
  handleActionClick: (action: ChatAction) => void;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-1',
  sender: 'assistant',
  text: "Hello! I'm **Mr. Kennedy**, Nagendra Kushwaha's AI portfolio voice companion. I can discuss his machine learning research, verified projects, tech stack, and background while you browse anywhere on the portfolio. You can speak with me using your microphone or type your questions.",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  actions: [
    { type: 'scroll', label: 'Explore Verified Projects', payload: 'projects' },
    { type: 'scroll', label: 'View Skills Matrix', payload: 'skills' },
    { type: 'scroll', label: 'Contact Nagendra', payload: 'contact' },
  ],
};

const KennedyVoiceContext = createContext<KennedyVoiceContextType | null>(null);

// SpeechRecognition global interface
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

// Development Diagnostic Logger
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

  // 4. Voice Output Audio Settings
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState<boolean>(true);
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
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

  // Active state mirrors for non-stale callbacks
  const isSpeakingRef = useRef<boolean>(false);
  const isListeningRef = useRef<boolean>(false);
  const isVoiceSessionActiveRef = useRef<boolean>(false);
  const isMicMutedRef = useRef<boolean>(false);
  const audioLoopFrameRef = useRef<number | null>(null);

  isSpeakingRef.current = isSpeaking;
  isListeningRef.current = isListening;
  isVoiceSessionActiveRef.current = isVoiceSessionActive;
  isMicMutedRef.current = isMicMuted;

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

  // Initialize Available Voices
  const populateVoices = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    const maleKeywords = [
      'david', 'mark', 'george', 'james', 'daniel', 'alex', 'fred', 'oliver',
      'arthur', 'rishi', 'guy', 'male', 'richard', 'thomas', 'brian', 'steven', 'tom'
    ];
    const femaleKeywords = [
      'female', 'zira', 'jenny', 'aria', 'samantha', 'victoria', 'karen', 'moira',
      'fiona', 'tessa', 'siri', 'veena', 'catherine', 'hazel', 'susan', 'allison',
      'ava', 'clara', 'eva', 'shelby', 'heera', 'priya', 'kalpana', 'swara'
    ];

    const voiceList: VoiceOption[] = voices.map((v) => {
      const nameLower = v.name.toLowerCase();
      let gender: 'male' | 'female' | 'neutral' = 'neutral';
      if (maleKeywords.some((kw) => nameLower.includes(kw)) || (nameLower.includes('male') && !nameLower.includes('female'))) {
        gender = 'male';
      } else if (femaleKeywords.some((kw) => nameLower.includes(kw))) {
        gender = 'female';
      } else if (nameLower.includes('natural') || nameLower.includes('google')) {
        gender = 'male';
      }

      const genderLabel = gender === 'male' ? ' — Male' : gender === 'female' ? ' — Female' : '';
      return {
        voice: v,
        displayName: `${v.name} (${v.lang})${genderLabel}`,
        gender,
        lang: v.lang,
      };
    });

    setAvailableVoices(voiceList);

    const englishMale = voiceList.find(
      (v) => v.gender === 'male' && (v.lang.startsWith('en') || v.lang.startsWith('en-US') || v.lang.startsWith('en-GB') || v.lang.startsWith('en-IN'))
    );
    const anyMale = voiceList.find((v) => v.gender === 'male');
    const anyEnglish = voiceList.find((v) => v.lang.startsWith('en'));
    const bestVoice = englishMale?.voice || anyMale?.voice || anyEnglish?.voice || voices[0];
    if (bestVoice) {
      setSelectedVoice(bestVoice);
    }
  }, []);

  // Check STT & populate voices on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    populateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = populateVoices;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const supported = !!SpeechRecognitionClass;
    setSttSupported(supported);
    logDiag('STT', `SpeechRecognition API supported in browser: ${supported}`);

    // Lifecycle: Cleanup on tab unload
    const handleBeforeUnload = () => {
      logDiag('Lifecycle', 'Page beforeunload event triggered. Cleaning audio resources.');
      cleanupAudioResourcesRef.current();
    };

    // Safe background behavior: Pause mic if tab hidden to conserve resources
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logDiag('Lifecycle', 'Browser tab hidden. Pausing active speech recognition.');
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
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try { audioContextRef.current.close(); } catch {}
      audioContextRef.current = null;
    }
    if (audioLoopFrameRef.current) {
      cancelAnimationFrame(audioLoopFrameRef.current);
      audioLoopFrameRef.current = null;
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    isSpeakingRef.current = false;
    currentUtteranceRef.current = null;
    setAudioLevel(0);
    setMouthOpen(0);
    setCurrentViseme('rest');

    // If voice session is active and mic not muted, resume listening
    if (isVoiceSessionActiveRef.current && !isMicMutedRef.current) {
      setTimeout(() => {
        startListeningLoopRef.current();
      }, 150);
    }
  }, []);

  // 6. Speech-to-Text Listening Loop with Watchdog Timers and Interim Fallback
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
      recognition.continuous = false; // Turn-based mode eliminates buffer duplication
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

        // Watchdog Timer 1: If completely silent for 8 seconds, encourage the user
        watchdogTimerRef.current = setTimeout(() => {
          logDiag('STT', 'Watchdog 8s fired: No speech activity detected yet.');
          // Watchdog Timer 2: If still no speech after 14s, recover gracefully
          watchdogTimerRef.current = setTimeout(() => {
            logDiag('STT', 'Watchdog 14s fired: No speech detected. Recovering to ready state.');
            if (!submissionLockRef.current && isListeningRef.current) {
              setSttError('No speech was detected. Please click the mic or ask a question.');
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
          // Final transcript received from browser
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
          // Interim transcript live streaming
          setInterimTranscript(currentInterim);

          // Interim Silence Detection: If user pauses after speaking words for 1.4 seconds, auto-submit!
          if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = setTimeout(() => {
            if (!submissionLockRef.current && latestTranscriptRef.current.trim().length > 1) {
              submissionLockRef.current = true;
              const pendingText = latestTranscriptRef.current.trim();
              logDiag('STT', `Silence timeout auto-submitting interim transcript: "${pendingText}". Transitioning -> Processing.`);
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
          const err = 'Microphone permission was denied. Please allow microphone access in your browser settings to talk with Mr. Kennedy.';
          logDiag('Mic', err);
          setSttError(err);
          setIsVoiceSessionActive(false);
        } else if (event.error === 'no-speech') {
          // Silent timeout
          logDiag('STT', 'SpeechRecognition reported no-speech.');
          if (!submissionLockRef.current && !latestTranscriptRef.current.trim()) {
            setSttError('No speech was detected. Click below to retry or type your question.');
          }
        } else if (event.error === 'audio-capture') {
          setSttError('No microphone audio received. Please verify your system microphone is plugged in and unmuted.');
        } else if (event.error === 'network') {
          setSttError('Speech recognition network service error. Please check your internet connection or use text chat.');
        } else if (event.error !== 'aborted') {
          setSttError(`Voice input error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        logDiag('STT', 'onend fired.');
        clearTimers();
        setIsListening(false);

        // Fallback Recovery: If recognition ended and had pending interim text that wasn't locked:
        if (!submissionLockRef.current && latestTranscriptRef.current.trim().length > 1) {
          submissionLockRef.current = true;
          const capturedText = latestTranscriptRef.current.trim();
          logDiag('STT', `onend fallback auto-submitting transcript: "${capturedText}"`);
          setTranscript(capturedText);
          setInterimTranscript('');
          setIsProcessing(true);
          handleUserMessageRef.current(capturedText);
          return;
        }

        // If session is active and no speech was submitted, re-arm listening after brief pause
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

  // 7. Text-To-Speech (TTS) with Real-Time Phoneme & Mouth Lip Sync
  const speakText = useCallback(
    (rawText: string) => {
      if (!isVoiceOutputEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        logDiag('TTS', 'Speech synthesis skipped: output disabled or unsupported.');
        setIsProcessing(false);
        if (isVoiceSessionActiveRef.current && !isMicMutedRef.current) {
          setTimeout(() => startListeningLoopRef.current(), 600);
        }
        return;
      }

      // Stop previous utterance
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      // Clean markdown tags and URLs for natural human prosody
      const cleanText = rawText
        .replace(/[*_#`~[\]]/g, '')
        .replace(/https?:\/\/\S+/g, 'link')
        .replace(/\(https?:\/\/[^)]+\)/g, '')
        .replace(/[•–—]/g, ', ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) {
        logDiag('TTS', 'Clean text is empty after sanitization.');
        setIsProcessing(false);
        if (isVoiceSessionActiveRef.current && !isMicMutedRef.current) {
          startListeningLoopRef.current();
        }
        return;
      }

      setLastAssistantSnippet(cleanText.slice(0, 85) + (cleanText.length > 85 ? '...' : ''));

      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      utterance.volume = 1.0;

      let animAngle = 0;
      let activeWord = '';

      const animateMouthDuringSpeech = () => {
        if (!isSpeakingRef.current) return;

        animAngle += 0.32;
        const base = 0.55;
        const wave = Math.sin(animAngle) * 0.3 + Math.cos(animAngle * 2.3) * 0.15;
        const level = Math.max(0.08, Math.min(1.0, base + wave));

        setAudioLevel(level);
        setMouthOpen(level);

        if (activeWord) {
          const w = activeWord.toLowerCase();
          if (w.includes('o') || w.includes('u')) {
            setCurrentViseme('oh');
          } else if (w.includes('e') || w.includes('i')) {
            setCurrentViseme('ee');
          } else if (w.includes('m') || w.includes('b') || w.includes('p')) {
            setCurrentViseme('mm');
          } else if (w.includes('a')) {
            setCurrentViseme('aa');
          } else {
            setCurrentViseme('aa');
          }
        } else {
          setCurrentViseme(animAngle % 2 > 1 ? 'aa' : 'ee');
        }

        audioLoopFrameRef.current = requestAnimationFrame(animateMouthDuringSpeech);
      };

      utterance.onboundary = (e: SpeechSynthesisEvent) => {
        if (e.name === 'word') {
          const word = cleanText.substring(e.charIndex).split(/\s+/)[0] || '';
          activeWord = word;
        }
      };

      utterance.onstart = () => {
        logDiag('TTS', 'Speech synthesis utterance onstart. State -> speaking');
        setIsSpeaking(true);
        setIsProcessing(false);
        isSpeakingRef.current = true;

        // Pause STT listening while assistant speaks to prevent acoustic feedback loop
        if (recognitionRef.current) {
          try { recognitionRef.current.abort(); } catch {}
          setIsListening(false);
        }
        audioLoopFrameRef.current = requestAnimationFrame(animateMouthDuringSpeech);
      };

      utterance.onend = () => {
        logDiag('TTS', 'Speech synthesis utterance onend. State -> ready / listening');
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        currentUtteranceRef.current = null;
        if (audioLoopFrameRef.current) {
          cancelAnimationFrame(audioLoopFrameRef.current);
          audioLoopFrameRef.current = null;
        }
        // Strict stop: immediately reset mouth and audio level
        setAudioLevel(0);
        setMouthOpen(0);
        setCurrentViseme('rest');

        // Continuous conversational loop: auto-relaunch listening after comfort pause
        if (isVoiceSessionActiveRef.current && !isMicMutedRef.current) {
          logDiag('State', 'Auto-transitioning from Speaking -> Listening.');
          setTimeout(() => {
            if (isVoiceSessionActiveRef.current && !isSpeakingRef.current) {
              soundSynth.playAssistantListeningPing();
              startListeningLoopRef.current();
            }
          }, 350);
        }
      };

      utterance.onerror = (e) => {
        logDiag('TTS', 'Speech synthesis error:', e);
        setIsSpeaking(false);
        setIsProcessing(false);
        isSpeakingRef.current = false;
        currentUtteranceRef.current = null;
        setAudioLevel(0);
        setMouthOpen(0);
        setCurrentViseme('rest');

        if (isVoiceSessionActiveRef.current && !isMicMutedRef.current) {
          setTimeout(() => startListeningLoopRef.current(), 400);
        }
      };

      currentUtteranceRef.current = utterance;
      logDiag('TTS', `Executing window.speechSynthesis.speak() (voice="${selectedVoice?.name || 'default'}")`);
      window.speechSynthesis.speak(utterance);
    },
    [isVoiceOutputEnabled, selectedVoice, speechRate, speechPitch]
  );

  // 8. Send user message & generate grounded response from AI engine
  const handleUserMessage = useCallback(
    async (textToSend?: string) => {
      const text = (textToSend || '').trim();
      if (!text) {
        logDiag('AI', 'Empty query text passed to handleUserMessage. Ignoring.');
        setIsProcessing(false);
        return;
      }

      logDiag('AI', `Submitting question to KennedyKnowledgeEngine: "${text}"`);
      stopSpeaking();
      generationAbortRef.current = false;
      setIsProcessing(true);
      setSttError(null);

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Add user message to conversation history
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text,
        timestamp,
      };

      setMessages((prev) => [...prev, userMsg]);

      try {
        const queryStart = performance.now();
        const historyContext = messages.map((m) => ({ sender: m.sender, text: m.text }));
        
        // Query Mr. Kennedy's verified domain knowledge engine
        const response: AssistantResponse = await kennedyEngine.query(text, historyContext);
        const queryDuration = (performance.now() - queryStart).toFixed(0);
        logDiag('AI', `Knowledge engine returned response in ${queryDuration}ms (confidence=${response.confidence})`);

        if (generationAbortRef.current) {
          logDiag('AI', 'Generation aborted by user.');
          setIsProcessing(false);
          return;
        }

        const assistantMsgId = `assistant-${Date.now()}`;
        const fullText = response.text;

        // Streaming text effect
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
        const step = Math.max(1, Math.floor(words.length / 26));

        for (let i = 0; i < words.length; i += step) {
          if (generationAbortRef.current) break;
          const currentSlice = words.slice(0, i + step).join(' ');

          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsgId ? { ...m, text: currentSlice } : m))
          );
          await new Promise((r) => setTimeout(r, 16));
        }

        // Finalize full text in messages
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, text: fullText, isStreaming: false }
              : m
          )
        );

        // Speak response aloud in Mr. Kennedy's natural voice
        if (!generationAbortRef.current) {
          speakText(fullText);
        }
      } catch (err: any) {
        logDiag('AI', 'Error querying assistant knowledge engine:', err);
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

  // 9. Start Persistent Voice Session (Explicit User Trigger)
  const startVoiceSession = useCallback(async () => {
    logDiag('Session', 'startVoiceSession explicitly triggered by visitor.');
    setSttError(null);
    stopSpeaking();

    // Verify microphone access via Web Audio getUserMedia
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
        logDiag('Mic', 'Microphone permission granted successfully by user.');
        mediaStreamRef.current = stream;

        // Setup real-time AnalyserNode for audio level input metering
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
            } else {
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

      // Play pleasant futuristic startup chime
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

  // 10. End Persistent Voice Session
  const endVoiceSession = useCallback(() => {
    logDiag('Session', 'endVoiceSession explicitly triggered. Releasing all resources.');
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

  // 12. Retry Listening Control (For stuck state recovery)
  const retryListening = useCallback(() => {
    logDiag('Session', 'retryListening called. Resetting errors and re-arming recognition.');
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

  // Stop current generation
  const stopGeneration = useCallback(() => {
    generationAbortRef.current = true;
    setIsProcessing(false);
  }, []);

  // Clear chat history
  const clearChat = useCallback(() => {
    stopSpeaking();
    setMessages([WELCOME_MESSAGE]);
  }, [stopSpeaking]);

  // Toggle voice output mute
  const toggleVoiceOutput = useCallback(() => {
    setIsVoiceOutputEnabled((prev) => {
      const next = !prev;
      if (!next) {
        stopSpeaking();
      }
      return next;
    });
  }, [stopSpeaking]);

  // Handle Action Trigger from message action pills
  const handleActionClick = useCallback(
    (action: ChatAction) => {
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
    [onOpenLabTab, onOpenProjectModal, onScrollToSection, stopSpeaking]
  );

  // Compute formal state machine value
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
    // Chat Modal UI
    isChatOpen,
    openChat: () => setIsChatOpen(true),
    closeChat: () => setIsChatOpen(false),
    toggleChat: () => setIsChatOpen((prev) => !prev),
    isChatMinimized,
    setIsChatMinimized,

    // Voice Session State
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

    // Audio & Lip Sync
    audioLevel,
    mouthOpen,
    currentViseme,

    // Controls
    startVoiceSession,
    endVoiceSession,
    toggleMicMute,
    stopSpeaking,
    retryListening,

    // Conversation
    messages,
    sendMessage: handleUserMessage,
    stopGeneration,
    clearChat,

    // Voice Settings
    isVoiceOutputEnabled,
    toggleVoiceOutput,
    availableVoices,
    selectedVoice,
    setSelectedVoice,
    speechRate,
    setSpeechRate,
    speechPitch,
    setSpeechPitch,

    // Action Handlers
    onOpenProjectModal,
    onScrollToSection,
    onOpenLabTab,
    handleActionClick,
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
