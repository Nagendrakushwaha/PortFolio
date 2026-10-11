import React from 'react';
import { Sparkles, ArrowRight, FastForward, Globe2, Terminal } from 'lucide-react';

interface CosmicAwakeningProps {
  onEnterUniverse: () => void;
  onSkipIntro: () => void;
  onExploreDirectly: () => void;
  onPlayClick?: () => void;
}

export const CosmicAwakening: React.FC<CosmicAwakeningProps> = ({
  onEnterUniverse,
  onSkipIntro,
  onExploreDirectly,
  onPlayClick,
}) => {
  const handleAction = (cb: () => void) => {
    if (onPlayClick) onPlayClick();
    cb();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 py-8 sm:py-12 z-20 pointer-events-none select-none">
      {/* Top Status Header */}
      <div className="w-full max-w-5xl flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-300">DIMENSIONAL LINK: STABLE</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <span>COORDINATES: RA 19h 50m / DEC +08°52'</span>
          <span className="text-slate-500">|</span>
          <span>SGU.CSE.2023_2027</span>
        </div>
      </div>

      {/* Main Cinematic Title & Identity */}
      <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 my-auto pointer-events-auto">
        {/* Subtle Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/30 shadow-glow-cyan">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase">
            A Journey Through The AI Multiverse
          </span>
        </div>

        {/* Hero Name with Glow */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight text-white uppercase">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400">
              Nagendra
            </span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 text-glow-cyan">
              Kushwaha
            </span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base font-mono tracking-widest text-slate-300 uppercase">
            AI/ML Engineer • Data Science • Intelligent Systems
          </p>
        </div>

        {/* Concise Objective / Positioning Quote */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed font-light">
          "Bridging theoretical neural computation, rigorous data science, and production intelligent systems across multidimensional feature spaces."
        </p>

        {/* Interactive Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {/* Main Enter Button */}
          <button
            onClick={() => handleAction(onEnterUniverse)}
            className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono text-sm tracking-wider font-semibold shadow-glow-cyan hover:shadow-cyan-400/60 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-3"
          >
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span>ENTER THE UNIVERSE</span>
            <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Quick Direct Exploration Option */}
          <button
            onClick={() => handleAction(onExploreDirectly)}
            className="px-6 py-4 rounded-full glass-panel border border-purple-500/30 text-purple-200 hover:text-white font-mono text-sm tracking-wider hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-300 flex items-center space-x-2"
          >
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>DIRECT PORTFOLIO ACCESS</span>
          </button>
        </div>

        {/* Skip Intro & Keyboard Hint */}
        <div className="pt-2 flex items-center justify-center space-x-4 text-xs font-mono text-slate-400">
          <button
            onClick={() => handleAction(onSkipIntro)}
            className="hover:text-cyan-300 transition-colors flex items-center space-x-1"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Skip Cinematic Intro</span>
          </button>
          <span>•</span>
          <span className="hidden sm:inline">Press any key or scroll to explore</span>
        </div>
      </div>

      {/* Footer Info HUD */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 pt-4 border-t border-white/5">
        <div className="flex items-center space-x-2">
          <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sam Global University • Computer Science & Eng. (2023–2027)</span>
        </div>
        <div className="mt-2 sm:mt-0 text-slate-400">
          Real-time WebGL Engine • Three.js
        </div>
      </div>
    </div>
  );
};
