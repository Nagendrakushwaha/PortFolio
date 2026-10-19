import React, { useState, useCallback } from 'react';
import type { SceneType, MultiverseWorldId } from './types/portfolio';
import { CosmicCanvas } from './components/cosmic/CosmicCanvas';
import { WebGLFallback } from './components/cosmic/WebGLFallback';
import { CosmicNavbar } from './components/navigation/CosmicNavbar';
import { CosmicAwakening } from './components/scenes/CosmicAwakening';
import { WormholeTransition } from './components/scenes/WormholeTransition';
import { MultiverseView } from './components/scenes/MultiverseView';
import { AILaboratory } from './components/scenes/AILaboratory';
import { useAudio } from './hooks/useAudio';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useWebGLSupport } from './hooks/useWebGLSupport';

export const App: React.FC = () => {
  const [activeScene, setActiveScene] = useState<SceneType>('awakening');
  const [selectedWorld, setSelectedWorld] = useState<MultiverseWorldId | null>(null);
  const [hoveredWorld, setHoveredWorld] = useState<MultiverseWorldId | null>(null);

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

  // Primary CTA: Explore AI projects directly
  const handleExploreProjects = useCallback(() => {
    playClick();
    scrollToSection('projects');
  }, [playClick]);

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

  const scrollToSection = (id: string) => {
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
  };

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
    </div>
  );
};

export default App;
