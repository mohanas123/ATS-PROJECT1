import React from 'react';
import {
  Heading1,
  Key,
  Layout,
  TrendingUp,
  Briefcase,
  Calendar,
  ImageOff,
  Target,
  BookOpen,
} from 'lucide-react';

export const ATSTips: React.FC = () => {
  const tips = [
    {
      num: 'Tip 1',
      title: 'Use standard resume section headings.',
      description: 'Stick to conventional labels like "Professional Summary", "Work Experience", "Education", and "Skills" so parsers categorize your sections correctly.',
      icon: <Heading1 className="w-5 h-5 text-indigo-600" />,
    },
    {
      num: 'Tip 2',
      title: 'Include relevant keywords from the job description.',
      description: 'Mirror the vocabulary and technical terminology used by the hiring team to pass automatic keyword filtering thresholds.',
      icon: <Key className="w-5 h-5 text-indigo-600" />,
    },
    {
      num: 'Tip 3',
      title: 'Avoid unnecessarily complex layouts.',
      description: 'Multi-column tables, text boxes, and decorative graphics often scramble parsing sequence into disorganized character streams.',
      icon: <Layout className="w-5 h-5 text-indigo-600" />,
    },
    {
      num: 'Tip 4',
      title: 'Use measurable achievements.',
      description: 'Whenever possible, quantify accomplishments with percentages, revenue figures, cost savings, or hours recovered.',
      icon: <TrendingUp className="w-5 h-5 text-indigo-600" />,
    },
    {
      num: 'Tip 5',
      title: 'Keep job titles clear and standard.',
      description: 'Avoid ambiguous internal nicknames like "Growth Ninja" or "Code Wizard". Use industry-standard professional titles.',
      icon: <Briefcase className="w-5 h-5 text-indigo-600" />,
    },
    {
      num: 'Tip 6',
      title: 'Use consistent dates and formatting.',
      description: 'Standardize your dates (e.g. "MM/YYYY" or "Month YYYY") and maintain identical typography throughout the document.',
      icon: <Calendar className="w-5 h-5 text-indigo-600" />,
    },
    {
      num: 'Tip 7',
      title: 'Avoid putting important information inside images.',
      description: 'ATS parsers process raw text streams. Skills or contact details baked inside raster image logos or charts are completely invisible.',
      icon: <ImageOff className="w-5 h-5 text-indigo-600" />,
    },
    {
      num: 'Tip 8',
      title: 'Tailor your resume for each target job.',
      description: 'One generic resume rarely achieves top percentiles. Fine-tune your experience bullets and skills list for every target position.',
      icon: <Target className="w-5 h-5 text-indigo-600" />,
    },
  ];

  return (
    <section id="ats-tips" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full">
            Educational Knowledge Base
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 font-display">
            ATS Optimization Tips
          </h2>
          <p className="text-base text-slate-600 mt-2">
            Proven best practices to ensure your resume sails through automated screeners to hiring managers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {tips.map((tip) => (
            <div
              key={tip.num}
              className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                    {tip.icon}
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded-full">
                    {tip.num}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                  {tip.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {tip.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
