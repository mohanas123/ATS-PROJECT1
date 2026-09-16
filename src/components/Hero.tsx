import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, FileText, Info } from 'lucide-react';

interface HeroProps {
  onAnalyzeClick: () => void;
  onHowItWorksClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onAnalyzeClick, onHowItWorksClick }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-slate-200/70 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/40">
      {/* Background ambient accents */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-50/60 to-transparent pointer-events-none" />
      <div className="absolute -top-24 right-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-48 -left-20 w-80 h-80 bg-violet-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Optimize your resume. Improve your opportunities.</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6">
              Know Your Resume's{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600">
                ATS Compatibility
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mb-8 font-normal">
              See how well your resume matches a specific job description and discover exactly what you can improve before applying.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <button
                onClick={onAnalyzeClick}
                id="hero-analyze-cta"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-200 hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 cursor-pointer group"
              >
                <span>Analyze My Resume</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onHowItWorksClick}
                id="hero-how-it-works-cta"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer"
              >
                <span>How It Works</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:flex items-center gap-6 sm:gap-8 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Private & Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Industry Standard Weights</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>PDF & DOCX Support</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Dashboard Preview Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/60 p-6 sm:p-7 relative transition-all hover:shadow-2xl">
              {/* Disclaimer Pill */}
              <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200/70 text-amber-800 text-[11px] font-medium">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Visual preview example • Not a live analysis</span>
              </div>

              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Estimated ATS Compatibility Score
                  </h3>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    Target: Senior Frontend Developer
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Good Fit
                </span>
              </div>

              {/* Main Score Radial / Number */}
              <div className="my-6 flex items-center justify-center gap-6">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-slate-100"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-indigo-600"
                      strokeWidth="10"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 * (1 - 0.82)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-slate-900 leading-none">82</span>
                    <span className="text-[11px] font-semibold text-slate-400">/ 100</span>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Strong Candidate
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Resume demonstrates high semantic keyword match with solid architectural bullet points.
                  </p>
                </div>
              </div>

              {/* Mini Category Bars */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-600">Keyword Match</span>
                    <span className="font-bold text-slate-900">78%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full w-[78%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-600">Skills Match</span>
                    <span className="font-bold text-slate-900">86%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full w-[86%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-600">Formatting</span>
                    <span className="font-bold text-slate-900">92%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[92%]" />
                  </div>
                </div>
              </div>

              {/* Bottom Quick Highlights */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 16 Matched Keywords
                </span>
                <span className="text-indigo-600 font-medium">
                  6 Actionable AI Tips →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
