import React from 'react';
import { GraduationCap, CheckCircle2, Calendar, Award } from 'lucide-react';
import { experienceData, certificationsData } from '../../data/experience';

export const ExperienceEducation: React.FC = () => {
  return (
    <section id="experience" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-16">
      {/* Experience & Education Section */}
      <div>
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono text-blue-700 shadow-sm font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>ACADEMIC & PROFESSIONAL TIMELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
            Education, Internships & Mentorship
          </h2>
          <p className="text-sm font-mono text-slate-600">
            B.Tech in Computer Science Engineering at Sam Global University (CGPA: 7.85/10), professional industry internships, and student mentorship.
          </p>
        </div>

        <div className="relative border-l border-slate-300 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10">
          {experienceData.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline bullet icon */}
              <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center shadow-md">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
              </div>

              {/* Experience Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md hover:border-indigo-300 hover:shadow-lg transition-all duration-300 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider font-bold shadow-2xs ${
                        item.type === 'academic'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : item.type === 'internship'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.type === 'mentorship'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
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
                    <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 mt-1">
                      {item.role}
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-indigo-600 font-semibold">
                      {item.organization}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.period}</span>
                  </div>
                </div>

                {/* Highlights */}
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  {item.highlights.map((hl, hIdx) => (
                    <li key={hIdx} className="flex items-start space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{hl}</span>
                    </li>
                  ))}
                </ul>

                {/* Skills Tags */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {item.skillsUsed.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200 font-medium"
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
      <div className="pt-8 border-t border-slate-200">
        <div className="space-y-3 text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-700 shadow-sm font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>INDUSTRY CERTIFICATIONS</span>
          </div>
          <h3 className="text-2xl font-display font-extrabold text-slate-900">
            Verified Professional Specializations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certificationsData.map((cert, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-lg space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
                  <Award className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold shadow-2xs">
                  {cert.status}
                </span>
              </div>

              <h4 className="text-base font-display font-bold text-slate-900">
                {cert.title}
              </h4>
              <p className="text-xs font-mono text-indigo-600 font-bold">
                {cert.issuer}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {cert.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
