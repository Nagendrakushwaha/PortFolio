import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Minus,
  Maximize2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  Trash2,
  Copy,
  Check,
  Sliders,
  Sparkles,
  ArrowRight,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { KennedyAssistantAvatar } from './KennedyAssistantAvatar';
import { KennedyAudioWaveform } from './KennedyAudioWaveform';
import { kennedyEngine, type ChatAction, type AssistantResponse } from '../../lib/kennedyKnowledgeEngine';
import { useKennedyVoiceAssistant } from '../../hooks/useKennedyVoiceAssistant';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actions?: ChatAction[];
  sources?: string[];
  isStreaming?: boolean;
}

interface KennedyChatModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  'Can I hire him for an AI project?'
];

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-1',
  sender: 'assistant',
  text: "Hello! I'm **Mr. Kennedy**, Nagendra Kushwaha's AI portfolio assistant. I can tell you about his background, technical skills, projects, education, and experience. You can ask me anything about his professional profile. If you prefer, we can have a voice conversation instead of typing.",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  actions: [
    { type: 'scroll', label: 'Explore Verified Projects', payload: 'projects' },
    { type: 'scroll', label: 'View Skills Matrix', payload: 'skills' },
    { type: 'scroll', label: 'Contact Nagendra', payload: 'contact' },
  ]
};

