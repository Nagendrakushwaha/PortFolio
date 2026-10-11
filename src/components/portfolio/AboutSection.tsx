import React from 'react';
import { User, GraduationCap, Target, Cpu, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { profileData } from '../../data/profile';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="space-y-4 text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <User className="w-3.5 h-3.5" />
          <span>ABOUT & ACADEMIC FOUNDATION</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
          Architecting Intelligence with Mathematical Rigor
        </h2>
        <p className="text-sm font-mono text-slate-400">
          Rooted in computer science principles and driven by empirical validation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Academic Credentials & Core Objectives */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-white/10">
            <h3 className="text-xl font-display font-bold text-white flex items-center space-x-3">
              <GraduationCap className="w-6 h-6 text-cyan-400" />
              <span>Academic Background</span>
            </h3>

            <div className="space-y-3 font-mono text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-300 font-bold block text-sm sm:text-base">
                    {profileData.education.degree} in {profileData.education.field}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                    CGPA: {profileData.education.cgpa}
                  </span>
                </div>
                <span className="text-slate-300 block">
                  {profileData.education.institution} • {profileData.education.location}
                </span>
                <span className="text-slate-400 block text-xs">
                  Duration: {profileData.education.period}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {profileData.bioSummary}
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono tracking-wider text-cyan-300 uppercase flex items-center space-x-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>Professional Engineering Objective</span>
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed pl-6 border-l-2 border-cyan-500/40">
                "{profileData.objective}"
              </p>
            </div>
          </div>

          {/* Core Methodological Principles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel rounded-xl p-4 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-mono font-bold text-white">Data Integrity</h5>
              <p className="text-xs text-slate-400">
                Transparent validation protocols without synthetic metric inflation.
              </p>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-mono font-bold text-white">System Architecture</h5>
              <p className="text-xs text-slate-400">
                Clean modular pipelines designed for low-latency inference and maintainability.
              </p>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-mono font-bold text-white">Continuous Growth</h5>
              <p className="text-xs text-slate-400">
                Deep exploration of transformer architectures, computer vision, and acoustic representations.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Terminal Profile Card */}
        <div className="lg:col-span-5">
          <div className="glass-panel rounded-2xl border border-white/15 overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="bg-[#0a0a0f] px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs font-mono text-slate-400 pl-2">
                  nagendra@multiverse:~
                </span>
              </div>
              <Terminal className="w-4 h-4 text-cyan-400" />
            </div>

            {/* Terminal Content */}
            <div className="p-5 font-mono text-xs space-y-3 bg-black/95 text-slate-300">
              <p className="text-cyan-400">
                $ whoami
              </p>
              <p className="text-slate-200">
                Nagendra Kushwaha [AI/ML Engineer & Data Science Specialist]
              </p>

              <p className="text-cyan-400 pt-2">
                $ cat academic_status.json
              </p>
              <pre className="text-slate-400 p-3 rounded-lg bg-black/60 border border-white/5 overflow-x-auto text-[11px] leading-relaxed">
{`{
  "name": "Nagendra Kushwaha",
  "institution": "Sam Global University",
  "program": "B.Tech Computer Science and Engineering",
  "timeline": "2023 - 2027",
  "cgpa": "7.85 / 10",
  "location": "Bhopal, Madhya Pradesh, India",
  "focus_areas": [
    "Machine Learning & Deep Learning",
    "Conversational AI & Grounded RAG",
    "Computer Vision & Grad-CAM",
    "Speech Acoustic Modeling"
  ],
  "verification_mode": "Strict Academic Integrity"
}`}
              </pre>

              <p className="text-cyan-400 pt-2">
                $ cat engineering_mantra.txt
              </p>
              <p className="text-slate-300 italic">
                "Models are only as trustworthy as the validation protocols that test them."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
