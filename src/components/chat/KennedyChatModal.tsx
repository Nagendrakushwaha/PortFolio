import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Minus,
  Maximize2,
  Volume2,
  Mic,
  MicOff,
  PhoneOff,
  Send,
  Copy,
  Check,
  Sliders,
  Sparkles,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  RotateCw,
  Database,
  Lock,
  Upload,
  Trash,
  CheckCircle2,
  Square,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { KennedyTalkingAvatar } from './KennedyTalkingAvatar';
import { useKennedyVoiceAssistant } from '../../hooks/useKennedyVoiceAssistant';
import { voiceService } from '../../lib/voiceService';
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
  'What is his professional experience at Tex Web Solutions?',
  'Explain the Customer Support AI project.',
  'What are his academic qualifications at Sam Global University?',
  'Explain his speech emotion recognition system.',
  'What technologies does he specialize in?',
  'Why can accuracy be misleading in fraud detection?',
  'What makes him suitable for an AI/ML Engineer role?',
  'How can I get in touch with Nagendra?',
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
  const [showKnowledgeAdmin, setShowKnowledgeAdmin] = useState<boolean>(false);
  
  // Knowledge Management State
  const [adminKey, setAdminKey] = useState<string>(() => {
    return sessionStorage.getItem('kennedy_admin_key') || '';
  });
  const [knowledgeStats, setKnowledgeStats] = useState<any>(null);
  const [knowledgeError, setKnowledgeError] = useState<string | null>(null);
  const [knowledgeSuccess, setKnowledgeSuccess] = useState<string | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState<boolean>(false);
  const [uploadCategory, setUploadCategory] = useState<string>('projects');
  const [uploadTitle, setUploadTitle] = useState<string>('');
  const [textSnippet, setTextSnippet] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isMinimized = voice.isChatMinimized;
  const setIsMinimized = voice.setIsChatMinimized;

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

  // Load Knowledge Stats when Admin Panel Opens
  const refreshKnowledgeStats = useCallback(async () => {
    if (!adminKey) return;
    try {
      const stats = await voiceService.listKnowledge(adminKey);
      if (stats.error) {
        setKnowledgeError(stats.error);
      } else {
        setKnowledgeStats(stats);
        setKnowledgeError(null);
      }
    } catch (err: any) {
      setKnowledgeError(err.message || 'Error fetching knowledge stats');
    }
  }, [adminKey]);

  useEffect(() => {
    if (showKnowledgeAdmin && adminKey) {
      refreshKnowledgeStats();
    }
  }, [showKnowledgeAdmin, adminKey, refreshKnowledgeStats]);

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

  // Handle Admin Key Save
  const handleSaveAdminKey = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem('kennedy_admin_key', adminKey);
    refreshKnowledgeStats();
  };

  // Handle File Upload for Ingestion
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !adminKey) return;

    setIsUploadingDoc(true);
    setKnowledgeError(null);
    setKnowledgeSuccess(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await voiceService.uploadKnowledge({
          filename: file.name,
          fileBase64: base64,
          category: uploadCategory,
          title: uploadTitle.trim() || file.name,
          adminKey,
        });

        setIsUploadingDoc(false);
        if (res.error) {
          setKnowledgeError(res.error);
        } else if (res.status === 'duplicate') {
          setKnowledgeSuccess(`Duplicate detected: ${res.message}`);
        } else {
          setKnowledgeSuccess(`Successfully indexed "${file.name}" into verified knowledge base! (${res.chunksCreated || 1} chunks)`);
          setUploadTitle('');
          if (fileInputRef.current) fileInputRef.current.value = '';
          refreshKnowledgeStats();
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setIsUploadingDoc(false);
      setKnowledgeError(err.message || 'File processing failed');
    }
  };

  // Handle Text Snippet Ingestion
  const handleTextSnippetUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textSnippet.trim() || !uploadTitle.trim() || !adminKey) return;

    setIsUploadingDoc(true);
    setKnowledgeError(null);
    setKnowledgeSuccess(null);

    const res = await voiceService.uploadKnowledge({
      title: uploadTitle.trim(),
      textContent: textSnippet.trim(),
      category: uploadCategory,
      adminKey,
    });

    setIsUploadingDoc(false);
    if (res.error) {
      setKnowledgeError(res.error);
    } else {
      setKnowledgeSuccess(`Added structured knowledge entry: "${uploadTitle}"`);
      setTextSnippet('');
      setUploadTitle('');
      refreshKnowledgeStats();
    }
  };

  // Handle Delete Knowledge Document
  const handleDeleteDoc = async (docId: string) => {
    if (!window.confirm('Are you sure you want to remove this document from the knowledge base?')) return;
    const ok = await voiceService.deleteKnowledge(docId, adminKey);
    if (ok) {
      refreshKnowledgeStats();
    } else {
      setKnowledgeError('Failed to delete document');
    }
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
          : 'inset-x-3 bottom-3 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[500px] md:w-[540px] h-[670px] max-h-[92vh]'
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
                        : voice.isNeuralVoiceActive
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    {voice.isVoiceSessionActive ? 'VOICE LIVE' : voice.isNeuralVoiceActive ? 'OPENAI REALTIME' : 'AI DIGITAL TWIN'}
                  </span>
                </h3>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Nagendra's AI Digital Twin &amp; Companion
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

            {/* Knowledge Management Admin Button */}
            <button
              onClick={() => {
                setShowKnowledgeAdmin((prev) => !prev);
                setShowSettings(false);
              }}
              className={`p-1.5 rounded-lg border transition-all ${
                showKnowledgeAdmin
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-indigo-400'
              }`}
              title="Knowledge Base & Document Management (Admin)"
              aria-label="Knowledge Base"
            >
              <Database className="w-3.5 h-3.5 text-indigo-400" />
            </button>

            {/* Voice Audio Settings Toggle */}
            <button
              onClick={() => {
                setShowSettings((prev) => !prev);
                setShowKnowledgeAdmin(false);
              }}
              className={`p-1.5 rounded-lg border transition-all ${
                showSettings
                  ? 'bg-cyan-600 border-cyan-400 text-white shadow-sm'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Voice & Audio Settings"
              aria-label="Voice Settings"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {/* Minimize / Maximize */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all"
              title={isMinimized ? 'Expand Mr. Kennedy' : 'Minimize'}
              aria-label={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
            </button>

            {/* Close */}
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/80 hover:border-rose-600 border border-slate-700 text-slate-400 hover:text-rose-300 transition-all"
              title="Close panel (Voice session will remain active)"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* ==================================================== */}
        {/* EXPANDABLE BODY CONTENT */}
        {/* ==================================================== */}
        {!isMinimized && (
          <>
            {/* 1. Knowledge Base Admin Management Panel */}
            {showKnowledgeAdmin && (
              <div className="p-4 bg-slate-900/98 border-b border-indigo-500/40 text-xs font-mono max-h-[380px] overflow-y-auto space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-bold text-indigo-300 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>Personal Knowledge System (Admin Workflow)</span>
                  </span>
                  <button
                    onClick={() => setShowKnowledgeAdmin(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>

                {/* Admin Key Input */}
                <form onSubmit={handleSaveAdminKey} className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Lock className="w-3 h-3 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="password"
                      value={adminKey}
                      onChange={(e) => setAdminKey(e.target.value)}
                      placeholder="Enter ADMIN_API_KEY to unlock upload & edit"
                      className="w-full pl-8 pr-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all"
                  >
                    Authenticate
                  </button>
                </form>

                {knowledgeError && (
                  <div className="p-2 rounded bg-rose-950/80 border border-rose-500/50 text-rose-300 text-[11px] flex items-center space-x-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{knowledgeError}</span>
                  </div>
                )}

                {knowledgeSuccess && (
                  <div className="p-2 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[11px] flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{knowledgeSuccess}</span>
                  </div>
                )}

                {/* Upload Form */}
                <div className="space-y-2 pt-1 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="Document title / subject (e.g. 2026 Resume or Instacart Paper)"
                      className="flex-1 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-400"
                    />
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="px-2 py-1.5 rounded bg-slate-950 border border-slate-700 text-white text-xs"
                    >
                      <option value="resume">Resume</option>
                      <option value="projects">Projects</option>
                      <option value="experience">Experience</option>
                      <option value="skills">Skills</option>
                      <option value="education">Education</option>
                      <option value="general">General</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg border border-dashed border-indigo-400/50 bg-indigo-950/30 hover:bg-indigo-900/40 text-indigo-300 hover:text-white cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span className="text-[11px]">
                        {isUploadingDoc ? 'Processing file...' : 'Upload PDF / DOCX / TXT / MD / JSON'}
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx,.txt,.md,.json"
                        onChange={handleFileUpload}
                        disabled={isUploadingDoc || !adminKey}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Or Structured Text Input */}
                  <div className="pt-1">
                    <textarea
                      value={textSnippet}
                      onChange={(e) => setTextSnippet(e.target.value)}
                      rows={2}
                      placeholder="Or paste direct Markdown/JSON text to index immediately..."
                      className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-400"
                    />
                    <button
                      onClick={handleTextSnippetUpload}
                      disabled={isUploadingDoc || !textSnippet.trim() || !uploadTitle.trim() || !adminKey}
                      className="mt-1 px-3 py-1 rounded bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-semibold disabled:opacity-40 transition-all"
                    >
                      Index Text Snippet
                    </button>
                  </div>
                </div>

                {/* Current Indexed Documents List */}
                {knowledgeStats && (
                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Total Knowledge Chunks: <strong className="text-cyan-300">{knowledgeStats.totalChunks}</strong> ({knowledgeStats.baseDossierChunks} base dossier)</span>
                      <button onClick={refreshKnowledgeStats} className="text-cyan-400 hover:text-cyan-200 flex items-center space-x-1">
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>Refresh</span>
                      </button>
                    </div>

                    <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                      {knowledgeStats.customDocuments?.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between p-1.5 rounded bg-slate-950 border border-slate-800 text-[10px]">
                          <div className="truncate flex-1 pr-2">
                            <span className="text-white font-semibold">{doc.title}</span>
                            <span className="text-slate-500 ml-1">({doc.category} &bull; {doc.chunkCount} chunks)</span>
                          </div>
                          <button
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="text-rose-400 hover:text-rose-200 p-1"
                            title="Delete document"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {(!knowledgeStats.customDocuments || knowledgeStats.customDocuments.length === 0) && (
                        <div className="text-[10px] text-slate-500 italic py-1 text-center">
                          Base verified dossier active. Upload additional documents above to expand Mr. Kennedy's knowledge.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Voice Audio Settings Drawer */}
            {showSettings && (
              <div className="p-3 bg-slate-900/98 border-b border-cyan-500/40 text-xs font-mono space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <span className="font-bold text-cyan-300">Voice &amp; Neural Speech Configuration</span>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400">Assistant Voice Selection:</label>
                  <select
                    value={voice.selectedVoiceId}
                    onChange={(e) => voice.setSelectedVoiceId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <optgroup label="✨ OpenAI Natural Female Voices (Recommended)">
                      <option value="shimmer">Shimmer (Expressive, Natural Female — Default)</option>
                      <option value="nova">Nova (Warm, Conversational Female)</option>
                      <option value="coral">Coral (Articulate, Contemporary Female)</option>
                    </optgroup>
                    <optgroup label="OpenAI Male &amp; Neutral Voices">
                      <option value="echo">Echo (Warm, Articulate Male)</option>
                      <option value="ash">Ash (Clear Contemporary Male)</option>
                      <option value="onyx">Onyx (Deep Authoritative Male)</option>
                      <option value="alloy">Alloy (Balanced Neutral)</option>
                    </optgroup>
                    <optgroup label="ElevenLabs Voices">
                      <option value="21m00Tcm4TlvDq8ikWAM">Rachel (ElevenLabs Natural Female)</option>
                      <option value="JBFqnCBsd6RMkjVDRZzb">George (ElevenLabs Warm British Male)</option>
                    </optgroup>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] uppercase text-slate-400">Speech Pace ({voice.speechRate}x):</label>
                    <input
                      type="range"
                      min="0.8"
                      max="1.3"
                      step="0.05"
                      value={voice.speechRate}
                      onChange={(e) => voice.setSpeechRate(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-400">Voice Pitch ({voice.speechPitch}x):</label>
                    <input
                      type="range"
                      min="0.8"
                      max="1.2"
                      step="0.05"
                      value={voice.speechPitch}
                      onChange={(e) => voice.setSpeechPitch(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Real-time Audio Waveform Visualizer */}
            {voice.isSpeaking && (
              <div className="px-4 py-1.5 bg-cyan-950/40 border-b border-cyan-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[10px] font-mono text-cyan-300 font-semibold tracking-wider uppercase">
                    Mr. Kennedy Speaking &bull; Live Audio Output
                  </span>
                </div>
                <button
                  onClick={voice.stopSpeaking}
                  className="px-2 py-0.5 rounded bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 text-[10px] font-mono flex items-center space-x-1"
                >
                  <Square className="w-2.5 h-2.5 fill-current" />
                  <span>Interrupt</span>
                </button>
              </div>
            )}

            {/* Error Notification Banner */}
            {voice.sttError && (
              <div className="p-2.5 bg-rose-950/80 border-b border-rose-500/50 text-rose-300 text-xs font-mono flex items-center justify-between">
                <div className="flex items-center space-x-2 truncate pr-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="truncate">{voice.sttError}</span>
                </div>
                <button
                  onClick={voice.retryListening}
                  className="px-2 py-1 rounded bg-rose-800 hover:bg-rose-700 text-white font-mono text-[10px] flex items-center space-x-1 shrink-0"
                >
                  <RotateCw className="w-2.5 h-2.5" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* ==================================================== */}
            {/* MESSAGES CONVERSATION CONTAINER */}
            {/* ==================================================== */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-mono">
              {voice.messages.map((msg) => {
                const isAssistant = msg.sender === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-md ${
                        isAssistant
                          ? 'bg-slate-900/90 border border-slate-700/80 text-slate-200'
                          : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-900/20'
                      }`}
                    >
                      {/* Message Content */}
                      <div className="space-y-1">
                        {isAssistant ? (
                          <>
                            <div>{formatMarkdown(msg.text)}</div>
                            {msg.isStreaming && (
                              <span className="inline-block w-1.5 h-3.5 ml-1 bg-cyan-400 animate-pulse align-middle" />
                            )}
                          </>
                        ) : (
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        )}
                      </div>

                      {/* Grounded Sources Badges */}
                      {isAssistant && msg.sources && msg.sources.length > 0 && !msg.isStreaming && (
                        <div className="mt-2 pt-1.5 border-t border-white/10 flex flex-wrap gap-1 items-center">
                          <span className="text-[9px] uppercase tracking-wider text-cyan-400/80 font-bold">
                            Grounded in:
                          </span>
                          {msg.sources.map((src, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-1.5 py-0.5 rounded bg-cyan-950/70 text-cyan-300 text-[9px] border border-cyan-800/60"
                            >
                              {src}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Chips */}
                      {isAssistant && msg.actions && msg.actions.length > 0 && !msg.isStreaming && (
                        <div className="mt-2.5 pt-1.5 border-t border-white/10 flex flex-wrap gap-1.5">
                          {msg.actions.map((action, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => handleActionClick(action)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/50 hover:border-indigo-400 text-indigo-200 hover:text-white text-[10px] font-semibold flex items-center space-x-1 transition-all"
                            >
                              <span>{action.label}</span>
                              {action.type === 'external_link' ? (
                                <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                              ) : (
                                <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Message Timestamp & Audio Controls */}
                      <div
                        className={`flex items-center justify-between text-[10px] mt-1.5 pt-1 border-t ${
                          isAssistant
                            ? 'border-white/5 text-slate-500'
                            : 'border-white/10 text-cyan-200'
                        }`}
                      >
                        <span>{msg.timestamp}</span>

                        {isAssistant && !msg.isStreaming && (
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
                  <span>Mr. Kennedy is thinking &amp; retrieving verified knowledge...</span>
                  <button
                    onClick={voice.stopGeneration}
                    className="ml-2 px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 hover:text-white border border-rose-700/80 text-[10px] flex items-center space-x-1"
                  >
                    <Square className="w-2.5 h-2.5 fill-current" />
                    <span>Stop</span>
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

                {/* Stop Generation Button when generating */}
                {voice.isProcessing ? (
                  <button
                    type="button"
                    onClick={voice.stopGeneration}
                    className="p-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md shadow-rose-500/20"
                    title="Stop Generating"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                ) : (
                  /* Send Button */
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || voice.isProcessing}
                    className="p-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white disabled:opacity-40 disabled:hover:from-cyan-500 disabled:hover:to-indigo-600 transition-all shadow-md shadow-indigo-500/20"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
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
