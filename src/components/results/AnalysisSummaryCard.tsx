import React from 'react';
import { AnalysisSummary } from '../../types';
import { ClipboardCheck, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface AnalysisSummaryCardProps {
  summary: AnalysisSummary;
}

export const AnalysisSummaryCard: React.FC<AnalysisSummaryCardProps> = ({ summary }) => {
  const overview = summary?.overview || 'Analysis completed successfully.';
  const whatItDoesWell = summary?.whatItDoesWell || 'Highlights relevant domain experience and core qualifications.';
  const whatIsPreventingHigherScore = summary?.whatIsPreventingHigherScore || 'Additional target keyword alignment and measurable metrics will elevate your score.';
  const mostImportantChangesFirst = summary?.mostImportantChangesFirst || 'Incorporate missing high-priority keywords into your skills and work history sections.';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
      <div className="flex items-center gap-2 mb-4 pb-3 border-slate-100 border-b">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <ClipboardCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">
            Overall Analysis
          </h3>
          <p className="text-xs text-slate-500">Executive summary of your ATS evaluation</p>
        </div>
      </div>

      <p className="text-sm text-slate-700 font-medium leading-relaxed mb-6">
        {overview}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* What the resume does well */}
        <div className="p-4 rounded-xl bg-emerald-50/30 border border-emerald-100">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>What the resume does well</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            {whatItDoesWell}
          </p>
        </div>

        {/* What is preventing a higher score */}
        <div className="p-4 rounded-xl bg-amber-50/30 border border-amber-100">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>What is preventing a higher score</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            {whatIsPreventingHigherScore}
          </p>
        </div>

        {/* The most important changes to make first */}
        <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-100">
          <div className="flex items-center gap-1.5 font-bold text-indigo-950 mb-2">
            <ArrowRight className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Most important changes first</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            {mostImportantChangesFirst}
          </p>
        </div>
      </div>
    </div>
  );
};
