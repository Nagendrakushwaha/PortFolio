import React from 'react';
import { Square, Mic } from 'lucide-react';

interface KennedyAudioWaveformProps {
  isActive: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  audioLevel: number;
  onStopSpeaking?: () => void;
  onStopListening?: () => void;
}

export const KennedyAudioWaveform: React.FC<KennedyAudioWaveformProps> = ({
  isActive,
  isSpeaking,
  isListening,
  audioLevel,
  onStopSpeaking,
  onStopListening,
}) => {
  if (!isActive) return null;

  // 16 bars for the holographic frequency visualizer
  const barCount = 16;
  const bars = Array.from({ length: barCount }, (_, i) => {
    // Symmetrical bell-curve multiplier for center-weighted waves
    const centerFactor = 1 - Math.abs(i - (barCount - 1) / 2) / ((barCount - 1) / 2);
    // Base height scaled by audioLevel with per-bar harmonic phase
    const harmonic = Math.sin((i / barCount) * Math.PI * 2 + audioLevel * 6);
    const heightPercent = Math.max(
      12,
      Math.min(95, (audioLevel * 75 + harmonic * 20) * (0.4 + centerFactor * 0.6))
    );
    return heightPercent;
  });

  return (
    <div className="relative px-3 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md shadow-lg flex items-center justify-between gap-3 text-xs font-mono transition-all">
      {/* Left indicator */}
      <div className="flex items-center space-x-2 shrink-0">
        <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-cyan-400 animate-ping' : 'bg-rose-500 animate-pulse'}`} />
        <span className="text-[11px] font-semibold text-cyan-300">
          {isSpeaking ? 'Mr. Kennedy Speaking...' : isListening ? 'Listening to You...' : 'Audio Active'}
        </span>
      </div>

      {/* Center Waveform Bars */}
      <div className="flex items-end justify-center space-x-1 h-6 flex-1 px-2">
        {bars.map((h, idx) => (
          <div
            key={idx}
            className={`w-1 rounded-full transition-all duration-75 ${isSpeaking
                ? 'bg-gradient-to-t from-cyan-500 to-indigo-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                : 'bg-gradient-to-t from-rose-500 to-pink-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
              }`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      {/* Right Stop Action */}
      <div className="shrink-0 flex items-center space-x-1">
        {isSpeaking && onStopSpeaking && (
          <button
            onClick={onStopSpeaking}
            className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-cyan-400 text-[10px] flex items-center space-x-1 transition-all"
            title="Stop Speaking"
          >
            <Square className="w-2.5 h-2.5 fill-current text-cyan-400" />
            <span>Stop</span>
          </button>
        )}

        {isListening && onStopListening && (
          <button
            onClick={onStopListening}
            className="px-2 py-1 rounded-md bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 text-[10px] flex items-center space-x-1 transition-all"
            title="Stop Listening"
          >
            <Mic className="w-2.5 h-2.5 text-rose-400" />
            <span>Done</span>
          </button>
        )}
      </div>
    </div>
  );
};

// Backward compatibility alias
export const NovaAudioWaveform = KennedyAudioWaveform;
