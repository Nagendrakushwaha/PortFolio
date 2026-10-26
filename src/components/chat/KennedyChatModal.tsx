import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Minus,
  Maximize2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  PhoneOff,
  Send,
  Trash2,
  Copy,
  Check,
  Sliders,
  Sparkles,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  Radio,
  RotateCw,
} from 'lucide-react';
import { KennedyTalkingAvatar } from './KennedyTalkingAvatar';
import { KennedyAudioWaveform } from './KennedyAudioWaveform';
import { useKennedyVoiceAssistant } from '../../hooks/useKennedyVoiceAssistant';
import type { ChatAction } from '../../lib/kennedyKnowledgeEngine';

export interface KennedyChatModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenProjectModal?: (slug: string) => void;
  onScrollToSection?: (sectionId: string) => void;
  onOpenLabTab?: (tab: string) => void;
}

const INITIAL_SUGGESTIONS = [
  'Who is Nagendra Kushwaha?',
  'What projects has he developed?',
  'Explain the Customer Support AI project.',
  'What are his strongest skills?',
  'What is his experience with data analytics?',
  'Show me his GitHub projects.',
  'Explain his speech emotion detection system.',
  'Why can accuracy be misleading in fraud detection?',
  'Can I hire him for an AI project?',
];

export const KennedyChatModal: React.FC<KennedyChatModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  onOpenProjectModal,
  onScrollToSection,
  onOpenLabTab,
}) => {
  const voice = useKennedyVoiceAssistant();

  const isOpen = propIsOpen !== undefined ? propIsOpen : voice.isChatOpen;
  const handleClose = propOnClose || voice.closeChat;

  const [inputValue, setInputValue] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      if (window.innerWidth > 768) {
        setTimeout(() => inputRef.current?.focus(), 250);
      }
    }
  }, [isOpen, isMinimized, voice.messages, scrollToBottom]);

  // Handle Action Trigger from message
  const handleActionClick = (action: ChatAction) => {
    voice.stopSpeaking();
    if (action.type === 'project_modal' && onOpenProjectModal) {
      onOpenProjectModal(action.payload);
    } else if (action.type === 'scroll' && onScrollToSection) {
      onScrollToSection(action.payload);
    } else if (action.type === 'lab_tab') {
      if (onOpenLabTab) onOpenLabTab(action.payload);
      else if (onScrollToSection) onScrollToSection('mllab');
    } else if (action.type === 'external_link') {
      window.open(action.payload, '_blank', 'noopener,noreferrer');
    } else {
      voice.handleActionClick(action);
    }
  };

  // Submit user message
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputValue.trim();
    if (!text || voice.isProcessing) return;
    setInputValue('');
    voice.sendMessage(text);
  };

  // Copy Message Text
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Simple Markdown Formatter for Assistant Replies
  const formatMarkdown = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-200 font-semibold">$1</strong>');
      formatted = formatted.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px]">$1</code>');
      formatted = formatted.replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">$1</a>'
      );

      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={idx} className="flex items-start space-x-2 my-1 pl-1">
            <span className="text-cyan-400 mt-1">•</span>
            <span dangerouslySetInnerHTML={{ __html: formatted.replace(/^[•-]\s*/, '') }} />
          </div>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="my-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  // If chat panel is hidden, return null (Voice session continues in background!)
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="kennedy-title"
      aria-modal="true"
      className={`fixed z-50 transition-all duration-300 ${
        isMinimized
          ? 'bottom-6 right-6 w-80 h-16'
          : 'inset-x-3 bottom-3 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[480px] md:w-[520px] h-[640px] max-h-[92vh]'
      }`}
    >
      {/* Main Glassmorphic Panel Container */}
      <div className="relative w-full h-full rounded-2xl bg-slate-950/95 border border-cyan-500/35 shadow-2xl shadow-cyan-950/60 backdrop-blur-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Glow Accent Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500" />

        {/* ==================================================== */}
        {/* HEADER */}
        {/* ==================================================== */}
        <header className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-slate-900/70 shrink-0">
          <div className="flex items-center space-x-3">
            <KennedyTalkingAvatar
              size="sm"
              state={voice.assistantState}
              isSpeaking={voice.isSpeaking}
              isListening={voice.isListening}
              isProcessing={voice.isProcessing}
              isThinking={voice.isProcessing}
              isMuted={voice.isMicMuted}
              audioLevel={voice.audioLevel}
              mouthOpen={voice.mouthOpen}
              viseme={voice.currentViseme}
              interactive={false}
              showAura={true}
              badge={true}
            />

            <div>
              <div className="flex items-center space-x-2">
                <h3 id="kennedy-title" className="text-sm font-display font-bold text-white tracking-wide flex items-center space-x-1.5">
                  <span>Mr. Kennedy</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono border ${
                      voice.isVoiceSessionActive
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    {voice.isVoiceSessionActive ? 'VOICE LIVE' : 'AI VOICE'}
                  </span>
                </h3>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Nagendra's Persistent AI Companion
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center space-x-1">
            {/* Toggle Persistent Voice Session Mode */}
            <button
              onClick={() => {
                if (voice.isVoiceSessionActive) {
                  voice.endVoiceSession();
                } else {
                  voice.startVoiceSession();
                }
              }}
              className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all ${
                voice.isVoiceSessionActive
                  ? 'bg-rose-950/80 border-rose-600/70 text-rose-300 hover:bg-rose-900 shadow-sm'
                  : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/90'
              }`}
              title={voice.isVoiceSessionActive ? 'End active voice session' : 'Start interactive voice conversation'}
            >
              {voice.isVoiceSessionActive ? (
                <>
                  <PhoneOff className="w-3 h-3 text-rose-400" />
                  <span className="hidden sm:inline">End Voice</span>
                </>
              ) : (
                <>
                  <Mic className="w-3 h-3 text-cyan-400" />
                  <span className="hidden sm:inline">Voice Mode</span>
                </>
              )}
            </button>

            {/* Mute Microphone */}
            {voice.isVoiceSessionActive && (
              <button
                onClick={voice.toggleMicMute}
                className={`p-1.5 rounded-lg border transition-all ${
                  voice.isMicMuted
                    ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 hover:bg-amber-900'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title={voice.isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {voice.isMicMuted ? <MicOff className="w-3.5 h-3.5 text-amber-400" /> : <Mic className="w-3.5 h-3.5 text-rose-400" />}
              </button>
            )}

            {/* Toggle Spoken Speech Audio Output Mute */}
            <button
              onClick={voice.toggleVoiceOutput}
              className={`p-1.5 rounded-lg border transition-all ${
                voice.isVoiceOutputEnabled
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title={voice.isVoiceOutputEnabled ? 'Mute Assistant Audio' : 'Unmute Assistant Audio'}
            >
              {voice.isVoiceOutputEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Voice Settings */}
            <button
              onClick={() => setShowSettings((prev) => !prev)}
              className={`p-1.5 rounded-lg border transition-all ${
                showSettings
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Voice & Speech Settings"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {/* Clear Chat */}
            <button
              onClick={voice.clearChat}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 transition-all"
              title="Clear Conversation History"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Minimize / Maximize Window */}
            <button
              onClick={() => setIsMinimized((prev) => !prev)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 transition-all"
              title={isMinimized ? 'Expand Chat Panel' : 'Minimize Chat Panel'}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
            </button>

            {/* Close / Hide Window */}
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 border border-slate-700 hover:border-rose-700 text-slate-400 transition-all"
              title="Hide Chat Panel (Voice continues in background if active)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* If minimized, hide body */}
        {!isMinimized && (
          <>
            {/* Active Voice Session Status Notice Banner */}
            {voice.isVoiceSessionActive && (
              <div className="px-4 py-1.5 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border-b border-cyan-500/30 text-[11px] font-mono text-cyan-200 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>
                    {voice.isListening
                      ? 'Listening to your speech... Speak freely or type'
                      : voice.isProcessing
                      ? 'Processing question...'
                      : voice.isSpeaking
                      ? 'Speaking response aloud...'
                      : 'Voice Session Active'}
                  </span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {voice.isMicMuted ? 'Muted' : 'Mic Live'}
                </span>
              </div>
            )}

            {/* Voice Settings Flyout */}
            {showSettings && (
              <div className="p-3 bg-slate-900 border-b border-white/10 text-xs font-mono space-y-3 z-10 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-slate-300 font-bold">
                  <span>Mr. Kennedy Voice Configuration</span>
                  <span className="text-[10px] text-cyan-400">Natural Synthesis</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Selected Voice:</label>
                  <select
                    value={voice.selectedVoice?.name || ''}
                    onChange={(e) => {
                      const found = voice.availableVoices.find((v) => v.voice.name === e.target.value);
                      if (found) voice.setSelectedVoice(found.voice);
                    }}
                    className="w-full px-2 py-1.5 rounded bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    {voice.availableVoices.map((v, i) => (
                      <option key={i} value={v.voice.name}>
                        {v.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Speed</span>
                      <span>{voice.speechRate.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="1.4"
                      step="0.1"
                      value={voice.speechRate}
                      onChange={(e) => voice.setSpeechRate(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Pitch</span>
                      <span>{voice.speechPitch.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.85"
                      max="1.25"
                      step="0.05"
                      value={voice.speechPitch}
                      onChange={(e) => voice.setSpeechPitch(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Active Audio Waveform Bar */}
            <div className="px-4 pt-2">
              <KennedyAudioWaveform
                isActive={voice.isSpeaking || voice.isListening || voice.isProcessing || voice.isMicMuted}
                state={voice.assistantState}
                isSpeaking={voice.isSpeaking}
                isListening={voice.isListening}
                isProcessing={voice.isProcessing}
                isThinking={voice.isProcessing}
                isMuted={voice.isMicMuted}
                audioLevel={voice.audioLevel}
                onStopSpeaking={voice.stopSpeaking}
                onToggleMute={voice.toggleMicMute}
                onRetry={voice.retryListening}
              />
            </div>

            {/* Speech-To-Text / Audio Input Error Banner with Retry Control */}
            {voice.sttError && (
              <div className="mx-4 my-2 p-2.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-center justify-between gap-2 shadow-lg animate-in fade-in duration-200">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span className="text-[11px] leading-snug">{voice.sttError}</span>
                </div>
                <button
                  onClick={voice.retryListening}
                  className="px-2.5 py-1 rounded-lg bg-rose-900/90 hover:bg-rose-800 text-rose-100 text-[11px] font-semibold flex items-center space-x-1 shrink-0 transition-all border border-rose-700"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 font-sans text-xs scrollbar-thin scrollbar-thumb-slate-800">
              {voice.messages.map((msg) => {
                const isAssistant = msg.sender === 'assistant';

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-2.5 ${
                      isAssistant ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    {isAssistant && (
                      <KennedyTalkingAvatar
                        size="xs"
                        state={voice.assistantState}
                        isSpeaking={voice.isSpeaking}
                        isListening={voice.isListening}
                        isProcessing={voice.isProcessing}
                        audioLevel={voice.audioLevel}
                        mouthOpen={voice.mouthOpen}
                        viseme={voice.currentViseme}
                        interactive={false}
                        showAura={false}
                        badge={false}
                      />
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 shadow-sm ${
                        isAssistant
                          ? 'bg-slate-900/90 border border-white/10 text-slate-200'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium self-end rounded-tr-sm'
                      }`}
                    >
                      <div className="space-y-1">
                        {isAssistant ? formatMarkdown(msg.text) : <p>{msg.text}</p>}
                      </div>

                      {/* Streaming cursor */}
                      {msg.isStreaming && (
                        <span className="inline-block w-1.5 h-3 bg-cyan-400 animate-pulse ml-1" />
                      )}

                      {/* Interactive Action Pills */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                          {msg.actions.map((act, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => handleActionClick(act)}
                              className="px-2.5 py-1 rounded-full bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 flex items-center space-x-1 transition-all hover:scale-105"
                            >
                              <span>{act.label}</span>
                              {act.type === 'external_link' ? (
                                <ExternalLink className="w-2.5 h-2.5 text-cyan-400" />
                              ) : (
                                <ArrowRight className="w-2.5 h-2.5 text-cyan-400" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Message Footer */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                        <span>{msg.timestamp}</span>

                        {isAssistant && (
                          <div className="flex items-center space-x-1.5 opacity-80 hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => voice.sendMessage(msg.text)}
                              className="p-1 hover:text-cyan-300 transition-colors"
                              title="Re-speak response aloud"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => handleCopy(msg.id, msg.text)}
                              className="p-1 hover:text-cyan-300 transition-colors"
                              title="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Processing indicator */}
              {voice.isProcessing && (
                <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs pl-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Mr. Kennedy is processing your question...</span>
                  <button
                    onClick={voice.stopGeneration}
                    className="ml-2 px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[10px]"
                  >
                    Stop
                  </button>
                </div>
              )}

              {/* Starter questions */}
              {voice.messages.length === 1 && (
                <div className="pt-2 space-y-2">
                  <div className="text-[11px] font-mono text-cyan-400/80 uppercase font-semibold">
                    Suggested Questions:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {INITIAL_SUGGESTIONS.map((suggestion, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => voice.sendMessage(suggestion)}
                        className="text-left px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-[11px] text-slate-300 hover:text-white transition-all shadow-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Live Transcription Preview when Listening */}
            {voice.isListening && (
              <div className="px-4 py-2 bg-slate-900/90 border-t border-rose-500/40 text-xs font-mono text-rose-300 flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-2 truncate">
                  <Mic className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="italic truncate">
                    {voice.interimTranscript || voice.transcript || 'Listening... Speak your question now'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 hidden sm:inline shrink-0 pl-2">
                  Speak clearly or type below
                </span>
              </div>
            )}

            {/* Input & Voice Controls Footer */}
            <footer className="p-3 border-t border-white/10 bg-slate-900/80 shrink-0">
              <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                {/* Microphone Toggle Button */}
                {voice.sttSupported && (
                  <button
                    type="button"
                    onClick={() => {
                      if (voice.isVoiceSessionActive) {
                        voice.toggleMicMute();
                      } else {
                        voice.startVoiceSession();
                      }
                    }}
                    className={`p-2.5 rounded-full border transition-all ${
                      voice.isListening
                        ? 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-500/40 animate-pulse'
                        : voice.isProcessing
                        ? 'bg-indigo-600 border-indigo-400 text-white animate-spin'
                        : voice.isVoiceSessionActive
                        ? 'bg-indigo-600 border-indigo-400 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-cyan-300'
                    }`}
                    title={
                      voice.isListening
                        ? 'Listening to you... (Click to mute)'
                        : voice.isProcessing
                        ? 'Processing question...'
                        : voice.isVoiceSessionActive
                        ? 'Voice session active (Click to toggle)'
                        : 'Start voice session with Mr. Kennedy'
                    }
                  >
                    {voice.isMicMuted ? (
                      <MicOff className="w-4 h-4 text-amber-300" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                )}

                {/* Text Input (Always available as reliable text-chat fallback) */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    voice.isListening
                      ? 'Listening to your voice... (or type here)'
                      : voice.isProcessing
                      ? 'Processing question...'
                      : 'Ask Mr. Kennedy about projects, skills, education...'
                  }
                  className="flex-1 px-3.5 py-2.5 rounded-full bg-slate-950 border border-slate-700/80 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputValue.trim() || voice.isProcessing}
                  className="p-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white disabled:opacity-40 disabled:hover:from-cyan-500 disabled:hover:to-indigo-600 transition-all shadow-md shadow-indigo-500/20"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};

// Backward compatibility alias
export const NovaChatModal = KennedyChatModal;
