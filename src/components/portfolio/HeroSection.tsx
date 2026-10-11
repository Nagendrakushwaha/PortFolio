import React from 'react';
import { ArrowRight, Download, FlaskConical, ShieldCheck } from 'lucide-react';
import { profileData } from '../../data/profile';

interface HeroSectionProps {
  onExploreProjects: () => void;
  onExploreLab: () => void;
  onContact: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProjects,
  onExploreLab,
  onContact,
}) => {
  return (
    <section className="relative py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
        {/* Left Column: Identity & Positioning */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>AI/ML ENGINEER & DATA SCIENTIST • BHOPAL, INDIA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-tight">
            Engineering{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 text-glow-cyan">
              Intelligent Systems
            </span>{' '}
            Across Complex Data Dimensions.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            {profileData.objective}
          </p>

          {/* Academic & CGPA Verification Badge */}
          <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs font-mono space-y-0.5">
                <span className="text-slate-200 font-semibold block">
                  {profileData.education.degree} in {profileData.education.field}
                </span>
                <span className="text-slate-400 block">
                  {profileData.education.institution} • {profileData.education.period}
                </span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold shrink-0 self-start sm:self-auto">
              CGPA: {profileData.education.cgpa}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreProjects}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono text-xs sm:text-sm font-semibold shadow-glow-cyan hover:shadow-cyan-400/60 transition-all flex items-center space-x-2"
            >
              <span>Explore 10 Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreLab}
              className="px-6 py-3 rounded-full glass-panel border border-emerald-500/30 text-emerald-300 hover:text-white hover:border-emerald-400 hover:bg-emerald-500/10 font-mono text-xs sm:text-sm font-medium transition-all flex items-center space-x-2"
            >
              <FlaskConical className="w-4 h-4 text-emerald-400" />
              <span>Interactive ML Lab</span>
            </button>

            {/* Resume Downloads */}
            {profileData.resumes?.map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                download={res.filename}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-full glass-panel border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400 hover:bg-purple-500/10 font-mono text-xs transition-all flex items-center space-x-1.5"
                title={`Download ${res.label}`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{res.label}</span>
              </a>
            ))}

            <button
              onClick={onContact}
              className="px-5 py-3 rounded-full glass-panel border border-white/15 text-slate-300 hover:text-white font-mono text-xs sm:text-sm transition-all"
            >
              Get in Touch
            </button>
          </div>
        </div>

        {/* Right Column: Nagendra Kushwaha Real Photograph in Sci-Fi Frame */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative group w-72 sm:w-84">
            {/* Ambient Cosmic Radial Glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-cyan-500/40 via-purple-600/30 to-blue-500/40 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative rounded-3xl glass-panel-glow border border-cyan-400/40 p-4 sm:p-5 overflow-hidden shadow-2xl backdrop-blur-2xl">
              {/* Profile Image with subtle holographic corner accents */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-black/60 border border-white/10">
                <img
                  src={profileData.avatarUrl}
                  alt={profileData.name}
                  className="w-full h-full object-cover object-top filter brightness-105 contrast-105 group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Holographic Scanline Overlay */}
                <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
                
                {/* Real-time Status Badge */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/70 border border-cyan-500/30 backdrop-blur-md flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white font-semibold">Nagendra Kushwaha</span>
                  </div>
                  <span className="text-[10px] text-cyan-300">ONLINE</span>
                </div>
              </div>

              {/* Quick Specs List */}
              <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Focus</span>
                  <span className="text-slate-200">Generative AI / RAG</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Location</span>
                  <span className="text-cyan-300">Bhopal, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
