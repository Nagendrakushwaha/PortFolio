import { useState, useEffect, useRef, useCallback } from 'react';

// Declaration for Web Speech API SpeechRecognition
interface IWindowSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (event: Event) => void;
  onend: (event: Event) => void;
  onerror: (event: { error: string }) => void;
  onresult: (event: ISpeechRecognitionEvent) => void;
}

interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

declare global {
  interface Window {
    SpeechRecognition?: new () => IWindowSpeechRecognition;
    webkitSpeechRecognition?: new () => IWindowSpeechRecognition;
  }
}

export interface VoiceOption {
  voice: SpeechSynthesisVoice;
  displayName: string;
  isFemale: boolean;
  lang: string;
}

export interface UseFemaleVoiceAssistantOptions {
  onTranscriptFinal?: (transcript: string) => void;
  defaultMuted?: boolean;
}

export function useFemaleVoiceAssistant(options: UseFemaleVoiceAssistantOptions = {}) {
  const { onTranscriptFinal, defaultMuted = false } = options;

  // Voice output states
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState<boolean>(!defaultMuted);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [speechPitch, setSpeechPitch] = useState<number>(1.08); // Slightly higher pitch for natural female prosody

  // Speech-to-text (STT) states
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [sttSupported, setSttSupported] = useState<boolean>(false);
  const [sttError, setSttError] = useState<string | null>(null);

  // Audio waveform activity simulation
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const audioAnimationRef = useRef<number | null>(null);

  const recognitionRef = useRef<IWindowSpeechRecognition | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 1. Detect female voices & load available voices
  const populateVoices = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    // Female voice name patterns across Windows, Mac, Android, iOS, ChromeOS
    const femaleNameKeywords = [
      'female', 'zira', 'jenny', 'aria', 'samantha', 'victoria', 'karen', 'moira', 
      'fiona', 'tessa', 'siri', 'veena', 'catherine', 'hazel', 'susan', 'allison', 
      'ava', 'clara', 'eva', 'shelby', 'heera', 'priya', 'kalpana', 'swara'
    ];

    const voiceList: VoiceOption[] = voices.map((v) => {
      const nameLower = v.name.toLowerCase();
      const isFemale = femaleNameKeywords.some((kw) => nameLower.includes(kw)) ||
        (nameLower.includes('english') && !nameLower.includes('male') && (nameLower.includes('google') || nameLower.includes('natural')));

      return {
        voice: v,
        displayName: `${v.name} (${v.lang})${isFemale ? ' — Female' : ''}`,
        isFemale,
        lang: v.lang,
      };
    });

    setAvailableVoices(voiceList);

    // Prefer an English female voice by default
    const englishFemale = voiceList.find(
      (v) => v.isFemale && (v.lang.startsWith('en') || v.lang.startsWith('en-US') || v.lang.startsWith('en-GB') || v.lang.startsWith('en-IN'))
    );

    const anyFemale = voiceList.find((v) => v.isFemale);
    const anyEnglish = voiceList.find((v) => v.lang.startsWith('en'));

    const bestVoice = englishFemale?.voice || anyFemale?.voice || anyEnglish?.voice || voices[0];
    if (bestVoice) {
      setSelectedVoice(bestVoice);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    populateVoices();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = populateVoices;
    }

    // Check STT support
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSttSupported(!!SpeechRecognitionClass);

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (audioAnimationRef.current) {
        cancelAnimationFrame(audioAnimationRef.current);
      }
    };
  }, [populateVoices]);

  // 2. Audio Activity Waveform Simulator (only runs while actively speaking or listening)
  useEffect(() => {
    if (!isSpeaking && !isListening) {
      setAudioLevel(0);
      if (audioAnimationRef.current) {
        cancelAnimationFrame(audioAnimationRef.current);
        audioAnimationRef.current = null;
      }
      return;
    }

    let angle = 0;
    const animateAudio = () => {
      angle += 0.2;
      // Gentle pseudo-natural speech cadence curve
      const base = isSpeaking ? 0.6 : 0.45;
      const variation = Math.sin(angle) * 0.25 + Math.cos(angle * 2.3) * 0.15;
      const level = Math.max(0.1, Math.min(1.0, base + variation));
      setAudioLevel(level);
      audioAnimationRef.current = requestAnimationFrame(animateAudio);
    };

    audioAnimationRef.current = requestAnimationFrame(animateAudio);

    return () => {
      if (audioAnimationRef.current) {
        cancelAnimationFrame(audioAnimationRef.current);
      }
    };
  }, [isSpeaking, isListening]);

  // 3. Stop speaking immediately
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    currentUtteranceRef.current = null;
  }, []);

  // 4. Text-To-Speech (TTS)
  const speak = useCallback(
    (rawText: string) => {
      if (!isVoiceOutputEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }

      // Cancel any ongoing speech
      stopSpeaking();

      // Clean markdown tags, emojis, and symbols so speech sounds natural and crisp
      const cleanText = rawText
        .replace(/[*_#`~[\]]/g, '') // Markdown formatting
        .replace(/https?:\/\/\S+/g, 'link') // URLs
        .replace(/\(https?:\/\/[^)]+\)/g, '') // Link urls
        .replace(/[•–—]/g, ', ') // Bullets and dashes
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
      };

      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isVoiceOutputEnabled, selectedVoice, speechRate, speechPitch, stopSpeaking]
  );

  // 5. Speech-To-Text (STT) Start Listening
  const startListening = useCallback(() => {
    setSttError(null);

    // Stop ongoing speech so user doesn't hear assistant while trying to talk
    stopSpeaking();

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setSttError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false; // Stop after sentence for clean conversational turns
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setInterimTranscript('');
      };

      recognition.onresult = (event: ISpeechRecognitionEvent) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          const text = item[0].transcript;
          if (item.isFinal) {
            currentFinal += text;
          } else {
            currentInterim += text;
          }
        }

        if (currentFinal) {
          setTranscript(currentFinal);
          setInterimTranscript('');
          if (onTranscriptFinal) {
            onTranscriptFinal(currentFinal);
          }
        } else {
          setInterimTranscript(currentInterim);
        }
      };

      recognition.onerror = (event: { error: string }) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSttError('Microphone permission was denied. Please allow microphone access to talk to Nova.');
        } else if (event.error === 'no-speech') {
          // Normal timeout if user was quiet
        } else {
          setSttError(`Voice error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: unknown) {
      console.error('Failed to start speech recognition:', err);
      setSttError('Could not access microphone.');
      setIsListening(false);
    }
  }, [stopSpeaking, onTranscriptFinal]);

  // 6. Stop Listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // 7. Toggle Voice Output (Mute/Unmute assistant speaking)
  const toggleVoiceOutput = useCallback(() => {
    setIsVoiceOutputEnabled((prev) => {
      const next = !prev;
      if (!next) {
        stopSpeaking();
      }
      return next;
    });
  }, [stopSpeaking]);

  return {
    // Voice output
    isVoiceOutputEnabled,
    toggleVoiceOutput,
    isSpeaking,
    speak,
    stopSpeaking,
    availableVoices,
    selectedVoice,
    setSelectedVoice,
    speechRate,
    setSpeechRate,
    speechPitch,
    setSpeechPitch,

    // Voice input
    isListening,
    startListening,
    stopListening,
    transcript,
    interimTranscript,
    sttSupported,
    sttError,

    // Audio visualization
    audioLevel,
  };
}
