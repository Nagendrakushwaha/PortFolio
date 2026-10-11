import React, { useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  Layers, 
  Database, 
  Cpu, 
  AlertTriangle,
  FlaskConical
} from 'lucide-react';
import { GithubIcon } from '../ui/Icons';
import type { ProjectData } from '../../types/portfolio';

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
  onOpenDemo?: (projectSlug: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onOpenDemo,
}) => {
  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-xl animate-in fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel-glow rounded-3xl border border-cyan-500/40 p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {project.domain}
              </span>
              {project.demoAvailable && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Interactive Lab Available</span>
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white pt-1">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm font-mono text-slate-400">
              {project.shortDescription}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full glass-panel border border-white/15 text-slate-400 hover:text-white hover:border-white/30 transition-all"
            aria-label="Close Case Study"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Cover Image */}
        {project.image && (
          <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden border border-white/10 bg-black/60">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          </div>
        )}

        {/* Action Bar (Live Demo, GitHub & Interactive Lab) */}
        <div className="flex flex-wrap items-center gap-3">
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-mono text-xs font-semibold shadow-glow-cyan hover:scale-105 transition-all flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch Live Deployment</span>
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full glass-panel border border-white/20 hover:border-cyan-400 text-xs font-mono text-white flex items-center space-x-2 transition-all"
            >
              <GithubIcon className="w-4 h-4 text-cyan-400" />
              <span>View Repository Code</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}

          {project.demoAvailable && onOpenDemo && (
            <button
              onClick={() => {
                onClose();
                onOpenDemo(project.slug);
              }}
              className="px-4 py-2 rounded-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-mono flex items-center space-x-2 transition-all"
            >
              <FlaskConical className="w-4 h-4 text-purple-400" />
              <span>Launch in ML Lab</span>
            </button>
          )}
        </div>

        {/* Data Integrity / Verification Notice if present */}
        {project.dataIntegrityNote && (
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-200 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block text-cyan-300">Data Integrity & Verification Protocol:</span>
              <p className="text-slate-300 leading-relaxed">
                {project.dataIntegrityNote}
              </p>
            </div>
          </div>
        )}

        {/* Problem Statement & Objective */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-300 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-cyan-400" />
              <span>Problem Statement</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {project.problemStatement}
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-purple-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Engineering Objective</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {project.objective}
            </p>
          </div>
        </div>

        {/* Architecture & Pipeline */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-white flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Architecture & Pipeline Overview</span>
          </h3>
          <div className="p-3 rounded-xl bg-black/50 border border-white/5 font-mono text-xs text-cyan-200">
            {project.architectureOverview}
          </div>
        </div>

        {/* Dataset Information */}
        {project.datasetInfo && (
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-sky-300 flex items-center space-x-2">
              <Database className="w-4 h-4 text-sky-400" />
              <span>Dataset Benchmark Information</span>
            </h3>
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-white block">
                {project.datasetInfo.name}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {project.datasetInfo.description}
              </p>
            </div>
          </div>
        )}

        {/* Methodology Steps */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Methodology & Training Workflow</span>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            {project.methodology.map((step, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="text-cyan-400 font-mono font-bold">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Evaluation Metrics / Verification Status */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white">
              Evaluation Metrics & Verification Telemetry
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.metrics.map((metric, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{metric.label}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      metric.status === 'reported_historical'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {metric.status === 'reported_historical' ? 'Historical Reported' : 'Verified'}
                    </span>
                  </div>
                  <div className="text-lg font-mono font-bold text-white">
                    {metric.value}
                  </div>
                  {metric.note && (
                    <p className="text-[11px] text-slate-400 font-mono">
                      {metric.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technologies Used */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Actual Technologies & Libraries Used
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-cyan-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Challenges & Limitations */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs text-slate-400">
          <span className="font-mono text-slate-300 font-bold block">
            Identified Technical Challenges & Boundary Conditions:
          </span>
          <ul className="list-disc list-inside space-y-1">
            {project.challengesAndLimitations.map((lim, idx) => (
              <li key={idx}>{lim}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
