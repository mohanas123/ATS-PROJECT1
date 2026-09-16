import React from 'react';
import { Sparkles, FileSearch, ArrowUp } from 'lucide-react';

export const EmptyResultsState: React.FC = () => {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200/90 bg-white/60 p-10 sm:p-16 text-center max-w-2xl mx-auto my-6 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
        <FileSearch className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2">
        Your analysis will appear here
      </h3>

      <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
        Upload your resume and add a job description to get started. We'll generate an estimated ATS compatibility score, identify missing keywords, and provide actionable recommendations.
      </p>

      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
        <ArrowUp className="w-3.5 h-3.5 text-indigo-600" />
        <span>Fill out steps 1 and 2 above to begin analysis</span>
      </div>
    </div>
  );
};
