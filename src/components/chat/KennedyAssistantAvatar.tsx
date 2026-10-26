import React from 'react';
import { Sparkles } from 'lucide-react';

interface KennedyAssistantAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  isSpeaking?: boolean;
  isListening?: boolean;
  className?: string;
}

export const KennedyAssistantAvatar: React.FC<KennedyAssistantAvatarProps> = ({
  size = 'md',
  isSpeaking = false,
  isListening = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }[size];

  return (
    <div className={`relative shrink-0 flex items-center justify-center ${className}`}>
      {/* Outer Glow & Speaking Pulse Ring */}
      {isSpeaking && (
        <>
          <div className="absolute inset-0 rounded-full bg-cyan-400/40 animate-ping opacity-75" />
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 blur-sm opacity-80 animate-pulse" />
        </>
      )}

      {/* Listening Pulse Ring */}
      {isListening && (
        <>
          <div className="absolute inset-0 rounded-full bg-rose-500/40 animate-ping opacity-75" />
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 blur-sm opacity-80 animate-pulse" />
        </>
      )}

      {/* Core Avatar Spherical Container */}
      <div
        className={`${sizeClasses} relative rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[1.5px] shadow-lg shadow-indigo-500/30 flex items-center justify-center overflow-hidden`}
      >
        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center relative">
          {/* Subtle cosmic particle backdrop inside avatar */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/50 via-transparent to-transparent" />
          <Sparkles className={`${iconSizes} text-cyan-300 relative z-10 animate-pulse`} />
        </div>
      </div>

      {/* Online Status Dot */}
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 shadow-sm" />
    </div>
  );
};

// Backward compatibility alias
export const NovaAssistantAvatar = KennedyAssistantAvatar;
