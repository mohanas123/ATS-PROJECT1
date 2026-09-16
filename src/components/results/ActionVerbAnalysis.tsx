import React from 'react';
import { Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ActionVerbItem } from '../../types';

interface ActionVerbAnalysisProps {
  actionVerbAnalysis: {
    detectedWeakVerbs: ActionVerbItem[];
    generalAdvice: string;
  };
}

export const ActionVerbAnalysis: React.FC<ActionVerbAnalysisProps> = ({ actionVerbAnalysis }) => {
  const detectedWeakVerbs = actionVerbAnalysis?.detectedWeakVerbs || [];
  const generalAdvice = actionVerbAnalysis?.generalAdvice || 'Replace passive responsibility phrasing with active verbs.';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 font-display">
            <Zap className="w-5 h-5 text-indigo-600" />
            Action Verb Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify weak passive wording and replace them with high-impact executive verbs
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
        {generalAdvice}
      </p>

      <div className="space-y-3">
        {detectedWeakVerbs.map((item, idx) => (
          <div
            key={`verb-${idx}`}
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Replace Weak Phrase
              </span>
              <div className="text-sm font-semibold text-slate-800 line-through decoration-rose-400">
                "{item.weakPhrase}"
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <ArrowRight className="w-4 h-4 text-indigo-600 shrink-0 hidden sm:block" />
              <div className="flex flex-wrap gap-1.5">
                {item.suggestedVerbs.map((verb, vIdx) => (
                  <span
                    key={`v-${vIdx}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {verb}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-500">
        💡 <strong>Pro Tip:</strong> Begin every bullet point with a distinct, active past-tense verb to convey decisive execution and ownership.
      </div>
    </div>
  );
};
