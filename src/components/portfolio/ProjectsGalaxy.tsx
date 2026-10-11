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
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono text-blue-700 shadow-sm font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>VERIFIED PROJECT CONSTELLATION</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
          Real AI Systems & Empirical Architectures
        </h2>
        <p className="text-sm font-mono text-slate-600">
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
                  ? 'bg-indigo-600 text-white border border-indigo-600 shadow-md shadow-indigo-500/25 font-semibold'
                  : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
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
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>
      </div>

      {/* Projects Grid with Real Cover Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => setActiveModalProject(project)}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl hover:border-indigo-400 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top Project Cover Image if available */}
            {project.image && (
              <div className="relative w-full h-44 overflow-hidden bg-slate-100 border-b border-slate-200">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
                
                {/* Domain Pill on Image */}
                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/95 text-indigo-700 font-bold border border-slate-200/80 shadow-sm backdrop-blur-md">
                    {project.domain}
                  </span>
                </div>

                {/* Live Demo / Lab Badge on Image */}
                <div className="absolute top-3 right-3">
                  {project.liveDemoUrl ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-600 text-white font-semibold shadow-sm flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      <span>Live Render Demo</span>
                    </span>
                  ) : project.demoAvailable ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-600 text-white font-semibold shadow-sm flex items-center space-x-1">
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
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                      {project.domain}
                    </span>
                  </div>
                )}

                <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {project.shortDescription}
                </p>
              </div>

              {/* Technologies Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.technologies.slice(0, 4).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200/80 font-medium"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500 font-medium">
                    +{project.technologies.length - 4}
                  </span>
                )}
              </div>

              {/* Bottom Row: Actions & Case Study Trigger */}
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono">
                <span className="text-indigo-600 font-semibold group-hover:text-indigo-700 group-hover:underline flex items-center space-x-1">
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
                      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                      title="View GitHub Repository"
                    >
                      <GithubIcon className="w-3.5 h-3.5 text-indigo-600" />
                    </a>
                  )}
                  {project.dataIntegrityNote && (
                    <span 
                      className="text-amber-500 hover:text-amber-600 transition-colors"
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
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <p className="text-slate-500 font-mono text-xs">
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
