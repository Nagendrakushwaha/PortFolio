import React from 'react';
import { Sparkles, Mic, MessageSquare } from 'lucide-react';

interface KennedyFloatingLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
  isSpeaking?: boolean;
  isListening?: boolean;
}

export const KennedyFloatingLauncher: React.FC<KennedyFloatingLauncherProps> = ({
  isOpen,
  onToggle,
  isSpeaking = false,
  isListening = false,
}) => {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center space-x-2">
      {/* Tooltip Pill */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-xl backdrop-blur-md hover:bg-slate-800 transition-all hover:scale-105 group"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span>Talk to Mr. Kennedy (AI Voice)</span>
        </button>
      )}

      {/* Circular Glowing Floating Button */}
      <button
        onClick={onToggle}
        aria-label="Toggle Mr. Kennedy AI Assistant"
        className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full p-[2px] transition-all duration-300 hover:scale-110 shadow-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isOpen
            ? 'bg-gradient-to-r from-rose-500 to-indigo-600 shadow-indigo-500/30'
            : 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 shadow-cyan-500/30'
          }`}
      >
        {/* Pulsing ring if speaking or listening */}
        {(isSpeaking || isListening) && (
          <div
            className={`absolute -inset-1 rounded-full animate-ping opacity-60 ${isSpeaking ? 'bg-cyan-400' : 'bg-rose-500'
              }`}
          />
        )}

        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/30 to-indigo-900/30" />

          {isOpen ? (
            <MessageSquare className="w-5 h-5 text-cyan-300 relative z-10" />
          ) : (
            <div className="relative z-10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
              <Mic className="w-2.5 h-2.5 text-white absolute -bottom-1 -right-1" />
            </div>
          )}
        </div>

        {/* Live status dot */}
        <span
          className={`absolute top-0 right-0 w-3 h-3 rounded-full ring-2 ring-slate-950 ${isSpeaking
              ? 'bg-cyan-400 animate-ping'
              : isListening
                ? 'bg-rose-500 animate-pulse'
                : 'bg-emerald-400'
            }`}
        />
      </button>
    </div>
  );
};

// Backward compatibility alias
export const NovaFloatingLauncher = KennedyFloatingLauncher;
