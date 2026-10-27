import {
  useKennedyVoiceContext,
  type VoiceOption,
} from '../context/KennedyVoiceContext';

export type { VoiceOption };

export interface UseKennedyVoiceAssistantOptions {
  onTranscriptFinal?: (transcript: string) => void;
  defaultMuted?: boolean;
}

/**
 * useKennedyVoiceAssistant Hook
 * Connected directly to the persistent KennedyVoiceContext so that all components
 * (Modal, Floating Companion, Navbar) share identical state, continuous conversation
 * loop, watchdog timers, and audio-synchronized lip-sync.
 */
export function useKennedyVoiceAssistant(_options: UseKennedyVoiceAssistantOptions = {}) {
  const ctx = useKennedyVoiceContext();

  return {
    // Voice output
    isVoiceOutputEnabled: ctx.isVoiceOutputEnabled,
    toggleVoiceOutput: ctx.toggleVoiceOutput,
    isSpeaking: ctx.isSpeaking,
    speak: (text: string) => ctx.sendMessage(text),
    stopSpeaking: ctx.stopSpeaking,
    availableVoices: ctx.availableVoices,
    selectedVoice: ctx.selectedVoice,
    setSelectedVoice: ctx.setSelectedVoice,
    speechRate: ctx.speechRate,
    setSpeechRate: ctx.setSpeechRate,
    speechPitch: ctx.speechPitch,
    setSpeechPitch: ctx.setSpeechPitch,
    selectedVoiceId: ctx.selectedVoiceId,
    setSelectedVoiceId: ctx.setSelectedVoiceId,
    activeProvider: ctx.activeProvider,
    setActiveProvider: ctx.setActiveProvider,
    isNeuralVoiceActive: ctx.isNeuralVoiceActive,

    // Voice session & input
    isVoiceSessionActive: ctx.isVoiceSessionActive,
    startVoiceSession: ctx.startVoiceSession,
    endVoiceSession: ctx.endVoiceSession,
    isListening: ctx.isListening,
    isProcessing: ctx.isProcessing,
    startListening: ctx.startVoiceSession,
    stopListening: ctx.stopSpeaking,
    retryListening: ctx.retryListening,
    isMicMuted: ctx.isMicMuted,
    toggleMicMute: ctx.toggleMicMute,
    transcript: ctx.transcript,
    interimTranscript: ctx.interimTranscript,
    sttSupported: ctx.sttSupported,
    sttError: ctx.sttError,

    // Real-time audio & mouth lip sync
    audioLevel: ctx.audioLevel,
    mouthOpen: ctx.mouthOpen,
    currentViseme: ctx.currentViseme,
    assistantState: ctx.assistantState,

    // Conversation & Messages
    messages: ctx.messages,
    isGenerating: ctx.isProcessing,
    sendMessage: ctx.sendMessage,
    clearChat: ctx.clearChat,
    stopGeneration: ctx.stopGeneration,
    lastAssistantSnippet: ctx.lastAssistantSnippet,

    // Modal Controls
    isChatOpen: ctx.isChatOpen,
    openChat: ctx.openChat,
    closeChat: ctx.closeChat,
    toggleChat: ctx.toggleChat,
    isChatMinimized: ctx.isChatMinimized,
    setIsChatMinimized: ctx.setIsChatMinimized,
    handleActionClick: ctx.handleActionClick,
  };
}

// Backward compatibility alias
export const useFemaleVoiceAssistant = useKennedyVoiceAssistant;
