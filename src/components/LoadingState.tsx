import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

const LOADING_STAGES = [
  'Reading resume...',
  'Identifying skills...',
  'Matching keywords...',
  'Evaluating ATS compatibility...',
  'Preparing recommendations...',
];

export const LoadingState: React.FC = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < LOADING_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 750);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-8 sm:p-12 text-center max-w-xl mx-auto my-8">
      <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-indigo-100/60 animate-ping opacity-50" />
        <div className="relative w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        Analyzing Your Resume
      </h3>
      <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
        Evaluating semantic keyword density, structural parsing compliance, and ATS scoring parameters.
      </p>

      {/* Cycling Stage Message */}
      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 font-semibold text-sm mb-6">
        <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
        <span>{LOADING_STAGES[currentStageIndex]}</span>
      </div>

      {/* Step checklist */}
      <div className="space-y-2 text-left max-w-xs mx-auto text-xs">
        {LOADING_STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          return (
            <div
              key={stage}
              className={`flex items-center gap-2.5 transition-colors ${
                isDone
                  ? 'text-emerald-600 font-medium'
                  : isCurrent
                  ? 'text-indigo-600 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    isCurrent ? 'border-indigo-600 border-2' : 'border-slate-300'
                  }`}
                >
                  {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                </div>
              )}
              <span>{stage}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
