import React, { useEffect } from 'react';
import { 
  ArrowRight, 
  Terminal, 
  Volume2, 
  VolumeX 
} from 'lucide-react';

interface CosmicAwakeningProps {
  onEnterUniverse: () => void;
  onExploreDirectly: () => void;
  onPlayClick?: () => void;
  onSkipIntro?: () => void;
  isMuted?: boolean;
  onToggleSound?: () => void;
}

export const CosmicAwakening: React.FC<CosmicAwakeningProps> = ({
  onEnterUniverse,
  onExploreDirectly,
  onPlayClick,
  isMuted,
  onToggleSound,
}) => {
  const handleAction = (cb: () => void) => {
    if (onPlayClick) onPlayClick();
    cb();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleAction(onEnterUniverse);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnterUniverse]);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 py-8 z-20 pointer-events-none select-none">
      {/* Top Left: Nagendra Kushwaha Logo */}
      <div className="absolute top-5 left-5 sm:top-7 sm:left-7 z-30 pointer-events-auto flex items-center space-x-3">
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl glass-panel border border-cyan-400/50 shadow-glow-cyan flex items-center justify-center p-1.5 bg-black/60 group hover:border-cyan-300 transition-all">
          <img 
            src="/favicon.svg" 
            alt="Nagendra Kushwaha Logo" 
            className="w-full h-full object-contain filter drop-shadow group-hover:scale-110 transition-transform duration-300" 
          />
          <div className="absolute inset-0 rounded-2xl animate-pulse opacity-25 bg-cyan-400 pointer-events-none" />
        </div>
        <div className="text-left">
          <span className="block text-xs sm:text-sm font-mono tracking-wider font-bold text-white uppercase leading-tight">
            Nagendra Kushwaha
          </span>
          <span className="block text-[10px] sm:text-[11px] font-mono text-cyan-400 tracking-wider">
            AI/ML & Data Science
          </span>
        </div>
      </div>

      {/* Top Right: Discreet Audio Toggle (No Navbar) */}
      {onToggleSound && (
        <div className="absolute top-5 right-5 sm:top-7 sm:right-7 z-30 pointer-events-auto">
          <button
            onClick={() => {
              if (onPlayClick) onPlayClick();
              onToggleSound();
            }}
            className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer ${
              isMuted
                ? 'glass-panel border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                : 'glass-panel border-cyan-400 text-cyan-300 shadow-glow-cyan bg-cyan-500/10'
            }`}
            title={isMuted ? 'Turn Sound ON' : 'Mute Sound'}
            aria-label={isMuted ? 'Sound Disabled' : 'Sound Enabled'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>
        </div>
      )}

      {/* Center Stage: Name and Action Buttons Only */}
      <div className="max-w-4xl w-full mx-auto text-center space-y-8 my-auto pointer-events-auto">
        
        {/* Name in Bold Cosmic Glow Typography */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-extrabold tracking-tight text-white uppercase drop-shadow-2xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400">
              Nagendra
            </span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 text-glow-cyan">
              Kushwaha
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base font-mono tracking-widest text-slate-300 uppercase font-medium">
            AI/ML Engineer • Data Science • Intelligent Systems
          </p>
        </div>

        {/* Action Controls: Entering AI Galaxy & Direct Access */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {/* Main Enter Button */}
          <button
            onClick={() => handleAction(onEnterUniverse)}
            className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono text-sm tracking-wider font-semibold shadow-glow-cyan hover:shadow-cyan-400/60 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-3 cursor-pointer"
          >
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span>ENTER AI GALAXY</span>
            <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Direct Portfolio Access Option */}
          <button
            onClick={() => handleAction(onExploreDirectly)}
            className="px-6 py-4 rounded-full glass-panel border border-purple-500/30 text-purple-200 hover:text-white font-mono text-sm tracking-wider hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-300 flex items-center space-x-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>DIRECT PORTFOLIO ACCESS</span>
          </button>
        </div>

      </div>
    </div>
  );
};
