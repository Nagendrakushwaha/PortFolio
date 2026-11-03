import React from 'react';
import { GraduationCap, Award, Calendar, BookOpen } from 'lucide-react';
import { experienceData } from '../../data/experience';

export const EducationSection: React.FC = () => {
  const academicItems = experienceData.filter((item) => item.type === 'academic');

  return (
    <section id="education" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      <div className="space-y-4 text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono text-blue-700 shadow-sm font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>ACADEMIC FOUNDATION &amp; DEGREES</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
          Education &amp; Scientific Degrees
        </h2>
        <p className="text-sm font-mono text-slate-600">
          Formal academic training in Computer Science and Engineering with specialization in Machine Learning and Algorithms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {academicItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md hover:border-indigo-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
                  <BookOpen className="w-5 h-5" />
                </span>
                <span className="flex items-center space-x-1.5 text-xs font-mono text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.period}</span>
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900">
                  {item.role}
                </h3>
                <p className="text-xs sm:text-sm font-mono text-indigo-600 font-semibold mt-1">
                  {item.organization}
                </p>
              </div>

              {/* Highlights */}
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.highlights.map((hl, hIdx) => (
                  <li key={hIdx} className="flex items-start space-x-2.5">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills / Coursework */}
            <div className="pt-4 border-t border-slate-200">
              <span className="block text-[11px] font-mono text-slate-400 uppercase font-semibold mb-2">
                Core Coursework &amp; Competencies
              </span>
              <div className="flex flex-wrap gap-1.5">
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
    </section>
  );
};
