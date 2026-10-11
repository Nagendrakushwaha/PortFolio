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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold shadow-sm">
                {project.domain}
              </span>
              {project.demoAvailable && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center space-x-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Interactive Lab Available</span>
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 pt-1">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm font-mono text-slate-600">
              {project.shortDescription}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-900 transition-all shadow-sm"
            aria-label="Close Case Study"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Cover Image */}
        {project.image && (
          <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
          </div>
        )}

        {/* Action Bar (Live Demo, GitHub & Interactive Lab) */}
        <div className="flex flex-wrap items-center gap-3">
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-mono text-xs font-semibold shadow-md hover:scale-105 transition-all flex items-center space-x-2"
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
              className="px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-indigo-400 text-xs font-mono text-slate-800 shadow-sm flex items-center space-x-2 transition-all"
            >
              <GithubIcon className="w-4 h-4 text-indigo-600" />
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
              className="px-4 py-2 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-xs font-mono font-semibold flex items-center space-x-2 shadow-sm transition-all"
            >
              <FlaskConical className="w-4 h-4 text-purple-600" />
              <span>Launch in ML Lab</span>
            </button>
          )}
        </div>

        {/* Data Integrity / Verification Notice if present */}
        {project.dataIntegrityNote && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs font-mono text-blue-900 flex items-start space-x-3 shadow-sm">
            <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block text-blue-950">Data Integrity & Verification Protocol:</span>
              <p className="text-blue-800 leading-relaxed font-sans">
                {project.dataIntegrityNote}
              </p>
            </div>
          </div>
        )}

        {/* Problem Statement & Objective */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-700 font-bold flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-indigo-600" />
              <span>Problem Statement</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {project.problemStatement}
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-purple-700 font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>Engineering Objective</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {project.objective}
            </p>
          </div>
        </div>

        {/* Architecture & Pipeline */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-900 font-bold flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>Architecture & Pipeline Overview</span>
          </h3>
          <div className="p-3.5 rounded-xl bg-slate-950 text-cyan-300 border border-slate-800 font-mono text-xs shadow-inner">
            {project.architectureOverview}
          </div>
        </div>

        {/* Dataset Information */}
        {project.datasetInfo && (
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-blue-700 font-bold flex items-center space-x-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Dataset Benchmark Information</span>
            </h3>
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-slate-900 block">
                {project.datasetInfo.name}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {project.datasetInfo.description}
              </p>
            </div>
          </div>
        )}

        {/* Methodology Steps */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-900 font-bold flex items-center space-x-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Methodology & Training Workflow</span>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {project.methodology.map((step, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="text-indigo-600 font-mono font-bold">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Evaluation Metrics / Verification Status */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-900 font-bold">
              Evaluation Metrics & Verification Telemetry
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.metrics.map((metric, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">{metric.label}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      metric.status === 'reported_historical'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {metric.status === 'reported_historical' ? 'Historical Reported' : 'Verified'}
                    </span>
                  </div>
                  <div className="text-lg font-mono font-extrabold text-slate-900">
                    {metric.value}
                  </div>
                  {metric.note && (
                    <p className="text-[11px] text-slate-600 font-mono">
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
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Actual Technologies & Libraries Used
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-100 border border-slate-200 text-slate-800 font-semibold"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Challenges & Limitations */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-xs text-amber-900 shadow-sm">
          <span className="font-mono text-amber-950 font-bold block">
            Identified Technical Challenges & Boundary Conditions:
          </span>
          <ul className="list-disc list-inside space-y-1 text-amber-800">
            {project.challengesAndLimitations.map((lim, idx) => (
              <li key={idx}>{lim}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
