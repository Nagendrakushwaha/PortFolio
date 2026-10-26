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

  // Enter Universe from Scene 01
  const handleEnterUniverse = useCallback(() => {
    playWarp();
    if (prefersReducedMotion) {
      setActiveScene('multiverse');
    } else {
      setActiveScene('wormhole');
    }
  }, [playWarp, prefersReducedMotion, setActiveScene]);

  // Wormhole complete callback -> Arrival in Multiverse
  const handleWormholeComplete = useCallback(() => {
    setActiveScene('multiverse');
  }, [setActiveScene]);

  // Skip intro at any time
  const handleSkipIntro = useCallback(() => {
    playClick();
    setActiveScene('multiverse');
  }, [playClick, setActiveScene]);

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
  }, [playClick, setActiveScene]);

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
  const [activeScene, setActiveScene] = useState<SceneType>('awakening');
  const [selectedWorld, setSelectedWorld] = useState<MultiverseWorldId | null>(null);
  const [hoveredWorld, setHoveredWorld] = useState<MultiverseWorldId | null>(null);
  const [globalModalProject, setGlobalModalProject] = useState<ProjectData | null>(null);

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
