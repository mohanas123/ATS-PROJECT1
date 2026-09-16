import React from 'react';
import { ThumbsUp, AlertTriangle, CheckCircle, ArrowUpRight } from 'lucide-react';

interface StrengthsAndImprovementsProps {
  strengths: string[];
  improvements: string[];
}

export const StrengthsAndImprovements: React.FC<StrengthsAndImprovementsProps> = ({
  strengths,
  improvements,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Strengths Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight font-display">
                Resume Strengths
              </h3>
              <p className="text-[11px] text-slate-400">Core competitive advantages identified</p>
            </div>
          </div>

          <div className="space-y-3">
            {(strengths || []).map((item, idx) => (
              <div
                key={`str-${idx}`}
                className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/30 border border-emerald-100 text-xs text-slate-800"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Areas to Improve Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight font-display">
                Areas to Improve
              </h3>
              <p className="text-[11px] text-slate-400">Targeted adjustments to unlock higher score tiers</p>
            </div>
          </div>

          <div className="space-y-3">
            {(improvements || []).map((item, idx) => (
              <div
                key={`imp-${idx}`}
                className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/30 border border-amber-100 text-xs text-slate-800"
              >
                <ArrowUpRight className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
