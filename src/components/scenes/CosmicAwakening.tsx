import React, { useEffect } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Compass, 
  ArrowRight, 
  FastForward, 
  Layers,
  Atom,
  Binary
} from 'lucide-react';
import { profileData } from '../../data/profile';
import { useTilt } from '../../hooks/useTilt';

interface CosmicAwakeningProps {
  onEnterGalaxy: () => void;
  onSkipIntro: () => void;
  onPlayClick?: () => void;
  isMuted?: boolean;
  onToggleSound?: () => void;
}

export const CosmicAwakening: React.FC<CosmicAwakeningProps> = ({
  onEnterGalaxy,
  onSkipIntro,
  onPlayClick,
  isMuted = true,
  onToggleSound,
}) => {
  const portalRef = useTilt<HTMLDivElement>({
    maxTilt: 12,
    scale: 1.03,
    perspective: 1200,
    magnetic: true,
    magneticForce: 0.18,
  });

  const buttonRef = useTilt<HTMLButtonElement>({
    maxTilt: 6,
    scale: 1.05,
    perspective: 800,
    magnetic: true,
    magneticForce: 0.2,
  });

  const handleAction = React.useCallback((cb: () => void) => {
    if (onPlayClick) onPlayClick();
    cb();
  }, [onPlayClick]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleAction(onEnterGalaxy);
      } else if (e.key === 'Escape') {
        handleAction(onSkipIntro);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAction, onEnterGalaxy, onSkipIntro]);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 py-6 sm:px-6 sm:py-8 z-20 pointer-events-none select-none overflow-hidden">
      
      {/* Cinematic Ambient Space Gradient */}
      <div 
        className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="w-[95vw] max-w-5xl h-[80vh] max-h-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,242,254,0.08)_0%,rgba(168,85,247,0.05)_45%,transparent_75%)] blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      {/* Top Header: Identity & Audio Controller */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        <div className="flex items-center space-x-3 group">
          <div className="relative w-11 h-11 rounded-2xl glass-panel border border-cyan-400/40 shadow-glow-cyan flex items-center justify-center p-2 bg-black/70 group-hover:border-cyan-300 transition-all duration-300">
            <img 
              src="/favicon.svg" 
              alt="Nagendra Kushwaha Logo" 
              className="w-full h-full object-contain filter drop-shadow group-hover:scale-110 transition-transform duration-300" 
            />
            <div className="absolute inset-0 rounded-2xl animate-ping opacity-25 bg-cyan-400 pointer-events-none" />
          </div>
          <div className="text-left">
            <span className="block text-xs sm:text-sm font-mono tracking-wider font-bold text-white uppercase leading-tight">
              {profileData.name}
            </span>
            <span className="block text-[10px] sm:text-[11px] font-mono text-cyan-400 tracking-wider">
              AI/ML Engineer &amp; Data Scientist
            </span>
          </div>
        </div>

        {/* Ambient Space Sound Toggle */}
        <div className="flex items-center space-x-3">
          {onToggleSound && (
            <button
              onClick={() => {
                if (onPlayClick) onPlayClick();
                onToggleSound();
              }}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-full border transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                isMuted
                  ? 'glass-panel border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/40'
                  : 'glass-panel border-cyan-400 text-cyan-300 shadow-[0_0_18px_rgba(6,182,212,0.4)] bg-cyan-500/10'
              }`}
              title={isMuted ? 'Turn Ambient Space Audio ON' : 'Mute Audio'}
              aria-label={isMuted ? 'Space Sound Muted' : 'Space Sound Active'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span className="text-[11px] font-mono hidden sm:inline">Audio Off</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-[11px] font-mono hidden sm:inline text-cyan-300">Space Audio Active</span>
                  <span className="flex space-x-0.5">
                    <span className="w-0.5 h-2.5 bg-cyan-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 h-3.5 bg-cyan-300 animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-2 bg-cyan-500 animate-pulse" style={{ animationDelay: '300ms' }} />
                  </span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => handleAction(onSkipIntro)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full glass-panel border border-white/15 text-slate-300 hover:text-white hover:border-cyan-400 font-mono text-xs transition-all duration-200 cursor-pointer"
            title="Skip Intro to Portfolio"
          >
            <FastForward className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Skip Intro</span>
          </button>
        </div>
      </header>

      {/* Center Stage: Central Glowing Portal & Cosmic Identity */}
      <main className="max-w-4xl w-full mx-auto text-center space-y-6 sm:space-y-8 my-auto pointer-events-auto py-6 flex flex-col items-center">
        
        {/* Central Glowing Wormhole / Cosmic Portal Graphic */}
        <div 
          ref={portalRef}
          className="relative w-44 h-44 sm:w-56 sm:h-56 mx-auto flex items-center justify-center cursor-pointer group"
          onClick={() => handleAction(onEnterGalaxy)}
          title="Click to Enter the Galaxy"
        >
          {/* Outer Pulsating Gravitational Ring */}
          <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping opacity-25" style={{ animationDuration: '4s' }} />

          {/* Concentric Rotating Plasma Rings */}
          <div className="absolute -inset-2 rounded-full border-2 border-dashed border-cyan-500/40 animate-spin" style={{ animationDuration: '24s' }} />
          <div className="absolute inset-2 rounded-full border border-purple-500/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '18s' }} />
          <div className="absolute inset-6 rounded-full border border-sky-300/40 animate-pulse" style={{ animationDuration: '3s' }} />
          
          {/* Inner Event Horizon Glow */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-cyan-900/60 via-purple-950/80 to-blue-900/60 backdrop-blur-md border border-cyan-400/60 shadow-[0_0_40px_rgba(6,182,212,0.45),inset_0_0_30px_rgba(168,85,247,0.35)] flex items-center justify-center group-hover:scale-105 group-hover:border-cyan-300 transition-all duration-500">
            {/* Core Cosmic Singularity */}
            <div className="w-10 h-10 rounded-full bg-cyan-300 shadow-[0_0_24px_#38bdf8,0_0_48px_#22d3ee] animate-pulse flex items-center justify-center">
              <Compass className="w-5 h-5 text-black group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>

          {/* Orbital Orbiting Particles */}
          <div className="absolute w-full h-full animate-spin pointer-events-none" style={{ animationDuration: '10s' }}>
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
          </div>
          <div className="absolute w-full h-full animate-spin pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '14s' }}>
            <span className="absolute bottom-2 right-4 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
          </div>
        </div>

        {/* Identity & Headline */}
        <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto">
          {/* Status Eyebrow */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300/90 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
            <span className="tracking-widest uppercase font-semibold text-[11px] sm:text-xs">
              ✦ ENTERING PERSONAL AI UNIVERSE ✦
            </span>
          </div>

          <h1 className="hero-heading font-display font-extrabold uppercase break-words drop-shadow-2xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-300">
              Nagendra
            </span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 drop-shadow-[0_0_28px_rgba(34,211,238,0.45)]">
              Kushwaha
            </span>
          </h1>

          <p className="hero-subheading font-mono text-cyan-300 font-medium tracking-wide">
            AI/ML Engineer &amp; Data Scientist
          </p>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-300/90 font-normal leading-relaxed px-2">
            Step through the portal into an interactive galaxy of machine learning architectures, deep neural models, and verified production systems.
          </p>
        </div>

        {/* Primary Interactive CTA: ENTER THE GALAXY */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3 sm:pt-4 w-full sm:w-auto">
          <button
            ref={buttonRef}
            onClick={() => handleAction(onEnterGalaxy)}
            className="group relative w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-4.5 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:via-sky-400 hover:to-blue-500 text-white font-mono text-sm tracking-wider font-bold shadow-[0_0_30px_rgba(6,182,212,0.55)] hover:shadow-[0_0_45px_rgba(6,182,212,0.85)] transition-all duration-300 cursor-pointer flex items-center justify-center space-x-3 border border-cyan-300/40 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
            aria-label="Enter the Galaxy"
          >
            {/* Shimmer Border Light */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/30 via-transparent to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <Sparkles className="w-5 h-5 text-cyan-100 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="tracking-widest">ENTER THE GALAXY</span>
            <ArrowRight className="w-5 h-5 text-cyan-100 group-hover:translate-x-1.5 transition-transform duration-200" />
          </button>

          <button
            onClick={() => handleAction(onSkipIntro)}
            className="w-full sm:w-auto px-6 py-4 rounded-full glass-panel border border-slate-700/80 hover:border-cyan-400/60 bg-black/50 hover:bg-cyan-950/30 text-slate-300 hover:text-white font-mono text-xs sm:text-sm tracking-wider font-medium transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
            aria-label="Skip to Homepage"
          >
            <FastForward className="w-4 h-4 text-purple-400" />
            <span>SKIP INTRO</span>
          </button>
        </div>

        {/* Feature Badges */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono text-slate-400">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10">
            <Atom className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive 3D Space Engine</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>10 Verified ML Projects</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10">
            <Binary className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mr. Kennedy AI Assistant</span>
          </span>
        </div>

      </main>

      {/* Footer Navigation Hints */}
      <footer className="w-full max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-slate-500 pointer-events-auto py-2">
        <div className="hidden sm:flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded border border-slate-700 bg-slate-900/80 text-cyan-300 text-[10px]">
            ENTER
          </span>
          <span>to launch warp sequence</span>
          <span className="text-slate-600">|</span>
          <span className="px-2 py-0.5 rounded border border-slate-700 bg-slate-900/80 text-purple-300 text-[10px]">
            ESC
          </span>
          <span>to skip</span>
        </div>
        <div className="text-right w-full sm:w-auto">
          <span>{profileData.name} &bull; Personal AI Universe</span>
        </div>
      </footer>

    </div>
  );
};
