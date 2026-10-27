import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Square,
  PhoneOff,
  MessageSquare,
  Sparkles,
  RotateCw,
} from 'lucide-react';
import { KennedyTalkingAvatar, type AssistantState } from './KennedyTalkingAvatar';
import { useKennedyVoiceAssistant } from '../../hooks/useKennedyVoiceAssistant';

export interface KennedyFloatingLauncherProps {
  isOpen?: boolean;
  onToggle?: () => void;
  isSpeaking?: boolean;
  isListening?: boolean;
}

export const KennedyFloatingLauncher: React.FC<KennedyFloatingLauncherProps> = ({
  isOpen: propIsOpen,
  onToggle: propOnToggle,
  isSpeaking: propIsSpeaking,
  isListening: propIsListening,
}) => {
  const voice = useKennedyVoiceAssistant();

  const isOpen = propIsOpen !== undefined ? propIsOpen : voice.isChatOpen;
  const isPanelCollapsed = !isOpen || voice.isChatMinimized;
  const handleToggle = () => {
    if (voice.isChatMinimized) {
      voice.setIsChatMinimized(false);
    } else if (propOnToggle) {
      propOnToggle();
    } else {
      voice.toggleChat();
    }
  };
  const isSpeaking = propIsSpeaking !== undefined ? propIsSpeaking : voice.isSpeaking;
  const isListening = propIsListening !== undefined ? propIsListening : voice.isListening;
  const isProcessing = voice.isProcessing;
  const isVoiceSessionActive = voice.isVoiceSessionActive;
  const isMicMuted = voice.isMicMuted;
  const assistantState: AssistantState = voice.assistantState;

  const [showSubtitle, setShowSubtitle] = useState<boolean>(true);

  // Active transcript preview text
  const activeSubtitle = isListening
    ? voice.interimTranscript || voice.transcript || 'Listening... Speak your question now'
    : isSpeaking
    ? voice.lastAssistantSnippet || 'Mr. Kennedy is speaking...'
    : isProcessing
    ? 'Processing question with portfolio knowledge engine...'
    : voice.sttError
    ? voice.sttError
    : null;

  return (
    <aside
      aria-label="Mr. Kennedy AI Voice Companion"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end space-y-2 pointer-events-none"
    >
      {/* 1. Live Conversational Speech Subtitle / Error Bubble */}
      {isVoiceSessionActive && isPanelCollapsed && activeSubtitle && showSubtitle && (
        <div className="pointer-events-auto max-w-[280px] sm:max-w-sm mb-1 px-3.5 py-2 rounded-2xl bg-slate-950/95 border border-cyan-500/40 text-xs font-mono shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 mb-1 border-b border-white/10">
            <span className="flex items-center space-x-1.5 font-bold">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSpeaking
                    ? 'bg-cyan-400 animate-ping'
                    : isListening
                    ? 'bg-rose-500 animate-pulse'
                    : isProcessing
                    ? 'bg-indigo-400 animate-spin'
                    : voice.sttError
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
              />
              <span
                className={
                  isSpeaking
                    ? 'text-cyan-300'
                    : isListening
                    ? 'text-rose-300'
                    : isProcessing
                    ? 'text-indigo-300'
                    : voice.sttError
                    ? 'text-amber-300'
                    : 'text-emerald-300'
                }
              >
                {isSpeaking
                  ? 'Mr. Kennedy Speaking'
                  : isListening
                  ? 'Listening to You'
                  : isProcessing
                  ? 'Processing'
                  : voice.sttError
                  ? 'Notice'
                  : 'Ready'}
              </span>
            </span>
            <div className="flex items-center space-x-1.5">
              {voice.sttError && (
                <button
                  onClick={voice.retryListening}
                  className="text-cyan-400 hover:text-cyan-200 flex items-center space-x-1 text-[10px]"
                  title="Retry Voice Listening"
                >
                  <RotateCw className="w-2.5 h-2.5" />
                  <span>Retry</span>
                </button>
              )}
              <button
                onClick={() => setShowSubtitle(false)}
                className="text-slate-500 hover:text-slate-300 text-[10px]"
                title="Dismiss preview"
              >
                ✕
              </button>
            </div>
          </div>
          <p className="text-slate-200 text-xs leading-relaxed italic line-clamp-3">
            "{activeSubtitle}"
          </p>
        </div>
      )}

      {/* 2. Floating Companion HUD Bar */}
      <div className="pointer-events-auto flex items-center space-x-2">
        {/* If voice session is ACTIVE and chat is closed or minimized: Quick Controls Bar */}
        {isVoiceSessionActive && isPanelCollapsed && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-950/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl text-xs font-mono animate-in fade-in duration-200">
            {/* Live State Badge Pill */}
            <div className="flex items-center space-x-1.5 pr-2 border-r border-white/15">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSpeaking
                    ? 'bg-cyan-400 animate-ping'
                    : isListening
                    ? 'bg-rose-500 animate-pulse'
                    : isProcessing
                    ? 'bg-indigo-400 animate-spin'
                    : isMicMuted
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
              />
              <span className="text-[11px] font-semibold text-slate-200 hidden sm:inline">
                {isSpeaking
                  ? 'Speaking'
                  : isListening
                  ? 'Listening'
                  : isProcessing
                  ? 'Processing'
                  : isMicMuted
                  ? 'Muted'
                  : 'Ready'}
              </span>
            </div>

            {/* Stop Speaking / Interrupt Button */}
            {isSpeaking && (
              <button
                onClick={voice.stopSpeaking}
                className="px-2 py-1 rounded-full bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 hover:text-white text-[10px] font-semibold flex items-center space-x-1 transition-all"
                title="Interrupt Mr. Kennedy and speak"
              >
                <Square className="w-2.5 h-2.5 fill-current text-cyan-400" />
                <span className="hidden sm:inline">Interrupt</span>
              </button>
            )}

            {/* Retry Button if an error occurred */}
            {voice.sttError && (
              <button
                onClick={voice.retryListening}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 hover:text-white transition-all"
                title="Retry Voice Listening"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mute / Unmute Microphone Control */}
            <button
              onClick={voice.toggleMicMute}
              className={`p-1.5 rounded-full border transition-all ${
                isMicMuted
                  ? 'bg-amber-950/90 border-amber-500/60 text-amber-300 hover:bg-amber-900 shadow-sm'
                  : 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              aria-label={isMicMuted ? 'Microphone Muted' : 'Microphone Active'}
            >
              {isMicMuted ? <MicOff className="w-3.5 h-3.5 text-amber-400" /> : <Mic className="w-3.5 h-3.5 text-rose-400" />}
            </button>

            {/* End Voice Session Control */}
            <button
              onClick={voice.endVoiceSession}
              className="p-1.5 rounded-full bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white transition-all"
              title="End Voice Conversation"
              aria-label="End Voice Conversation"
            >
              <PhoneOff className="w-3.5 h-3.5" />
            </button>

            {/* Reopen Chat Panel Button */}
            <button
              onClick={handleToggle}
              className="px-2 py-1 rounded-full bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-200 hover:text-white text-[10px] flex items-center space-x-1 transition-all"
              title="Expand conversation panel"
            >
              <MessageSquare className="w-3 h-3" />
              <span className="hidden sm:inline">Open Chat</span>
            </button>
          </div>
        )}

        {/* If NO voice session is active and chat is closed or minimized: Starter Buttons */}
        {!isVoiceSessionActive && isPanelCollapsed && (
          <div className="hidden sm:flex items-center space-x-2">
            <button
              onClick={voice.startVoiceSession}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-950/90 via-slate-900/90 to-cyan-950/90 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono shadow-xl backdrop-blur-md hover:scale-105 transition-all group"
              title="Start voice session with Mr. Kennedy"
            >
              <Mic className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
              <span>Voice Mode</span>
            </button>

            <button
              onClick={handleToggle}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono shadow-xl backdrop-blur-md hover:scale-105 transition-all group"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span>Ask Mr. Kennedy</span>
            </button>
          </div>
        )}

        {/* Primary Floating Avatar Anchor Orb */}
        <button
          onClick={handleToggle}
          aria-label={!isPanelCollapsed ? 'Minimize Mr. Kennedy Panel' : 'Open Mr. Kennedy AI Assistant'}
          className={`relative rounded-full p-[2px] transition-all duration-300 hover:scale-108 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-2xl ${
            !isPanelCollapsed
              ? 'ring-2 ring-indigo-500/60'
              : isVoiceSessionActive
              ? isSpeaking
                ? 'ring-2 ring-cyan-400 animate-pulse'
                : isListening
                ? 'ring-2 ring-rose-500 animate-pulse'
                : isProcessing
                ? 'ring-2 ring-indigo-400 animate-pulse'
                : 'ring-1 ring-cyan-500/50'
              : 'hover:ring-2 hover:ring-cyan-400'
          }`}
        >
          <KennedyTalkingAvatar
            size="md"
            state={assistantState}
            isSpeaking={isSpeaking}
            isListening={isListening}
            isProcessing={isProcessing}
            isThinking={isProcessing}
            isMuted={isMicMuted}
            audioLevel={voice.audioLevel}
            mouthOpen={voice.mouthOpen}
            viseme={voice.currentViseme}
            interactive={true}
            showAura={true}
            badge={true}
          />
        </button>
      </div>
    </aside>
  );
};

// Backward compatibility alias
export const NovaFloatingLauncher = KennedyFloatingLauncher;
