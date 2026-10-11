import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Code2, 
  Brain, 
  Languages, 
  Database, 
  Wrench, 
  Search, 
  Layers, 
  CheckCircle2,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { skills, skillCategories } from '../../data/skills';
import type { SkillItem } from '../../types/portfolio';

export const SkillsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Programming':
        return <Code2 className="w-4 h-4 text-sky-500" />;
      case 'Machine Learning':
        return <Cpu className="w-4 h-4 text-indigo-500" />;
      case 'Deep Learning':
        return <Brain className="w-4 h-4 text-orange-500" />;
      case 'NLP':
        return <Languages className="w-4 h-4 text-emerald-500" />;
      case 'Generative AI':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'Data':
        return <Database className="w-4 h-4 text-blue-500" />;
      case 'Tools':
        return <Wrench className="w-4 h-4 text-teal-500" />;
      default:
        return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Core':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Core</span>
          </span>
        );
      case 'Working Knowledge':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-blue-50 border border-blue-200 text-blue-700 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Working Knowledge</span>
          </span>
        );
      case 'Exploring':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-purple-50 border border-purple-200 text-purple-700 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>Exploring</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-600">
            {level}
          </span>
        );
    }
  };

  const countsByCategory = useMemo(() => {
    const map: Record<string, number> = { All: skills.length };
    skills.forEach((s) => {
      map[s.category] = (map[s.category] || 0) + 1;
    });
    return map;
  }, []);

  const countsByLevel = useMemo(() => {
    const map: Record<string, number> = { All: skills.length };
    skills.forEach((s) => {
      map[s.level] = (map[s.level] || 0) + 1;
    });
    return map;
  }, []);

  const filteredSkills = useMemo(() => {
    return skills.filter((item: SkillItem) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All' || item.level === selectedLevel;
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesLevel && matchesSearch;
    });
  }, [selectedCategory, selectedLevel, searchQuery]);

  return (
    <section id="skills" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-mono text-indigo-700 shadow-sm font-semibold">
          <Cpu className="w-3.5 h-3.5 text-indigo-600" />
          <span>TECHNICAL COMPETENCIES & TOOLSET</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Skills, Frameworks & Specializations
        </h2>
        <p className="text-sm sm:text-base font-mono text-slate-600">
          57 verified skills across algorithmic programming, classical machine learning, deep neural architectures, conversational AI, and scalable data systems.
        </p>

        {/* Quick Level Statistics Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setSelectedLevel('All')}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
              selectedLevel === 'All'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Levels ({skills.length})
          </button>
          <button
            onClick={() => setSelectedLevel('Core')}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
              selectedLevel === 'Core'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            Core ({countsByLevel['Core'] || 0})
          </button>
          <button
            onClick={() => setSelectedLevel('Working Knowledge')}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
              selectedLevel === 'Working Knowledge'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            Working Knowledge ({countsByLevel['Working Knowledge'] || 0})
          </button>
          <button
            onClick={() => setSelectedLevel('Exploring')}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
              selectedLevel === 'Exploring'
                ? 'bg-purple-600 text-white font-semibold shadow-xs'
                : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
            }`}
          >
            Exploring ({countsByLevel['Exploring'] || 0})
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
        
        {/* Top Controls: Search Bar and Active Filters indicator */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 57 technical skills (e.g., Python, RAG, CNN, SQL)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-full text-xs sm:text-sm font-mono bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-800 placeholder:text-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
            <span>Showing <strong className="text-slate-900">{filteredSkills.length}</strong> of {skills.length} skills</span>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {skillCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = countsByCategory[cat] ?? 0;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/25 border border-indigo-600'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {filteredSkills.map((item, idx) => (
              <div
                key={`${item.name}-${idx}`}
                className="group bg-slate-50/70 hover:bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-white shadow-2xs border border-slate-200 group-hover:scale-105 transition-transform">
                        {getCategoryIcon(item.category)}
                      </div>
                      <h3 className="text-base font-display font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </h3>
                    </div>

                    <div className="shrink-0">
                      {getLevelBadge(item.level)}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 font-mono leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                    <span>{item.category}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-indigo-500 transition-colors font-medium">
                    Verified Competency
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <p className="text-slate-500 font-mono text-sm">
              No skills found matching &ldquo;{searchQuery}&rdquo; in {selectedCategory}.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLevel('All');
              }}
              className="px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-semibold hover:bg-indigo-100 transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
