import React, { useState } from 'react';
import { Cpu, CheckCircle2, Sparkles } from 'lucide-react';
import { skillsData } from '../../data/skills';

export const SkillsSection: React.FC = () => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);

  const activeCategory = skillsData[activeCategoryIndex];

  return (
    <section id="skills" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="space-y-4 text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel border border-purple-500/30 text-xs font-mono text-purple-300">
          <Cpu className="w-3.5 h-3.5" />
          <span>TECHNICAL COMPETENCIES</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
          Architectural & Algorithmic Toolset
        </h2>
        <p className="text-sm font-mono text-slate-400">
          Structured by domain specialization and tied to real verified projects, without arbitrary percentage ratings.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {skillsData.map((category, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategoryIndex(idx)}
            className={`px-4 py-2 rounded-full text-xs font-mono transition-all duration-300 flex items-center space-x-2 ${
              activeCategoryIndex === idx
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-glow-cyan'
                : 'glass-panel text-slate-400 hover:text-white border-white/10 hover:border-white/20'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${activeCategoryIndex === idx ? 'text-cyan-400' : 'text-slate-500'}`} />
            <span>{category.categoryName}</span>
          </button>
        ))}
      </div>

      {/* Category Overview Card */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-cyan-500/30 shadow-2xl space-y-8">
        <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              {activeCategory.categoryName}
            </h3>
            <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
              {activeCategory.description}
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
            {activeCategory.skills.length} Core Modules
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeCategory.skills.map((skill, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-5 border border-white/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-base font-display font-bold text-white flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>{skill.name}</span>
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/15 border border-purple-500/30 text-purple-300">
                  {skill.tag}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                {skill.levelDescription}
              </p>

              {skill.associatedProjects && skill.associatedProjects.length > 0 && (
                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-500">Implemented in:</span>
                  {skill.associatedProjects.map((p, pIdx) => (
                    <span
                      key={pIdx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-cyan-300 border border-white/5"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
