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

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-4 py-3 sm:px-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Dimensional Identity */}
        <button
          onClick={() => handleNavClick(() => onChangeScene('awakening'))}
          className="pointer-events-auto group flex items-center space-x-3 px-3 py-1.5 rounded-full glass-panel border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300"
          title="Return to Cosmic Awakening"
        >
          <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-glow-cyan">
            <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-cyan-400" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-mono tracking-wider text-cyan-300 font-bold uppercase">
              {profileData.name}
            </span>
            <span className="hidden sm:block text-[10px] font-mono text-slate-400">
              AI MULTIVERSE v2.6
            </span>
          </div>
        </button>

        {/* Desktop HUD Navigation */}
        <nav className="hidden md:flex pointer-events-auto items-center space-x-1 px-3 py-1.5 rounded-full glass-panel border border-white/10 shadow-2xl backdrop-blur-md">
          <button
            onClick={() => handleNavClick(() => onChangeScene('multiverse'))}
            className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center space-x-1.5 transition-all ${
              activeScene === 'multiverse'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-glow-cyan'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Multiverse</span>
          </button>

          <button
            onClick={() => handleNavClick(() => onChangeScene('laboratory'))}
            className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center space-x-1.5 transition-all ${
              activeScene === 'laboratory'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-glow-violet'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Lab</span>
          </button>

          <button
            onClick={() => handleNavClick(() => scrollToSection('projects'))}
            className="px-3 py-1.5 rounded-full text-xs font-mono flex items-center space-x-1.5 text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Projects</span>
          </button>

          <button
            onClick={() => handleNavClick(() => scrollToSection('mllab'))}
            className="px-3 py-1.5 rounded-full text-xs font-mono flex items-center space-x-1.5 text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live ML Demo</span>
          </button>

          <button
            onClick={() => handleNavClick(() => scrollToSection('about'))}
            className="px-3 py-1.5 rounded-full text-xs font-mono flex items-center space-x-1.5 text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <User className="w-3.5 h-3.5 text-pink-400" />
            <span>About</span>
          </button>

          <button
            onClick={() => handleNavClick(() => scrollToSection('contact'))}
            className="px-3 py-1.5 rounded-full text-xs font-mono flex items-center space-x-1.5 text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
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
            className={`p-2 rounded-full glass-panel border transition-all duration-300 ${
              isMuted
                ? 'border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                : 'border-cyan-400 text-cyan-300 shadow-glow-cyan bg-cyan-500/10'
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
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full glass-panel border border-purple-500/30 text-xs font-mono text-purple-300 hover:text-white hover:border-purple-400 hover:bg-purple-500/10 transition-all"
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
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full glass-panel border border-white/10 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 transition-all"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-cyan-400" />
            </a>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full glass-panel border border-white/10 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pointer-events-auto mt-2 max-w-sm mx-auto p-4 rounded-2xl glass-panel-glow border border-cyan-500/30 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleNavClick(() => onChangeScene('multiverse'))}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-mono text-cyan-300 hover:bg-cyan-500/10 text-left"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Multiverse Dimensions</span>
            </button>
            <button
              onClick={() => handleNavClick(() => onChangeScene('laboratory'))}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-mono text-purple-300 hover:bg-purple-500/10 text-left"
            >
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>AI Laboratory</span>
            </button>
            <button
              onClick={() => handleNavClick(() => scrollToSection('projects'))}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-mono text-blue-300 hover:bg-blue-500/10 text-left"
            >
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Project Constellation</span>
            </button>
            <button
              onClick={() => handleNavClick(() => scrollToSection('mllab'))}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-mono text-emerald-300 hover:bg-emerald-500/10 text-left"
            >
              <FlaskConical className="w-4 h-4 text-emerald-400" />
              <span>Interactive ML Lab</span>
            </button>
            <button
              onClick={() => handleNavClick(() => scrollToSection('about'))}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-mono text-pink-300 hover:bg-pink-500/10 text-left"
            >
              <User className="w-4 h-4 text-pink-400" />
              <span>About & Education</span>
            </button>
            <button
              onClick={() => handleNavClick(() => scrollToSection('contact'))}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-mono text-cyan-300 hover:bg-cyan-500/10 text-left"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Contact Coordinates</span>
            </button>
            <a
              href="/AI_ML%20resume.pdf"
              download="Nagendra_Kushwaha_AI_ML_Resume.pdf"
              className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-mono text-purple-300 hover:bg-purple-500/10 text-left border-t border-white/5 pt-2"
            >
              <span>Download AI/ML Resume (PDF)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
