import React, { useState, useCallback, useEffect } from 'react';
import type { SceneType, MultiverseWorldId, ProjectData } from './types/portfolio';
import { CosmicCanvas } from './components/cosmic/CosmicCanvas';
import { WebGLFallback } from './components/cosmic/WebGLFallback';
import { CosmicCursorSystem } from './components/cosmic/CosmicCursorSystem';
import { CosmicNavbar } from './components/navigation/CosmicNavbar';
import { CosmicAwakening } from './components/scenes/CosmicAwakening';
import { WormholeTransition } from './components/scenes/WormholeTransition';
import { MultiverseView } from './components/scenes/MultiverseView';
import { AILaboratory } from './components/scenes/AILaboratory';
import { ProjectModal } from './components/portfolio/ProjectModal';
import { KennedyChatModal } from './components/chat/KennedyChatModal';
import { KennedyFloatingLauncher } from './components/chat/KennedyFloatingLauncher';
import { projectsData } from './data/projects';
import { useAudio } from './hooks/useAudio';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useWebGLSupport } from './hooks/useWebGLSupport';
import { KennedyVoiceProvider, useKennedyVoiceContext } from './context/KennedyVoiceContext';

const PortfolioContent: React.FC<{
  onOpenProjectModal: (slug: string) => void;
  scrollToSection: (id: string) => void;
  onOpenLabTab: (tab: string) => void;
  activeScene: SceneType;
  setActiveScene: React.Dispatch<React.SetStateAction<SceneType>>;
  selectedWorld: MultiverseWorldId | null;
  setSelectedWorld: React.Dispatch<React.SetStateAction<MultiverseWorldId | null>>;
  hoveredWorld: MultiverseWorldId | null;
  setHoveredWorld: React.Dispatch<React.SetStateAction<MultiverseWorldId | null>>;
  globalModalProject: ProjectData | null;
  setGlobalModalProject: React.Dispatch<React.SetStateAction<ProjectData | null>>;
}> = ({
  onOpenProjectModal,
  scrollToSection,
  onOpenLabTab,
  activeScene,
  setActiveScene,
  selectedWorld,
  setSelectedWorld,
  hoveredWorld,
  setHoveredWorld,
  globalModalProject,
  setGlobalModalProject,
}) => {
  const { openChat } = useKennedyVoiceContext();
  const { isMuted, toggleSound, playClick, playPlanetHover, playWarp } = useAudio();
  const prefersReducedMotion = useReducedMotion();
  const hasWebGL = useWebGLSupport();

  // Enter Galaxy from Scene 01 (Cinematic Portal Warp)
  const handleEnterGalaxy = useCallback(() => {
    playWarp();
    try {
      sessionStorage.setItem('hasEnteredGalaxy', 'true');
    } catch {
      // safe fallback if storage is restricted
    }
    if (prefersReducedMotion) {
      setActiveScene('laboratory');
    } else {
      setActiveScene('wormhole');
    }
  }, [playWarp, prefersReducedMotion, setActiveScene]);

  // Wormhole complete callback -> Arrival in Homepage / Laboratory
  const handleWormholeComplete = useCallback(() => {
    setActiveScene('laboratory');
  }, [setActiveScene]);

  // Skip intro at any time
  const handleSkipIntro = useCallback(() => {
    playClick();
    try {
      sessionStorage.setItem('hasEnteredGalaxy', 'true');
    } catch {
      // safe fallback
    }
    setActiveScene('laboratory');
  }, [playClick, setActiveScene]);

  // About Me navigation CTA
  const handleAboutMe = useCallback(() => {
    playClick();
    scrollToSection('about');
  }, [playClick, scrollToSection]);

  // Explore AI projects directly
  const handleExploreProjects = useCallback(() => {
    playClick();
    scrollToSection('projects');
  }, [playClick, scrollToSection]);

  // World selection in Multiverse
  const handleSelectWorld = useCallback((worldId: MultiverseWorldId) => {
    setSelectedWorld(worldId);
    playClick();
    setTimeout(() => {
      setActiveScene('laboratory');
    }, 700);
  }, [playClick, setActiveScene, setSelectedWorld]);

  const handleReturnToTop = useCallback(() => {
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveScene('awakening');
  }, [playClick, setActiveScene]);

  return (
    <div className="relative min-h-screen w-full bg-black text-slate-100 overflow-x-hidden">
      {/* Advanced Interactive Cursor System with Dynamic Particle Trails & Ripples */}
      <CosmicCursorSystem />

      {/* 3D Cosmic WebGL Background or 2D Fallback */}
      {hasWebGL ? (
        <CosmicCanvas
          activeScene={activeScene}
          selectedWorld={selectedWorld}
          hoveredWorld={hoveredWorld}
          onSelectWorld={handleSelectWorld}
          onHoverWorld={setHoveredWorld}
          onEnterGalaxy={handleEnterGalaxy}
          reducedMotion={prefersReducedMotion}
        />
      ) : (
        <WebGLFallback />
      )}

      {/* Persistent HUD Navigation */}
      {activeScene !== 'awakening' && (
        <CosmicNavbar
          activeScene={activeScene}
          onChangeScene={(scene) => {
            playClick();
            setActiveScene(scene);
          }}
          isMuted={isMuted}
          onToggleSound={toggleSound}
          onPlayClick={playClick}
          onOpenAssistant={() => {
            playClick();
            openChat();
          }}
        />
      )}

      {/* Dynamic Cinematic Scenes */}
      {activeScene === 'awakening' && (
        <CosmicAwakening
          onEnterGalaxy={handleEnterGalaxy}
          onSkipIntro={handleSkipIntro}
          onPlayClick={playClick}
          isMuted={isMuted}
          onToggleSound={toggleSound}
        />
      )}

      {activeScene === 'wormhole' && (
        <WormholeTransition
          onComplete={handleWormholeComplete}
          onSkip={handleSkipIntro}
          reducedMotion={prefersReducedMotion}
        />
      )}

      {activeScene === 'multiverse' && (
        <MultiverseView
          selectedWorld={selectedWorld}
          hoveredWorld={hoveredWorld}
          onSelectWorld={handleSelectWorld}
          onHoverWorld={setHoveredWorld}
          onEnterLaboratory={() => {
            playClick();
            setActiveScene('laboratory');
          }}
          onPlayHover={playPlanetHover}
          onPlayClick={playClick}
        />
      )}

      {activeScene === 'laboratory' && (
        <AILaboratory
          onReturnToTop={handleReturnToTop}
          onExploreProjects={handleExploreProjects}
          onExploreLab={() => scrollToSection('mllab')}
          onContact={() => scrollToSection('contact')}
          onAboutMe={handleAboutMe}
        />
      )}

      {/* Persistent Floating Mr. Kennedy Companion across all scenes */}
      <KennedyFloatingLauncher />

      {/* Mr. Kennedy AI Voice Assistant Modal */}
      <KennedyChatModal
        onOpenProjectModal={onOpenProjectModal}
        onScrollToSection={scrollToSection}
        onOpenLabTab={onOpenLabTab}
      />

      {/* Global Project Case Study Modal */}
      {globalModalProject && (
        <ProjectModal
          project={globalModalProject}
          onClose={() => setGlobalModalProject(null)}
          onOpenDemo={() => {
            setGlobalModalProject(null);
            scrollToSection('mllab');
          }}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  // Determine initial scene from session storage (don't force intro on every reload)
  const [activeScene, setActiveScene] = useState<SceneType>(() => {
    try {
      const hasEntered = typeof window !== 'undefined' && sessionStorage.getItem('hasEnteredGalaxy');
      return hasEntered === 'true' ? 'laboratory' : 'awakening';
    } catch {
      return 'awakening';
    }
  });

  const [selectedWorld, setSelectedWorld] = useState<MultiverseWorldId | null>(null);
  const [hoveredWorld, setHoveredWorld] = useState<MultiverseWorldId | null>(null);
  const [globalModalProject, setGlobalModalProject] = useState<ProjectData | null>(null);

  // Close project case study modal when requested by voice command
  useEffect(() => {
    const handleCloseModal = () => {
      setGlobalModalProject(null);
    };
    window.addEventListener('close-project-modal', handleCloseModal);
    return () => window.removeEventListener('close-project-modal', handleCloseModal);
  }, []);

  const highlightSection = (el: HTMLElement) => {
    el.classList.remove('voice-nav-highlight');
    // Force DOM reflow to retrigger animation
    void el.offsetWidth;
    el.classList.add('voice-nav-highlight');
    setTimeout(() => {
      el.classList.remove('voice-nav-highlight');
    }, 2800);
  };

  const scrollToSection = useCallback((id: string) => {
    const targetId = id === 'home' ? 'hero' : id;
    if (activeScene !== 'laboratory') {
      setActiveScene('laboratory');
      const attemptScroll = (attemptsLeft: number) => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          highlightSection(el);
        } else if (attemptsLeft > 0) {
          setTimeout(() => attemptScroll(attemptsLeft - 1), 70);
        }
      };
      setTimeout(() => attemptScroll(6), 50);
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        highlightSection(el);
      }
    }
  }, [activeScene]);

  const handleOpenProjectModal = useCallback((slugOrId: string) => {
    const found = projectsData.find((p) => p.id === slugOrId || p.slug === slugOrId);
    if (found) {
      setGlobalModalProject(found);
    } else {
      scrollToSection('projects');
    }
  }, [scrollToSection]);

  const handleOpenLabTab = useCallback((tab: string) => {
    scrollToSection('mllab');
    window.dispatchEvent(new CustomEvent('switch-ml-lab-tab', { detail: { tab } }));
  }, [scrollToSection]);

  return (
    <KennedyVoiceProvider
      onOpenProjectModal={handleOpenProjectModal}
      onScrollToSection={scrollToSection}
      onOpenLabTab={handleOpenLabTab}
    >
      <PortfolioContent
        onOpenProjectModal={handleOpenProjectModal}
        scrollToSection={scrollToSection}
        onOpenLabTab={handleOpenLabTab}
        activeScene={activeScene}
        setActiveScene={setActiveScene}
        selectedWorld={selectedWorld}
        setSelectedWorld={setSelectedWorld}
        hoveredWorld={hoveredWorld}
        setHoveredWorld={setHoveredWorld}
        globalModalProject={globalModalProject}
        setGlobalModalProject={setGlobalModalProject}
      />
    </KennedyVoiceProvider>
  );
};

export default App;
