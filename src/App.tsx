import React, { useState, useCallback } from 'react';
import type { SceneType, MultiverseWorldId, ProjectData } from './types/portfolio';
import { CosmicCanvas } from './components/cosmic/CosmicCanvas';
import { WebGLFallback } from './components/cosmic/WebGLFallback';
import { CosmicNavbar } from './components/navigation/CosmicNavbar';
import { CosmicAwakening } from './components/scenes/CosmicAwakening';
import { WormholeTransition } from './components/scenes/WormholeTransition';
import { MultiverseView } from './components/scenes/MultiverseView';
import { AILaboratory } from './components/scenes/AILaboratory';
import { ProjectModal } from './components/portfolio/ProjectModal';
import { NovaChatModal } from './components/chat/NovaChatModal';
import { NovaFloatingLauncher } from './components/chat/NovaFloatingLauncher';
import { projectsData } from './data/projects';
import { useAudio } from './hooks/useAudio';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useWebGLSupport } from './hooks/useWebGLSupport';

export const App: React.FC = () => {
  const [activeScene, setActiveScene] = useState<SceneType>('awakening');
  const [selectedWorld, setSelectedWorld] = useState<MultiverseWorldId | null>(null);
  const [hoveredWorld, setHoveredWorld] = useState<MultiverseWorldId | null>(null);

  // Nova AI Voice Assistant State
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [globalModalProject, setGlobalModalProject] = useState<ProjectData | null>(null);

  const { isMuted, toggleSound, playClick, playPlanetHover, playWarp } = useAudio();
  const prefersReducedMotion = useReducedMotion();
  const hasWebGL = useWebGLSupport();

  // Enter Universe from Scene 01
  const handleEnterUniverse = useCallback(() => {
    playWarp();
    if (prefersReducedMotion) {
      setActiveScene('multiverse');
    } else {
      setActiveScene('wormhole');
    }
  }, [playWarp, prefersReducedMotion]);

  // Wormhole complete callback -> Arrival in Multiverse
  const handleWormholeComplete = useCallback(() => {
    setActiveScene('multiverse');
  }, []);

  // Skip intro at any time
  const handleSkipIntro = useCallback(() => {
    playClick();
    setActiveScene('multiverse');
  }, [playClick]);

  const scrollToSection = useCallback((id: string) => {
    if (activeScene !== 'laboratory') {
      setActiveScene('laboratory');
      const attemptScroll = (attemptsLeft: number) => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else if (attemptsLeft > 0) {
          setTimeout(() => attemptScroll(attemptsLeft - 1), 70);
        }
      };
      setTimeout(() => attemptScroll(6), 50);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeScene]);

  // Primary CTA: Explore AI projects directly
  const handleExploreProjects = useCallback(() => {
    playClick();
    scrollToSection('projects');
  }, [playClick, scrollToSection]);

  // Secondary CTA: View full portfolio overview
  const handleViewPortfolio = useCallback(() => {
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveScene('laboratory');
  }, [playClick]);

  // World selection in Multiverse
  const handleSelectWorld = useCallback((worldId: MultiverseWorldId) => {
    setSelectedWorld(worldId);
    playClick();
    // Smoothly focus planet and transition to Laboratory
    setTimeout(() => {
      setActiveScene('laboratory');
    }, 700);
  }, [playClick]);

  const handleReturnToTop = useCallback(() => {
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveScene('awakening');
  }, [playClick]);

  // Assistant callbacks
  const handleOpenAssistant = useCallback(() => {
    playClick();
    setIsAssistantOpen(true);
  }, [playClick]);

  const handleCloseAssistant = useCallback(() => {
    setIsAssistantOpen(false);
  }, []);

  const handleToggleAssistant = useCallback(() => {
    playClick();
    setIsAssistantOpen((prev) => !prev);
  }, [playClick]);

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
    <div className="relative min-h-screen w-full bg-black text-slate-100 overflow-x-hidden">
      {/* 3D Cosmic WebGL Background or 2D Fallback */}
      {hasWebGL ? (
        <CosmicCanvas
          activeScene={activeScene}
          selectedWorld={selectedWorld}
          hoveredWorld={hoveredWorld}
          onSelectWorld={handleSelectWorld}
          onHoverWorld={setHoveredWorld}
          reducedMotion={prefersReducedMotion}
        />
      ) : (
        <WebGLFallback />
      )}

      {/* Persistent HUD Navigation (Hidden on initial Awakening screen) */}
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
          onOpenAssistant={handleOpenAssistant}
        />
      )}

      {/* Dynamic Cinematic Scenes */}
      {activeScene === 'awakening' && (
        <CosmicAwakening
          onExploreProjects={handleExploreProjects}
          onViewPortfolio={handleViewPortfolio}
          onEnterUniverse={handleEnterUniverse}
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
          onExploreProjects={() => scrollToSection('projects')}
          onExploreLab={() => scrollToSection('mllab')}
          onContact={() => scrollToSection('contact')}
        />
      )}

      {/* Persistent Floating Nova Launcher across all scenes */}
      <NovaFloatingLauncher
        isOpen={isAssistantOpen}
        onToggle={handleToggleAssistant}
      />

      {/* Nova AI Voice Assistant Modal */}
      <NovaChatModal
        isOpen={isAssistantOpen}
        onClose={handleCloseAssistant}
        onOpenProjectModal={handleOpenProjectModal}
        onScrollToSection={scrollToSection}
        onOpenLabTab={handleOpenLabTab}
      />

      {/* Global Project Case Study Modal (Triggerable from Nova or anywhere) */}
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

export default App;