export const KennedyChatModal: React.FC<KennedyChatModalProps> = ({
  isOpen,
  onClose,
  onOpenProjectModal,
  onScrollToSection,
  onOpenLabTab,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const generationAbortRef = useRef<boolean>(false);

  // Kennedy Voice Hook Integration
  const {
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
    isListening,
    startListening,
    stopListening,
    transcript,
    interimTranscript,
    sttSupported,
    sttError,
    audioLevel,
  } = useKennedyVoiceAssistant({
    onTranscriptFinal: (recognizedText) => {
      if (recognizedText.trim()) {
        handleSendMessage(recognizedText);
      }
    },
    defaultMuted: false,
  });

  // Auto-scroll to bottom of conversation
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      // Focus input on open if on desktop
      if (window.innerWidth > 768) {
        setTimeout(() => inputRef.current?.focus(), 250);
      }
    }
  }, [isOpen, isMinimized, messages, scrollToBottom]);

  // Handle Action Trigger from message
  const handleActionClick = (action: ChatAction) => {
    stopSpeaking();
    switch (action.type) {
      case 'project_modal':
        if (onOpenProjectModal) {
          onOpenProjectModal(action.payload);
        }
        break;
      case 'scroll':
        if (onScrollToSection) {
          onScrollToSection(action.payload);
        }
        break;
      case 'lab_tab':
        if (onOpenLabTab) {
          onOpenLabTab(action.payload);
        } else if (onScrollToSection) {
          onScrollToSection('mllab');
        }
        break;
      case 'external_link':
        window.open(action.payload, '_blank', 'noopener,noreferrer');
        break;
    }
  };

  // Send a message and generate assistant response
  const handleSendMessage = useCallback(async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isGenerating) return;

    setInputValue('');
    stopSpeaking();
    generationAbortRef.current = false;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      // Query Mr. Kennedy's Knowledge Engine with conversation history
      const historyContext = messages.map(m => ({ sender: m.sender, text: m.text }));
      const response: AssistantResponse = await kennedyEngine.query(text, historyContext);

      if (generationAbortRef.current) {
        setIsGenerating(false);
        return;
      }

      // Simulated streaming effect for smooth response delivery
      const assistantMsgId = `assistant-${Date.now()}`;
      const fullText = response.text;

      // Create streaming placeholder
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

      // Stream words
      const words = fullText.split(' ');
      const step = Math.max(1, Math.floor(words.length / 30));

      for (let i = 0; i < words.length; i += step) {
        if (generationAbortRef.current) break;
        const currentSlice = words.slice(0, i + step).join(' ');

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, text: currentSlice } : m))
        );

        // Small delay for natural cadence
        await new Promise((r) => setTimeout(r, 20));
      }

      // Finalize complete text
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, text: fullText, isStreaming: false }
            : m
        )
      );

      // Speak response aloud in natural voice if voice output is enabled
      if (isVoiceOutputEnabled && !generationAbortRef.current) {
        speak(fullText);
      }
    } catch (err) {
      console.error('Error generating response:', err);
      const errorMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        sender: 'assistant',
        text: "I encountered an issue retrieving that information. Please ask again or feel free to explore Nagendra's projects, skills, or contact info.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  }, [inputValue, isGenerating, isVoiceOutputEnabled, messages, speak, stopSpeaking]);

  // Stop Generation
  const handleStopGeneration = () => {
    generationAbortRef.current = true;
    setIsGenerating(false);
  };

  // Copy Message Text
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Clear Conversation
  const handleClearChat = () => {
    stopSpeaking();
    setMessages([WELCOME_MESSAGE]);
  };

  // Simple Markdown Formatter for Assistant Replies
  const formatMarkdown = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold text formatting
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-200 font-semibold">$1</strong>');
      // Inline code
      formatted = formatted.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px]">$1</code>');
      // Links
      formatted = formatted.replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">$1</a>'
      );

      // Bullet points
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={idx} className="flex items-start space-x-2 my-1 pl-1">
            <span className="text-cyan-400 mt-1">•</span>
            <span dangerouslySetInnerHTML={{ __html: formatted.replace(/^[•-]\s*/, '') }} />
          </div>
        );
      }

      // Empty line spacer
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="my-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="kennedy-title"
      aria-modal="true"
      className={`fixed z-50 transition-all duration-300 ${isMinimized
          ? 'bottom-6 right-6 w-72 sm:w-80 h-16'
          : 'inset-x-3 bottom-3 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[460px] md:w-[500px] h-[620px] max-h-[92vh]'
        }`}
    >
      {/* Main Glassmorphic Panel Container */}
      <div className="relative w-full h-full rounded-2xl bg-slate-950/95 border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl flex flex-col overflow-hidden text-slate-100">

        {/* Top Glow Accent Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500" />

        {/* ==================================================== */}
        {/* HEADER */}
        {/* ==================================================== */}
        <header className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-slate-900/60 shrink-0">
          <div className="flex items-center space-x-3">
            <KennedyAssistantAvatar
              size="sm"
              isSpeaking={isSpeaking}
              isListening={isListening}
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 id="kennedy-title" className="text-sm font-display font-bold text-white tracking-wide flex items-center space-x-1.5">
                  <span>Mr. Kennedy</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                    AI VOICE
                  </span>
                </h3>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Nagendra's Portfolio Assistant
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center space-x-1">
            {/* Toggle Voice Output Mute */}
            <button
              onClick={toggleVoiceOutput}
              className={`p-1.5 rounded-lg border transition-all ${isVoiceOutputEnabled
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              title={isVoiceOutputEnabled ? 'Mute Voice Output' : 'Unmute Voice Output'}
            >
              {isVoiceOutputEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Voice Settings */}
            <button
              onClick={() => setShowSettings((prev) => !prev)}
              className={`p-1.5 rounded-lg border transition-all ${showSettings
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              title="Voice & Speech Settings"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {/* Clear Chat */}
            <button
              onClick={handleClearChat}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 transition-all"
              title="Clear Conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Minimize / Maximize */}
            <button
              onClick={() => setIsMinimized((prev) => !prev)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 transition-all"
              title={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
            </button>

            {/* Close */}
            <button
              onClick={() => {
                stopSpeaking();
                stopListening();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 border border-slate-700 hover:border-rose-700 text-slate-400 transition-all"
              title="Close Assistant"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* If minimized, hide body */}
        {!isMinimized && (
          <>
            {/* ==================================================== */}
            {/* VOICE SETTINGS MODAL / FLYOUT */}
            {/* ==================================================== */}
            {showSettings && (
              <div className="p-3 bg-slate-900 border-b border-white/10 text-xs font-mono space-y-3 z-10 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-slate-300 font-bold">
                  <span>Mr. Kennedy Voice Settings</span>
                  <span className="text-[10px] text-cyan-400">Natural Speech</span>
                </div>

                {/* Voice Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Selected Voice:</label>
                  <select
                    value={selectedVoice?.name || ''}
                    onChange={(e) => {
                      const found = availableVoices.find((v) => v.voice.name === e.target.value);
                      if (found) setSelectedVoice(found.voice);
                    }}
                    className="w-full px-2 py-1.5 rounded bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    {availableVoices.map((v, i) => (
                      <option key={i} value={v.voice.name}>
                        {v.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rate & Pitch Sliders */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Speed</span>
                      <span>{speechRate.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="1.4"
                      step="0.1"
                      value={speechRate}
                      onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Pitch</span>
                      <span>{speechPitch.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.85"
                      max="1.25"
                      step="0.05"
                      value={speechPitch}
                      onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
                    />
                  </div>
                </div>

                {/* Test Voice Button */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => speak("Hello! I am Mr. Kennedy, Nagendra's AI assistant, ready to discuss his machine learning projects and engineering experience.")}
                    className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-semibold flex items-center space-x-1"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Test Voice</span>
                  </button>
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* ACTIVE AUDIO WAVEFORM BAR */}
            {/* ==================================================== */}
            <div className="px-4 pt-2">
              <KennedyAudioWaveform
                isActive={isSpeaking || isListening}
                isSpeaking={isSpeaking}
                isListening={isListening}
                audioLevel={audioLevel}
                onStopSpeaking={stopSpeaking}
                onStopListening={stopListening}
              />
            </div>

            {/* Speech-To-Text Error Banner */}
            {sttError && (
              <div className="mx-4 my-2 p-2 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span className="text-[11px] leading-tight">{sttError}</span>
              </div>
            )}

            {/* ==================================================== */}
            {/* MESSAGES LIST */}
            {/* ==================================================== */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 font-sans text-xs scrollbar-thin scrollbar-thumb-slate-800">
              {messages.map((msg) => {
                const isAssistant = msg.sender === 'assistant';

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-2.5 ${isAssistant ? 'justify-start' : 'justify-end'
                      }`}
                  >
                    {isAssistant && (
                      <KennedyAssistantAvatar size="sm" isSpeaking={isSpeaking} />
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 shadow-sm ${isAssistant
                          ? 'bg-slate-900/90 border border-white/10 text-slate-200'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium self-end rounded-tr-sm'
                        }`}
                    >
                      {/* Message Content */}
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

                      {/* Message Footer: Timestamp, Voice Replay, Copy */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                        <span>{msg.timestamp}</span>

                        {isAssistant && (
                          <div className="flex items-center space-x-1.5 opacity-80 hover:opacity-100 transition-opacity">
                            {/* Replay Voice */}
                            <button
                              onClick={() => speak(msg.text)}
                              className="p-1 hover:text-cyan-300 transition-colors"
                              title="Speak this response"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>

                            {/* Copy Text */}
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

              {/* Generating indicator */}
              {isGenerating && (
                <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs pl-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Mr. Kennedy is formulating a response...</span>
                  <button
                    onClick={handleStopGeneration}
                    className="ml-2 px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[10px]"
                  >
                    Stop
                  </button>
                </div>
              )}

              {/* Suggestions / Starter Pills */}
              {messages.length === 1 && (
                <div className="pt-2 space-y-2">
                  <div className="text-[11px] font-mono text-cyan-400/80 uppercase font-semibold">
                    Suggested Questions:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {INITIAL_SUGGESTIONS.map((suggestion, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(suggestion)}
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

            {/* ==================================================== */}
            {/* LIVE TRANSCRIPTION PREVIEW WHEN LISTENING */}
            {/* ==================================================== */}
            {isListening && (
              <div className="px-4 py-2 bg-slate-900/80 border-t border-rose-500/30 text-xs font-mono text-rose-300 flex items-center space-x-2 animate-pulse">
                <Mic className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="italic truncate">
                  {interimTranscript || transcript || 'Listening... Speak your question now'}
                </span>
              </div>
            )}

            {/* ==================================================== */}
            {/* INPUT & VOICE CONTROLS */}
            {/* ==================================================== */}
            <footer className="p-3 border-t border-white/10 bg-slate-900/70 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                {/* Speech-to-Text Microphone Button */}
                {sttSupported && (
                  <button
                    type="button"
                    onClick={() => {
                      if (isListening) {
                        stopListening();
                      } else {
                        startListening();
                      }
                    }}
                    className={`p-2.5 rounded-full border transition-all ${isListening
                        ? 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-500/40 animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-cyan-300'
                      }`}
                    title={isListening ? 'Stop Listening' : 'Speak to Mr. Kennedy (AI Voice Assistant)'}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                )}

                {/* Text Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    isListening
                      ? 'Listening to your voice...'
                      : 'Ask Mr. Kennedy about projects, skills, education...'
                  }
                  disabled={isListening}
                  className="flex-1 px-3.5 py-2.5 rounded-full bg-slate-950 border border-slate-700/80 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isGenerating}
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
