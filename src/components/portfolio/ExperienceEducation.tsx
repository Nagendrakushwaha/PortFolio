import React from 'react';
import { GraduationCap, CheckCircle2, Calendar, Award } from 'lucide-react';
import { experienceData, certificationsData } from '../../data/experience';

export const ExperienceEducation: React.FC = () => {
  return (
    <section id="experience" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-16">
      {/* Experience & Education Section */}
      <div>
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel border border-blue-500/30 text-xs font-mono text-blue-300">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>ACADEMIC & PROFESSIONAL TIMELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Education, Internships & Mentorship
          </h2>
          <p className="text-sm font-mono text-slate-400">
            B.Tech in Computer Science Engineering at Sam Global University (CGPA: 7.85/10), professional industry internships, and student mentorship.
          </p>
        </div>

        <div className="relative border-l border-white/10 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10">
          {experienceData.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline bullet icon */}
              <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-black border-2 border-cyan-400 flex items-center justify-center shadow-glow-cyan">
                <span className="w-2 h-2 rounded-full bg-cyan-300" />
              </div>

              {/* Experience Card */}
              <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 group-hover:border-cyan-500/30 transition-all duration-300 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.type === 'academic'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : item.type === 'internship'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : item.type === 'mentorship'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {item.type === 'academic'
                          ? 'Degree Education'
                          : item.type === 'internship'
                          ? 'Industry Internship'
                          : item.type === 'mentorship'
                          ? 'Technical Mentorship'
                          : 'Virtual Experience Simulation'}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-white mt-1">
                      {item.role}
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-cyan-400">
                      {item.organization}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.period}</span>
                  </div>
                </div>

                {/* Highlights */}
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {item.highlights.map((hl, hIdx) => (
                    <li key={hIdx} className="flex items-start space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{hl}</span>
                    </li>
                  ))}
                </ul>

                {/* Skills Tags */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {item.skillsUsed.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300 border border-white/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications & Industry Credentials */}
      <div className="pt-8 border-t border-white/10">
        <div className="space-y-3 text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel border border-emerald-500/30 text-xs font-mono text-emerald-300">
            <Award className="w-3.5 h-3.5" />
            <span>INDUSTRY CERTIFICATIONS</span>
          </div>
          <h3 className="text-2xl font-display font-bold text-white">
            Verified Professional Specializations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certificationsData.map((cert, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Award className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  {cert.status}
                </span>
              </div>

              <h4 className="text-base font-display font-bold text-white">
                {cert.title}
              </h4>
              <p className="text-xs font-mono text-cyan-300 font-semibold">
                {cert.issuer}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {cert.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
