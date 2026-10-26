import React from 'react';
import { ArrowRight, Download, FlaskConical, ShieldCheck, Sparkles } from 'lucide-react';
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
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-mono text-indigo-700 shadow-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span>AI/ML ENGINEER & DATA SCIENTIST • BHOPAL, INDIA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
            Engineering{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 font-extrabold">
              Intelligent Systems
            </span>{' '}
            Across Complex Data Dimensions.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            {profileData.objective}
          </p>

          {/* Academic & CGPA Verification Badge */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-md shadow-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs font-mono space-y-0.5">
                <span className="text-slate-900 font-bold block text-sm">
                  {profileData.education.degree} in {profileData.education.field}
                </span>
                <span className="text-slate-600 block">
                  {profileData.education.institution} • {profileData.education.period}
                </span>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold shrink-0 self-start sm:self-auto shadow-sm">
              CGPA: {profileData.education.cgpa}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreProjects}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-mono text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all flex items-center space-x-2"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreLab}
              className="px-6 py-3 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono text-xs sm:text-sm font-semibold shadow-sm hover:scale-105 transition-all flex items-center space-x-2"
            >
              <FlaskConical className="w-4 h-4 text-emerald-600" />
              <span>Interactive ML Lab</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('skills');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 font-mono text-xs sm:text-sm font-semibold shadow-sm hover:scale-105 transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>57 Technical Skills</span>
            </button>

            {/* Resume Downloads */}
            {profileData.resumes?.map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                download={res.filename}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-300 text-purple-800 font-mono text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
                title={`Download ${res.label}`}
              >
                <Download className="w-3.5 h-3.5 text-purple-600" />
                <span>{res.label}</span>
              </a>
            ))}

            <button
              onClick={onContact}
              className="px-5 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 font-mono text-xs sm:text-sm font-medium shadow-sm transition-all"
            >
              Get in Touch
            </button>
          </div>
        </div>

        {/* Right Column: Nagendra Kushwaha Real Photograph in High-Tech Frame */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative group w-72 sm:w-84">
            {/* Ambient Radial Glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-blue-400/25 via-indigo-400/20 to-purple-400/25 blur-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative rounded-3xl bg-white/95 border border-slate-200/90 p-4 sm:p-5 overflow-hidden shadow-2xl backdrop-blur-xl">
              {/* Profile Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 border border-slate-200 shadow-inner">
                <img
                  src={profileData.avatarUrl}
                  alt={profileData.name}
                  className="w-full h-full object-cover object-top filter brightness-100 contrast-105 group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Real-time Status Badge */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-md backdrop-blur-md flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-slate-900 font-bold">{profileData.name}</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">ONLINE</span>
                </div>
              </div>

              {/* Quick Specs List */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Focus</span>
                  <span className="text-slate-800 font-semibold">Generative AI / RAG</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Location</span>
                  <span className="text-indigo-600 font-semibold">Bhopal, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
