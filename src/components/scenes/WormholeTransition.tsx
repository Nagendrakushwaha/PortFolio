import React, { useEffect, useState } from 'react';
import { FastForward, Gauge, Compass } from 'lucide-react';

interface WormholeTransitionProps {
  onComplete: () => void;
  onSkip: () => void;
  reducedMotion?: boolean;
}

export const WormholeTransition: React.FC<WormholeTransitionProps> = ({
  onComplete,
  onSkip,
  reducedMotion = false,
}) => {
  const [velocity, setVelocity] = useState<number>(0.2);
  const [warpFactor, setWarpFactor] = useState<number>(1.0);

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }

    const startTime = Date.now();
    const duration = 2800; // 2.8 seconds cinematic flight

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1.0);

      // Accelerate velocity exponentially up to Warp 9.9
      setVelocity(+(0.2 + progress * 9.7).toFixed(1));
      setWarpFactor(+(1.0 + progress * 8.9).toFixed(1));

      if (progress >= 1.0) {
        clearInterval(interval);
        onComplete();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete, reducedMotion]);

  return (
    <div className="fixed inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 sm:p-10 select-none">
      {/* Top Telemetry */}
      <div className="w-full flex items-center justify-between text-xs font-mono text-cyan-300">
        <div className="flex items-center space-x-2 bg-black/60 px-4 py-2 rounded-full border border-cyan-500/40 backdrop-blur-md">
          <Gauge className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>HYPERSPACE VELOCITY: {velocity} c</span>
          <span className="text-slate-500">|</span>
          <span className="text-purple-300">WARP FACTOR: {warpFactor}</span>
        </div>

        <button
          onClick={onSkip}
          className="pointer-events-auto flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-white/20 text-slate-300 hover:text-white hover:border-cyan-400 text-xs font-mono transition-all"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>Skip Hyperspace</span>
        </button>
      </div>

      {/* Center Target Reticle */}
      <div className="m-auto flex flex-col items-center space-y-4">
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-cyan-400/30 flex items-center justify-center animate-pulse">
          <div className="absolute inset-4 rounded-full border border-purple-500/40 border-dashed animate-spin" style={{ animationDuration: '6s' }} />
          <div className="absolute inset-10 rounded-full border border-cyan-300/60" />
          <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-glow-cyan animate-ping" />
        </div>
        <div className="text-center font-mono space-y-1">
          <p className="text-sm font-bold tracking-widest text-cyan-300 text-glow-cyan uppercase">
            Traversing Einstein-Rosen Bridge
          </p>
          <p className="text-xs text-slate-400">
            Translating coordinate space to AI Domains Sector 04
          </p>
        </div>
      </div>

      {/* Bottom Destination HUD */}
      <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>DESTINATION: AI & DATA SCIENCE GALAXY</span>
        </div>
        <div>
          QUANTUM STABILIZATION: ACTIVE
        </div>
      </div>
    </div>
  );
};
