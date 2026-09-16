import React from 'react';
import { TrendingUp, CheckCircle, Lightbulb, Hash } from 'lucide-react';

interface AchievementAnalysisProps {
  achievementAnalysis: {
    score: number;
    detectedMetrics: string[];
    hasQuantifiableResults: boolean;
    suggestion: string;
    examples: string[];
  };
}

export const AchievementAnalysis: React.FC<AchievementAnalysisProps> = ({ achievementAnalysis }) => {
  const score = achievementAnalysis?.score ?? 50;
  const detectedMetrics = achievementAnalysis?.detectedMetrics || [];
  const suggestion = achievementAnalysis?.suggestion || 'Consider adding measurable metrics to your experience bullets.';
  const examples = achievementAnalysis?.examples || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 font-display">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Achievements & Measurable Impact
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Recruiters and hiring managers prioritize resumes showing quantified business results
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-500">Impact Score:</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {score}/100
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Detected metrics */}
        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200/60">
            <Hash className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Detected Metrics in Resume ({detectedMetrics.length})
            </h4>
          </div>

          {detectedMetrics.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-2">
              No clear numbers, percentages, or revenue metrics were found in your experience bullets.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {detectedMetrics.map((metric, idx) => (
                <span
                  key={`metric-${idx}`}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-white border border-slate-200 text-slate-800 shadow-2xs"
                >
                  {metric}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actionable Guideline */}
        <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-indigo-100">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Measurable Impact Guideline
              </h4>
            </div>
            <p className="text-xs text-indigo-950 font-medium mb-2">
              {suggestion}
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Include numbers, percentages, revenue, growth, cost savings, time saved, performance improvements, customer growth, and project outcomes.
            </p>
          </div>
        </div>
      </div>

      {/* Examples of Strong Quantified Bullets */}
      <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/30">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Examples of High-Impact Measurable Bullets:
        </h5>
        <div className="space-y-1.5">
          {examples.map((ex, idx) => (
            <div key={`ex-${idx}`} className="flex items-start gap-2 text-xs text-slate-700">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{ex}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
