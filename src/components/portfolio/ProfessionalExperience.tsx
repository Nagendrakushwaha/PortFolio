import React from 'react';
import { Briefcase, CheckCircle2, Calendar } from 'lucide-react';
import { experienceData } from '../../data/experience';

export const ProfessionalExperience: React.FC = () => {
  const professionalItems = experienceData.filter((item) => item.type !== 'academic');

  return (
    <section id="experience" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      <div className="space-y-4 text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono text-blue-700 shadow-sm font-semibold">
          <Briefcase className="w-3.5 h-3.5" />
          <span>PROFESSIONAL &amp; INDUSTRY TRACK</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
          Professional Experience &amp; Mentorship
        </h2>
        <p className="text-sm font-mono text-slate-600">
          Corporate market research, international B2B lead generation, data analytics internships, and technical mentorship.
        </p>
      </div>

      <div className="relative border-l border-slate-300 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10">
        {professionalItems.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline bullet icon */}
            <div className={`absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center shadow-md transition-all ${
              item.isCurrent ? 'border-emerald-500 ring-4 ring-emerald-100/60' : 'border-indigo-600'
            }`}>
              <span className={`w-2 h-2 rounded-full ${item.isCurrent ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-600'}`} />
            </div>

            {/* Experience Card */}
            <div className={`bg-white rounded-2xl p-6 sm:p-8 border shadow-md hover:shadow-lg transition-all duration-300 space-y-4 ${
              item.isCurrent ? 'border-slate-200/90 hover:border-emerald-300' : 'border-slate-200 hover:border-indigo-300'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider font-bold shadow-2xs ${
                      item.type === 'corporate' || item.type === 'full_time'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : item.type === 'internship'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.type === 'mentorship'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}>
                      {item.type === 'corporate' || item.type === 'full_time'
                        ? 'Professional Work Experience'
                        : item.type === 'internship'
                        ? 'Industry Internship'
                        : item.type === 'mentorship'
                        ? 'Technical Mentorship'
                        : 'Virtual Experience Simulation'}
                    </span>

                    {item.isCurrent && (
                      <span className="inline-flex items-center space-x-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Currently Working</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 mt-1">
                    {item.role}
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-indigo-600 font-semibold">
                    {item.organization}
                  </p>
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-500 shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.period}</span>
                </div>
              </div>

              {/* Role Overview Description */}
              {item.description && (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
                  {item.description}
                </p>
              )}

              {/* Highlights */}
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {item.highlights.map((hl, hIdx) => (
                  <li key={hIdx} className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{hl}</span>
                  </li>
                ))}
              </ul>

              {/* Core Competencies Tags */}
              <div className="pt-2 space-y-1.5">
                <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Core Competencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.skillsUsed.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200 font-medium hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
