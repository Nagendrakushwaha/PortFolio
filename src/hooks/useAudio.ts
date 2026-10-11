import { useState, useCallback } from 'react';
import { soundSynth } from '../lib/soundSynthesizer';

export function useAudio() {
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const toggleSound = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundSynth.setMuted(next);
      return next;
    });
  }, []);

  const playClick = useCallback(() => {
    soundSynth.playUiClick();
  }, []);

  const playPlanetHover = useCallback(() => {
    soundSynth.playPlanetHover();
  }, []);

  const playWarp = useCallback(() => {
    soundSynth.playWarpSound();
  }, []);

  return {
    isMuted,
    toggleSound,
    playClick,
    playPlanetHover,
    playWarp,
  };
}
