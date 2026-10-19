import React, { useEffect } from 'react';
import { 
  ArrowRight, 
  Terminal, 
  Volume2, 
  VolumeX,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { profileData } from '../../data/profile';

interface CosmicAwakeningProps {
  onExploreProjects: () => void;
  onViewPortfolio: () => void;
  onEnterUniverse?: () => void;
  onPlayClick?: () => void;
  onSkipIntro?: () => void;
  isMuted?: boolean;
  onToggleSound?: () => void;
}

export const CosmicAwakening: React.FC<CosmicAwakeningProps> = ({
  onExploreProjects,
  onViewPortfolio,
  onEnterUniverse,
  onPlayClick,
  isMuted,
  onToggleSound,
}) => {
  const handleAction = React.useCallback((cb: () => void) => {
    if (onPlayClick) onPlayClick();
    cb();
  }, [onPlayClick]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Primary Call to Action on Enter
      if (e.key === 'Enter') {
        handleAction(onExploreProjects);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAction, onExploreProjects]);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 py-6 sm:px-6 sm:py-8 z-20 pointer-events-none select-none">
      
      {/* Soft Radial Ambient Scrim to Guarantee Maximum Text Legibility */}
      <div 
        className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="w-[92vw] max-w-4xl h-[75vh] max-h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.38)_55%,transparent_80%)] blur-2xl" />
      </div>

      {/* Top Header Row: Identity Mark & Controls */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Top Left: Nagendra Kushwaha Identity Mark */}
        <div className="flex items-center space-x-3 group">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl glass-panel border border-cyan-400/40 shadow-glow-cyan flex items-center justify-center p-1.5 bg-black/60 group-hover:border-cyan-300 transition-all">
            <img 
              src="/favicon.svg" 
              alt="Nagendra Kushwaha Logo" 
              className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform duration-300" 
            />
            <div className="absolute inset-0 rounded-2xl animate-pulse opacity-20 bg-cyan-400 pointer-events-none" />
          </div>
          <div className="text-left">
            <span className="block text-xs sm:text-sm font-mono tracking-wider font-bold text-white uppercase leading-tight">
              {profileData.name}
            </span>
            <span className="block text-[10px] sm:text-[11px] font-mono text-cyan-400 tracking-wider">
              AI/ML & Data Science
            </span>
          </div>
        </div>

        {/* Top Right: Audio Toggle & Quick 3D Galaxy Portal */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {onEnterUniverse && (
            <button
              onClick={() => handleAction(onEnterUniverse)}
              className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full glass-panel border border-cyan-500/25 text-cyan-300 hover:text-white hover:border-cyan-400/60 font-mono text-xs transition-all duration-200 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              title="Enter 3D Interactive Galaxy"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>3D Galaxy Portal</span>
            </button>
          )}

          {onToggleSound && (
            <button
              onClick={() => {
                if (onPlayClick) onPlayClick();
                onToggleSound();
              }}
              className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                isMuted
                  ? 'glass-panel border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  : 'glass-panel border-cyan-400 text-cyan-300 shadow-glow-cyan bg-cyan-500/10'
              }`}
              title={isMuted ? 'Turn Sound ON' : 'Mute Sound'}
              aria-label={isMuted ? 'Sound Disabled' : 'Sound Enabled'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
            </button>
          )}
        </div>
      </header>

      {/* Center Stage Hero: Structured Visual Hierarchy */}
      <main className="max-w-4xl w-full mx-auto text-center space-y-6 sm:space-y-8 my-auto pointer-events-auto py-8">
        
        {/* Eyebrow Status Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300/95 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="tracking-widest uppercase font-semibold text-[11px] sm:text-xs">
            AI/ML Engineer &bull; Bhopal, India
          </span>
        </div>

        {/* Primary Focal Point: Name Display */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="hero-heading font-display font-extrabold uppercase break-words drop-shadow-2xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-300">
              Nagendra
            </span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 drop-shadow-[0_0_24px_rgba(34,211,238,0.35)]">
              Kushwaha
            </span>
          </h1>

          {/* Professional Headline */}
          <p className="hero-subheading font-mono text-cyan-300/95 font-medium tracking-wide max-w-2xl mx-auto">
            AI/ML Engineer &amp; Data Scientist &bull; Intelligent Systems
          </p>

          {/* Supporting Text: Concise & Verified Professional Introduction */}
          <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-slate-300/90 font-normal leading-relaxed px-2 sm:px-4">
            Designing and deploying end-to-end machine learning architectures, generative AI models, and predictive data pipelines &mdash; transforming complex multidimensional data into robust, real-world intelligence.
          </p>
        </div>

        {/* Action Controls: Primary and Secondary Calls to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 pt-2 sm:pt-4 w-full sm:w-auto">
          {/* Primary Call to Action: EXPLORE MY AI PROJECTS */}
          <button
            onClick={() => handleAction(onExploreProjects)}
            className="group relative w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:via-sky-400 hover:to-blue-500 text-white font-mono text-xs sm:text-sm tracking-wider font-semibold shadow-[0_0_22px_rgba(6,182,212,0.4)] hover:shadow-[0_0_32px_rgba(6,182,212,0.6)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center justify-center space-x-2.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
            aria-label="Explore My AI Projects - jump to verified projects section"
          >
            <Layers className="w-4 h-4 text-cyan-200" />
            <span>EXPLORE MY AI PROJECTS</span>
            <ArrowRight className="w-4 h-4 text-cyan-100 group-hover:translate-x-1 transition-transform duration-200" />
          </button>

          {/* Secondary Call to Action: VIEW FULL PORTFOLIO */}
          <button
            onClick={() => handleAction(onViewPortfolio)}
            className="w-full sm:w-auto px-6 py-3.5 sm:px-7 sm:py-4 rounded-full glass-panel border border-slate-700/80 hover:border-cyan-400/60 bg-black/40 hover:bg-cyan-950/20 text-slate-200 hover:text-white font-mono text-xs sm:text-sm tracking-wider font-medium transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
            aria-label="View Full Portfolio - access complete credentials, skills, and lab"
          >
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>VIEW FULL PORTFOLIO</span>
          </button>
        </div>

        {/* Telemetry / Proof Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono text-slate-400">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/5">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>10 Verified Projects</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/5">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>PyTorch &amp; Deep Learning</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/5">
            <Award className="w-3 h-3 text-emerald-400" />
            <span>B.Tech CSE &bull; 7.85 CGPA</span>
          </span>
        </div>

      </main>

      {/* Footer Hint for Seamless Keyboard Navigation */}
      <footer className="w-full max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-slate-500 pointer-events-auto py-2">
        <div className="hidden sm:flex items-center space-x-2">
          <span className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-900/60 text-slate-400 text-[10px]">
            ENTER
          </span>
          <span>to explore projects</span>
        </div>
        <div className="text-right w-full sm:w-auto">
          <span>{profileData.direction} &bull; v2.6</span>
        </div>
      </footer>

    </div>
  );
};
