import React from 'react';
import { 
  multiverseWorlds 
} from '../../data/multiverseWorlds';
import type { MultiverseWorldId } from '../../types/portfolio';
import { 
  Compass, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Binary, 
  BrainCircuit, 
  Code2, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface MultiverseViewProps {
  selectedWorld: MultiverseWorldId | null;
  hoveredWorld: MultiverseWorldId | null;
  onSelectWorld: (worldId: MultiverseWorldId) => void;
  onHoverWorld: (worldId: MultiverseWorldId | null) => void;
  onEnterLaboratory: () => void;
  onPlayHover?: () => void;
  onPlayClick?: () => void;
}

export const MultiverseView: React.FC<MultiverseViewProps> = ({
  selectedWorld,
  hoveredWorld,
  onSelectWorld,
  onHoverWorld,
  onEnterLaboratory,
  onPlayHover,
  onPlayClick,
}) => {
  const activeWorldId = hoveredWorld || selectedWorld || 'ai';
  const activeWorld = multiverseWorlds.find((w) => w.id === activeWorldId) || multiverseWorlds[0];

  const getDomainIcon = (id: MultiverseWorldId) => {
    switch (id) {
      case 'ai':
        return <BrainCircuit className="w-5 h-5 text-cyan-400" />;
      case 'datascience':
        return <Binary className="w-5 h-5 text-sky-400" />;
      case 'deeplearning':
        return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'software':
        return <Code2 className="w-5 h-5 text-emerald-400" />;
    }
  };

  const handleWorldClick = (id: MultiverseWorldId) => {
    if (onPlayClick) onPlayClick();
    onSelectWorld(id);
  };

  const handleWorldMouseEnter = (id: MultiverseWorldId) => {
    if (onPlayHover) onPlayHover();
    onHoverWorld(id);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-8 pt-20 z-20 pointer-events-none select-none">
      {/* Top Multiverse Header */}
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pointer-events-auto">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Compass className="w-3.5 h-3.5" />
            <span>MULTIVERSE ORBITAL VIEW</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
            Choose a Celestial Domain
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            Click any planet in 3D space or select below to explore technical specializations
          </p>
        </div>

        {/* Enter AI Laboratory Button */}
        <button
          onClick={() => {
            if (onPlayClick) onPlayClick();
            onEnterLaboratory();
          }}
          className="group px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-mono text-xs sm:text-sm tracking-wider font-semibold shadow-glow-cyan hover:shadow-cyan-400/60 transition-all flex items-center space-x-2"
        >
          <span>ENTER AI LABORATORY & PORTFOLIO</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* World Selector Cards Grid (Always accessible) */}
      <div className="max-w-7xl mx-auto w-full my-auto py-6 pointer-events-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {multiverseWorlds.map((world) => {
            const isSelected = selectedWorld === world.id;
            const isHovered = hoveredWorld === world.id;
            const isCurrent = isSelected || isHovered;

            return (
              <div
                key={world.id}
                onClick={() => handleWorldClick(world.id)}
                onMouseEnter={() => handleWorldMouseEnter(world.id)}
                onMouseLeave={() => onHoverWorld(null)}
                className={`group cursor-pointer rounded-2xl p-5 backdrop-blur-xl transition-all duration-300 border ${
                  isCurrent
                    ? 'glass-panel-glow border-cyan-400/60 scale-[1.02] shadow-2xl'
                    : 'glass-panel border-white/10 hover:border-white/30 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10"
                    style={{ backgroundColor: `${world.themeColor}15` }}
                  >
                    {getDomainIcon(world.id)}
                  </div>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: world.themeColor, boxShadow: `0 0 10px ${world.themeColor}` }}
                  />
                </div>

                <h3 className="text-base font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {world.name}
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1 line-clamp-1">
                  {world.tagline}
                </p>

                <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                  {world.description}
                </p>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                  <span>Explore Universe</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active World Detailed Telemetry Panel */}
      <div className="max-w-7xl mx-auto w-full pointer-events-auto">
        <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-cyan-500/20 backdrop-blur-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>ACTIVE SECTOR: {activeWorld.name.toUpperCase()}</span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              {activeWorld.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeWorld.features.map((feat, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-slate-300"
              >
                {feat}
              </span>
            ))}

            <button
              onClick={() => {
                if (onPlayClick) onPlayClick();
                onEnterLaboratory();
              }}
              className="px-4 py-1.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center space-x-1 transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>View Projects</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
