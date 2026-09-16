import React from 'react';
import { RecommendationItem } from '../../types';
import {
  Sparkles,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface RecommendationsProps {
  recommendations: RecommendationItem[];
}

export const Recommendations: React.FC<RecommendationsProps> = ({ recommendations = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 font-display">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            AI Recommendations
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step prioritized improvements to elevate your ATS resume ranking
          </p>
        </div>

        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full self-start sm:self-auto">
          {recommendations.length} Actionable Steps
        </span>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, idx) => (
          <div
            key={`rec-${idx}`}
            className="p-5 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                {rec.title}
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
              {/* What is missing or weak */}
              <div className="p-3 rounded-lg bg-white border border-slate-200/80">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>1. What is missing or weak</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {rec.whatIsMissingOrWeak}
                </p>
              </div>

              {/* Why it matters */}
              <div className="p-3 rounded-lg bg-white border border-slate-200/80">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                  <span>2. Why it matters</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {rec.whyItMatters}
                </p>
              </div>

              {/* What the user can improve */}
              <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                  <span>3. What you can improve</span>
                </div>
                <p className="text-indigo-950 font-medium leading-relaxed">
                  {rec.whatUserCanImprove}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 flex items-start gap-2.5 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>Integrity Reminder:</strong> Never falsely add experience, skills, certifications, or metrics you have not actually performed. Always align recommendations with your genuine background.
        </div>
      </div>
    </div>
  );
};
