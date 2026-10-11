import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  ArrowUpRight, 
  FlaskConical, 
  Info
} from 'lucide-react';
import { projectsData } from '../../data/projects';
import type { ProjectData } from '../../types/portfolio';
import { ProjectModal } from './ProjectModal';
import { GithubIcon } from '../ui/Icons';

interface ProjectsGalaxyProps {
  onOpenDemo?: (projectSlug: string) => void;
}

export const ProjectsGalaxy: React.FC<ProjectsGalaxyProps> = ({ onOpenDemo }) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProject, setActiveModalProject] = useState<ProjectData | null>(null);

  const domains: string[] = ['All', 'Artificial Intelligence', 'Deep Learning', 'Computer Vision', 'Machine Learning', 'Data Science', 'Cybersecurity'];

  const filteredProjects = useMemo(() => {
    return projectsData.filter((p) => {
      const matchesDomain = selectedDomain === 'All' || p.domain === selectedDomain;
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDomain && matchesSearch;
    });
  }, [selectedDomain, searchQuery]);

  return (
    <section id="projects" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Layers className="w-3.5 h-3.5" />
          <span>VERIFIED PROJECT CONSTELLATION</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
          Real AI Systems & Empirical Architectures
        </h2>
        <p className="text-sm font-mono text-slate-400">
          10 verified projects with real benchmarks, model architectures, and open-source repositories.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-300 ${
                selectedDomain === domain
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-glow-cyan'
                  : 'glass-panel text-slate-400 hover:text-white border-white/10 hover:border-white/20'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tech, title, or domain..."
            className="w-full pl-10 pr-4 py-2 rounded-full glass-panel border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
          />
        </div>
      </div>

      {/* Projects Grid with Real Cover Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => setActiveModalProject(project)}
            className="group cursor-pointer glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between transition-all duration-300 hover:border-cyan-400/50 hover:shadow-2xl"
          >
            {/* Top Project Cover Image if available */}
            {project.image && (
              <div className="relative w-full h-44 overflow-hidden bg-black/60 border-b border-white/10">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1338] via-transparent to-transparent opacity-80" />
                
                {/* Domain Pill on Image */}
                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-black/70 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
                    {project.domain}
                  </span>
                </div>

                {/* Live Demo / Lab Badge on Image */}
                <div className="absolute top-3 right-3">
                  {project.liveDemoUrl ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/80 text-white border border-emerald-400 backdrop-blur-md flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      <span>Live Render Demo</span>
                    </span>
                  ) : project.demoAvailable ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/80 text-white border border-purple-400 backdrop-blur-md flex items-center space-x-1">
                      <FlaskConical className="w-3 h-3" />
                      <span>ML Lab</span>
                    </span>
                  ) : null}
                </div>
              </div>
            )}

            {/* Content Body */}
            <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
              <div>
                {!project.image && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {project.domain}
                    </span>
                  </div>
                )}

                <h3 className="text-base sm:text-lg font-display font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {project.shortDescription}
                </p>
              </div>

              {/* Technologies Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.technologies.slice(0, 4).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300 border border-white/5"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                    +{project.technologies.length - 4}
                  </span>
                )}
              </div>

              {/* Bottom Row: Actions & Case Study Trigger */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 group-hover:underline flex items-center space-x-1">
                  <span>View Case Study</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>

                <div className="flex items-center space-x-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title="View GitHub Repository"
                    >
                      <GithubIcon className="w-3.5 h-3.5 text-cyan-400" />
                    </a>
                  )}
                  {project.dataIntegrityNote && (
                    <span 
                      className="text-amber-400/80 hover:text-amber-300 transition-colors"
                      title="Includes verified evaluation notes"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 glass-panel rounded-2xl border border-white/10 p-8">
          <p className="text-slate-400 font-mono text-xs">
            No projects found matching current filter or search criteria.
          </p>
        </div>
      )}

      {/* Case Study Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
        onOpenDemo={onOpenDemo}
      />
    </section>
  );
};
