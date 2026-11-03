import React from 'react';
import { Award } from 'lucide-react';
import { certificationsData } from '../../data/experience';

export const CertificationsSection: React.FC = () => {
  return (
    <section id="certifications" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      <div className="space-y-3 text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-700 shadow-sm font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>INDUSTRY CERTIFICATIONS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
          Verified Professional Specializations
        </h2>
        <p className="text-sm font-mono text-slate-600">
          Recognized specializations in machine learning, database engineering, and applied scientific computing.
        </p>
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
    </section>
  );
};
