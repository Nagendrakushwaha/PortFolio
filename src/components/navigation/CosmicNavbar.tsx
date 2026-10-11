import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Compass, 
  Cpu, 
  Layers, 
  FlaskConical, 
  User, 
  Mail, 
  Menu, 
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import type { SceneType } from '../../types/portfolio';
import { profileData } from '../../data/profile';

interface CosmicNavbarProps {
  activeScene: SceneType;
  onChangeScene: (scene: SceneType) => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onPlayClick?: () => void;
}

export const CosmicNavbar: React.FC<CosmicNavbarProps> = ({
  activeScene,
  onChangeScene,
  isMuted,
  onToggleSound,
  onPlayClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (action: () => void) => {
    if (onPlayClick) onPlayClick();
    action();
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    if (activeScene !== 'laboratory') {
      onChangeScene('laboratory');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isLight = activeScene === 'laboratory';

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-4 py-3 sm:px-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Dimensional Identity */}
        <button
          onClick={() => handleNavClick(() => onChangeScene('awakening'))}
          className={`pointer-events-auto group flex items-center space-x-3 px-3 py-1.5 rounded-full transition-all duration-300 ${
            isLight
              ? 'bg-white/90 border border-slate-200/90 hover:border-indigo-400 shadow-sm backdrop-blur-md'
              : 'glass-panel border border-cyan-500/30 hover:border-cyan-400'
          }`}
          title="Return to Cosmic Awakening"
        >
          <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-cyan-400" />
          </div>
          <div className="text-left">
            <span className={`block text-xs font-mono tracking-wider font-bold uppercase ${
              isLight ? 'text-slate-900' : 'text-cyan-300'
            }`}>
              {profileData.name}
            </span>
            <span className={`hidden sm:block text-[10px] font-mono ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              AI MULTIVERSE v2.6
            </span>
          </div>
        </button>

        {/* Desktop HUD Navigation */}
        <nav className={`hidden md:flex pointer-events-auto items-center space-x-1 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md transition-all ${
          isLight
            ? 'bg-white/90 border border-slate-200/90 shadow-slate-200/50 text-slate-700'
            : 'glass-panel border border-white/10 text-slate-300'
        }`}>
          <button
            onClick={() => handleNavClick(() => onChangeScene('multiverse'))}
            className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center space-x-1.5 transition-all ${
              activeScene === 'multiverse'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-glow-cyan'
                : isLight
                ? 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/80'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-500" />
            <span>Multiverse</span>
          </button>

          <button
            onClick={() => handleNavClick(() => onChangeScene('laboratory'))}
            className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center space-x-1.5 transition-all ${
              activeScene === 'laboratory'
                ? isLight
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/30'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-glow-violet'
                : isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cpu className={`w-3.5 h-3.5 ${isLight && activeScene === 'laboratory' ? 'text-white' : 'text-purple-500'}`} />
            <span>AI Lab</span>
          </button>

          <button
            onClick={() => handleNavClick(() => scrollToSection('projects'))}
            className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center space-x-1.5 transition-all ${
              isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80' : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>Projects</span>
          </button>

          <button
            onClick={() => handleNavClick(() => scrollToSection('mllab'))}
            className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center space-x-1.5 transition-all ${
              isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80' : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-emerald-500" />
            <span>Live ML Demo</span>
          </button>

          <button
            onClick={() => handleNavClick(() => scrollToSection('about'))}
            className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center space-x-1.5 transition-all ${
              isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80' : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-3.5 h-3.5 text-pink-500" />
            <span>About</span>
          </button>

          <button
            onClick={() => handleNavClick(() => scrollToSection('contact'))}
            className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center space-x-1.5 transition-all ${
              isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80' : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-cyan-500" />
            <span>Contact</span>
          </button>
        </nav>

        {/* Right Controls: Sound Toggle & External Profiles */}
        <div className="pointer-events-auto flex items-center space-x-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              if (onPlayClick) onPlayClick();
              onToggleSound();
            }}
            className={`p-2 rounded-full border transition-all duration-300 ${
              isLight
                ? isMuted
                  ? 'bg-white/90 border-slate-200 text-slate-400 hover:text-slate-700 shadow-sm'
                  : 'bg-indigo-50 border-indigo-300 text-indigo-600 shadow-sm'
                : isMuted
                ? 'glass-panel border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                : 'glass-panel border-cyan-400 text-cyan-300 shadow-glow-cyan bg-cyan-500/10'
            }`}
            title={isMuted ? 'Turn Sound ON' : 'Mute Sound'}
            aria-label={isMuted ? 'Sound Disabled' : 'Sound Enabled'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>

          {/* Resume Quick Link */}
          <a
            href="/AI_ML%20resume.pdf"
            download="Nagendra_Kushwaha_AI_ML_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
              isLight
                ? 'bg-white/90 border border-purple-200 text-purple-700 hover:bg-purple-50 shadow-sm'
                : 'glass-panel border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400 hover:bg-purple-500/10'
            }`}
            title="Download AI/ML Resume"
          >
            <span>Resume</span>
          </a>

          {/* GitHub Configurable Link */}
          {profileData.contact.github && (
            <a
              href={profileData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                isLight
                  ? 'bg-white/90 border border-slate-200 text-slate-700 hover:text-indigo-600 shadow-sm'
                  : 'glass-panel border border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40'
              }`}
            >
              <span>GitHub</span>
              <ExternalLink className={`w-3 h-3 ${isLight ? 'text-indigo-500' : 'text-cyan-400'}`} />
            </a>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-full border ${
              isLight
                ? 'bg-white/90 border-slate-200 text-slate-700 shadow-sm'
                : 'glass-panel border-white/10 text-slate-300 hover:text-white'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden pointer-events-auto mt-2 max-w-sm mx-auto p-4 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 border ${
          isLight
            ? 'bg-white/95 border-slate-200 text-slate-800'
            : 'glass-panel-glow border-cyan-500/30 text-slate-200'
        }`}>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleNavClick(() => onChangeScene('multiverse'))}
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-mono text-left ${
                isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-cyan-300 hover:bg-cyan-500/10'
              }`}
            >
              <Compass className="w-4 h-4 text-cyan-500" />
              <span>Multiverse Dimensions</span>
            </button>
            <button
              onClick={() => handleNavClick(() => onChangeScene('laboratory'))}
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-mono text-left ${
                isLight ? 'text-indigo-700 font-bold bg-indigo-50' : 'text-purple-300 hover:bg-purple-500/10'
              }`}
            >
              <Cpu className="w-4 h-4 text-purple-500" />
              <span>AI Laboratory</span>
            </button>
            <button
              onClick={() => handleNavClick(() => scrollToSection('projects'))}
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-mono text-left ${
                isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-blue-300 hover:bg-blue-500/10'
              }`}
            >
              <Layers className="w-4 h-4 text-blue-500" />
              <span>Project Constellation</span>
            </button>
            <button
              onClick={() => handleNavClick(() => scrollToSection('mllab'))}
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-mono text-left ${
                isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-emerald-300 hover:bg-emerald-500/10'
              }`}
            >
              <FlaskConical className="w-4 h-4 text-emerald-500" />
              <span>Interactive ML Lab</span>
            </button>
            <button
              onClick={() => handleNavClick(() => scrollToSection('about'))}
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-mono text-left ${
                isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-pink-300 hover:bg-pink-500/10'
              }`}
            >
              <User className="w-4 h-4 text-pink-500" />
              <span>About & Education</span>
            </button>
            <button
              onClick={() => handleNavClick(() => scrollToSection('contact'))}
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-mono text-left ${
                isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-cyan-300 hover:bg-cyan-500/10'
              }`}
            >
              <Mail className="w-4 h-4 text-cyan-500" />
              <span>Contact Coordinates</span>
            </button>
            <a
              href="/AI_ML%20resume.pdf"
              download="Nagendra_Kushwaha_AI_ML_Resume.pdf"
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-mono text-left border-t pt-2 ${
                isLight ? 'border-slate-200 text-purple-700 hover:bg-purple-50' : 'border-white/5 text-purple-300 hover:bg-purple-500/10'
              }`}
            >
              <span>Download AI/ML Resume (PDF)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
