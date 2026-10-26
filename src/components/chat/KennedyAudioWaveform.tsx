import React from 'react';
import { Square, Mic, MicOff, RotateCw } from 'lucide-react';
import type { AssistantState } from './KennedyTalkingAvatar';

export interface KennedyAudioWaveformProps {
  isActive?: boolean;
  state?: AssistantState;
  isSpeaking?: boolean;
  isListening?: boolean;
  isProcessing?: boolean;
  isThinking?: boolean;
  isMuted?: boolean;
  audioLevel?: number;
  onStopSpeaking?: () => void;
  onStopListening?: () => void;
  onToggleMute?: () => void;
  onRetry?: () => void;
  compact?: boolean;
}

export const KennedyAudioWaveform: React.FC<KennedyAudioWaveformProps> = ({
  isActive = false,
  state: _state,
  isSpeaking = false,
  isListening = false,
  isProcessing = false,
  isThinking = false,
  isMuted = false,
  audioLevel = 0,
  onStopSpeaking,
  onStopListening,
  onToggleMute,
  onRetry,
  compact = false,
}) => {
  const active = isActive || isSpeaking || isListening || isProcessing || isThinking || isMuted;
  if (!active) return null;

  const barCount = compact ? 12 : 18;
  const bars = Array.from({ length: barCount }, (_, i) => {
    const centerFactor = 1 - Math.abs(i - (barCount - 1) / 2) / ((barCount - 1) / 2);
    const harmonic = Math.sin((i / barCount) * Math.PI * 2 + (audioLevel || 0.2) * 6.5);
    const heightPercent = isProcessing || isThinking
      ? Math.max(15, 30 + Math.sin(Date.now() / 200 + i) * 20 * centerFactor)
      : isMuted
      ? 8
      : Math.max(
          12,
          Math.min(95, (audioLevel * 80 + harmonic * 22) * (0.35 + centerFactor * 0.65))
        );
    return heightPercent;
  });

  return (
    <div
      className={`relative rounded-xl border backdrop-blur-md shadow-lg flex items-center justify-between gap-2.5 text-xs font-mono transition-all duration-200 ${
        compact ? 'px-2.5 py-1.5' : 'px-3.5 py-2'
      } ${
        isSpeaking
          ? 'bg-slate-900/95 border-cyan-500/40 shadow-cyan-950/40 text-cyan-200'
          : isListening
          ? 'bg-slate-900/95 border-rose-500/40 shadow-rose-950/40 text-rose-200'
          : isProcessing || isThinking
          ? 'bg-slate-900/95 border-indigo-500/40 shadow-indigo-950/40 text-indigo-200'
          : isMuted
          ? 'bg-slate-900/95 border-amber-500/40 shadow-amber-950/40 text-amber-200'
          : 'bg-slate-900/90 border-slate-700/60 text-slate-300'
      }`}
    >
      {/* State Label & Indicator Dot */}
      <div className="flex items-center space-x-2 shrink-0">
        <div
          className={`w-2 h-2 rounded-full ${
            isSpeaking
              ? 'bg-cyan-400 animate-ping'
              : isListening
              ? 'bg-rose-500 animate-pulse'
              : isProcessing || isThinking
              ? 'bg-indigo-400 animate-spin'
              : isMuted
              ? 'bg-amber-400'
              : 'bg-emerald-400'
          }`}
        />
        <span className="text-[11px] font-semibold tracking-wide">
          {isSpeaking
            ? 'Speaking...'
            : isListening
            ? 'Listening to you...'
            : isProcessing || isThinking
            ? 'Processing question...'
            : isMuted
            ? 'Mic Muted'
            : 'Audio Active'}
        </span>
      </div>

      {/* Holographic Frequency Bars */}
      <div className="flex items-end justify-center space-x-1 h-5 flex-1 px-1">
        {bars.map((h, idx) => (
          <div
            key={idx}
            className={`w-1 rounded-full transition-all duration-75 ${
              isSpeaking
                ? 'bg-gradient-to-t from-cyan-500 to-indigo-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]'
                : isListening
                ? 'bg-gradient-to-t from-rose-500 to-pink-400 shadow-[0_0_6px_rgba(244,63,94,0.6)]'
                : isProcessing || isThinking
                ? 'bg-gradient-to-t from-indigo-500 to-purple-400 shadow-[0_0_6px_rgba(99,102,241,0.5)]'
                : isMuted
                ? 'bg-slate-600'
                : 'bg-cyan-600'
            }`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      {/* Action Controls: Interrupt (Stop Speaking), Mute, Done Listening */}
      <div className="shrink-0 flex items-center space-x-1.5">
        {/* Barge-in / Interrupt Speech */}
        {isSpeaking && onStopSpeaking && (
          <button
            onClick={onStopSpeaking}
            className="px-2 py-1 rounded-md bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 hover:text-white text-[10px] font-semibold flex items-center space-x-1 transition-all"
            title="Interrupt & Stop Speaking"
          >
            <Square className="w-2.5 h-2.5 fill-current text-cyan-400" />
            <span>Interrupt</span>
          </button>
        )}

        {/* Done / Stop Listening */}
        {isListening && onStopListening && (
          <button
            onClick={onStopListening}
            className="px-2 py-1 rounded-md bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 hover:text-white text-[10px] font-semibold flex items-center space-x-1 transition-all"
            title="Done Speaking"
          >
            <Mic className="w-2.5 h-2.5 text-rose-400" />
            <span>Done</span>
          </button>
        )}

        {/* Quick Mute Toggle */}
        {onToggleMute && (
          <button
            onClick={onToggleMute}
            className={`p-1 rounded-md border text-[10px] transition-all ${
              isMuted
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-300 hover:bg-amber-900'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMuted ? <MicOff className="w-3 h-3 text-amber-400" /> : <Mic className="w-3 h-3" />}
          </button>
        )}

        {/* Retry Button if available */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="p-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-all"
            title="Retry Voice Listening"
          >
            <RotateCw className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

// Backward compatibility alias
export const NovaAudioWaveform = KennedyAudioWaveform;
