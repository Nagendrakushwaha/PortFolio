import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Terminal, 
  Volume2, 
  VolumeX, 
  Brain, 
  Cpu, 
  Sparkles, 
  Code2, 
  Database, 
  Eye, 
  Radio, 
  Server, 
  BarChart3, 
  ShieldCheck 
} from 'lucide-react';

interface CosmicAwakeningProps {
  onEnterUniverse: () => void;
  onExploreDirectly: () => void;
  onPlayClick?: () => void;
  onSkipIntro?: () => void;
  isMuted?: boolean;
  onToggleSound?: () => void;
}

interface HighlightSkill {
  id: string;
  name: string;
  category: 'all' | 'ml' | 'dl' | 'genai' | 'data' | 'core';
  tag: string;
  desc: string;
  icon: React.ReactNode;
}

export const CosmicAwakening: React.FC<CosmicAwakeningProps> = ({
  onEnterUniverse,
  onExploreDirectly,
  onPlayClick,
  isMuted,
  onToggleSound,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredSkill, setHoveredSkill] = useState<HighlightSkill | null>(null);

  const handleAction = (cb: () => void) => {
    if (onPlayClick) onPlayClick();
    cb();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleAction(onEnterUniverse);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnterUniverse]);

  const highlightSkills: HighlightSkill[] = [
    {
      id: 'python',
      name: 'Python & C++',
      category: 'core',
      tag: 'Core Languages',
      desc: 'Algorithm design, data structures, NumPy & Pandas scientific computing',
      icon: <Code2 className="w-3.5 h-3.5 text-sky-400" />,
    },
    {
      id: 'pytorch',
      name: 'PyTorch & TensorFlow',
      category: 'dl',
      tag: 'Deep Learning',
      desc: 'Custom neural architectures, GPU optimization, backprop & transfer learning',
      icon: <Brain className="w-3.5 h-3.5 text-orange-400" />,
    },
    {
      id: 'ml',
      name: 'Machine Learning',
      category: 'ml',
      tag: 'Scikit-Learn',
      desc: 'Supervised/unsupervised algorithms, regression, cross-validation & SMOTE',
      icon: <Cpu className="w-3.5 h-3.5 text-indigo-400" />,
    },
    {
      id: 'xgboost',
      name: 'XGBoost & LightGBM',
      category: 'ml',
      tag: 'Ensembles',
      desc: 'High-performance gradient boosting for tabular data & demand forecasting',
      icon: <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />,
    },
    {
      id: 'genai',
      name: 'Generative AI & LLMs',
      category: 'genai',
      tag: 'GenAI / NLP',
      desc: 'Prompt engineering, safety guardrails, intent reasoning & Hugging Face models',
      icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />,
    },
    {
      id: 'rag',
      name: 'Grounded RAG Architecture',
      category: 'genai',
      tag: 'Enterprise RAG',
      desc: 'Vector embeddings, semantic chunking & cosine similarity retrieval',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      id: 'cv',
      name: 'Computer Vision & CNNs',
      category: 'dl',
      tag: 'Vision AI',
      desc: 'ResNet-18, EfficientNet, visual Grad-CAM explainability & medical imaging',
      icon: <Eye className="w-3.5 h-3.5 text-pink-400" />,
    },
    {
      id: 'speech',
      name: 'NLP & Speech AI',
      category: 'genai',
      tag: 'Speech / Audio',
      desc: 'Log-Mel Spectrograms, 64-band MFCC acoustic feature extraction & Librosa',
      icon: <Radio className="w-3.5 h-3.5 text-amber-400" />,
    },
    {
      id: 'fastapi',
      name: 'FastAPI & Microservices',
      category: 'core',
      tag: 'API Serving',
      desc: 'Asynchronous REST APIs, JSON validation schemas, real-time ML endpoints',
      icon: <Server className="w-3.5 h-3.5 text-teal-400" />,
    },
    {
      id: 'sql',
      name: 'SQL & Power BI',
      category: 'data',
      tag: 'Data Engineering',
      desc: 'PostgreSQL, relational querying, data warehousing & executive BI dashboards',
      icon: <Database className="w-3.5 h-3.5 text-blue-400" />,
    },
  ];

  const categoryFilters = [
    { id: 'all', label: 'All Core Skills' },
    { id: 'ml', label: 'Machine Learning' },
    { id: 'dl', label: 'Deep Learning' },
    { id: 'genai', label: 'GenAI & NLP' },
    { id: 'core', label: 'Engineering & APIs' },
    { id: 'data', label: 'Data & SQL' },
  ];

  const filteredSkills = activeCategory === 'all'
    ? highlightSkills
    : highlightSkills.filter((s) => s.category === activeCategory);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 py-8 sm:py-12 z-20 pointer-events-none select-none">
      {/* Discreet Audio Control in Top Right (no navbar) */}
      {onToggleSound && (
        <div className="absolute top-5 right-5 sm:top-7 sm:right-7 z-30 pointer-events-auto">
          <button
            onClick={() => {
              if (onPlayClick) onPlayClick();
              onToggleSound();
            }}
            className={`p-2.5 rounded-full border transition-all duration-300 ${
              isMuted
                ? 'glass-panel border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                : 'glass-panel border-cyan-400 text-cyan-300 shadow-glow-cyan bg-cyan-500/10'
            }`}
            title={isMuted ? 'Turn Sound ON' : 'Mute Sound'}
            aria-label={isMuted ? 'Sound Disabled' : 'Sound Enabled'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>
        </div>
      )}

      {/* Main Hero & Identity Container */}
      <div className="max-w-4xl w-full mx-auto text-center space-y-7 sm:space-y-8 my-auto pointer-events-auto">
        
        {/* Name in Cinematic Glow Typography */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight text-white uppercase drop-shadow-2xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400">
              Nagendra
            </span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 text-glow-cyan">
              Kushwaha
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base font-mono tracking-widest text-slate-300 uppercase font-medium">
            AI/ML Engineer • Data Science • Intelligent Systems
          </p>
        </div>

        {/* Technical Skills Showcase */}
        <div className="max-w-3xl mx-auto space-y-3 pt-1">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {categoryFilters.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  if (onPlayClick) onPlayClick();
                  setActiveCategory(cat.id);
                }}
                className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-glow-cyan font-semibold'
                    : 'glass-panel text-slate-400 hover:text-slate-200 border-white/5 hover:border-white/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Interactive Skills Grid / Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-2">
            {filteredSkills.map((skill) => {
              const isHovered = hoveredSkill?.id === skill.id;
              return (
                <div
                  key={skill.id}
                  onMouseEnter={() => setHoveredSkill(skill)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className={`group relative px-3.5 py-2 rounded-xl glass-card transition-all duration-300 flex items-center space-x-2 cursor-pointer ${
                    isHovered
                      ? 'border-cyan-400/80 bg-cyan-950/40 shadow-glow-cyan scale-105'
                      : 'border-white/10 hover:border-cyan-400/40 hover:bg-white/5'
                  }`}
                >
                  <span className="shrink-0">{skill.icon}</span>
                  <span className="text-xs sm:text-sm font-mono text-slate-200 group-hover:text-white font-medium">
                    {skill.name}
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-cyan-300 border border-cyan-500/20">
                    {skill.tag}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Skill Description Preview Bar */}
          <div className="min-h-[22px] flex items-center justify-center pt-1 text-xs font-mono text-cyan-300/80 transition-opacity">
            {hoveredSkill ? (
              <span className="animate-in fade-in duration-200">
                ✨ <strong className="text-white">{hoveredSkill.name}:</strong> {hoveredSkill.desc}
              </span>
            ) : (
              <span className="text-slate-400 text-[11px]">
                Hover any skill to inspect architectural implementation & toolset
              </span>
            )}
          </div>
        </div>

        {/* Primary Action Buttons (Entering Universe & Direct Portfolio Access) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {/* Main Enter Button */}
          <button
            onClick={() => handleAction(onEnterUniverse)}
            className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono text-sm tracking-wider font-semibold shadow-glow-cyan hover:shadow-cyan-400/60 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-3 cursor-pointer"
          >
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span>ENTER THE UNIVERSE</span>
            <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Direct Portfolio Access Option */}
          <button
            onClick={() => handleAction(onExploreDirectly)}
            className="px-6 py-4 rounded-full glass-panel border border-purple-500/30 text-purple-200 hover:text-white font-mono text-sm tracking-wider hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-300 flex items-center space-x-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>DIRECT PORTFOLIO ACCESS</span>
          </button>
        </div>

      </div>
    </div>
  );
};
