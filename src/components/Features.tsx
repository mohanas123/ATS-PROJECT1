import React from 'react';
import {
  Sparkles,
  Gauge,
  Tag,
  Wrench,
  FileCheck2,
  Lightbulb,
} from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      title: 'AI Resume Analysis',
      description: 'Analyze your resume against a specific job description.',
      icon: <Sparkles className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: 'ATS Compatibility Score',
      description: 'Get an estimated score from 0–100.',
      icon: <Gauge className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: 'Keyword Matching',
      description: 'Find matched and missing job-specific keywords.',
      icon: <Tag className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: 'Skills Analysis',
      description: 'Understand how your skills align with the role.',
      icon: <Wrench className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: 'Formatting Check',
      description: 'Identify common ATS compatibility problems.',
      icon: <FileCheck2 className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: 'Actionable Recommendations',
      description: 'Get practical suggestions to improve your resume.',
      icon: <Lightbulb className="w-5 h-5 text-indigo-600" />,
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-slate-50/50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full">
            Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 font-display">
            Built for Serious Job Seekers
          </h2>
          <p className="text-base text-slate-600 mt-2">
            Every tool and breakdown you need to land interviews at top companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/60 flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
