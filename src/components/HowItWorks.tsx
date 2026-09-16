import React from 'react';
import { UploadCloud, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload Resume',
      description: 'Upload your PDF or DOCX resume.',
      icon: <UploadCloud className="w-6 h-6 text-indigo-600" />,
      tag: 'Step 1',
    },
    {
      step: '02',
      title: 'Add Job Description',
      description: 'Paste the job description for the role you want.',
      icon: <FileText className="w-6 h-6 text-indigo-600" />,
      tag: 'Step 2',
    },
    {
      step: '03',
      title: 'Get Your Analysis',
      description: 'Receive your estimated ATS compatibility score and personalized recommendations.',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      tag: 'Step 3',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 font-display">
            How It Works
          </h2>
          <p className="text-base text-slate-600 mt-2">
            Audit your resume in seconds against enterprise applicant tracking guidelines before applying.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className="relative p-7 rounded-2xl border border-slate-200/90 bg-slate-50/40 hover:bg-slate-50 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-3xl font-black text-slate-200 font-display">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
