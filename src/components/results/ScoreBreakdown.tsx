import React from 'react';
import { CategoryScores, CategoryScoreItem } from '../../types';
import {
  Tag,
  Wrench,
  Briefcase,
  Clock,
  LayoutTemplate,
  FileCheck2,
  TrendingUp,
  Target,
} from 'lucide-react';

interface ScoreBreakdownProps {
  categoryScores: CategoryScores;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ categoryScores }) => {
  const getScoreColor = (val: number) => {
    if (val >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (val >= 70) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    if (val >= 55) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getBarColor = (val: number) => {
    if (val >= 85) return 'bg-emerald-500';
    if (val >= 70) return 'bg-indigo-600';
    if (val >= 55) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const items: Array<{ key: keyof CategoryScores; icon: React.ReactNode }> = [
    { key: 'keywordMatch', icon: <Tag className="w-4 h-4 text-indigo-600" /> },
    { key: 'skillsMatch', icon: <Wrench className="w-4 h-4 text-indigo-600" /> },
    { key: 'jobTitleAlignment', icon: <Briefcase className="w-4 h-4 text-indigo-600" /> },
    { key: 'experienceRelevance', icon: <Clock className="w-4 h-4 text-indigo-600" /> },
    { key: 'resumeStructure', icon: <LayoutTemplate className="w-4 h-4 text-indigo-600" /> },
    { key: 'formattingCompatibility', icon: <FileCheck2 className="w-4 h-4 text-indigo-600" /> },
    { key: 'achievementsImpact', icon: <TrendingUp className="w-4 h-4 text-indigo-600" /> },
    { key: 'overallAlignment', icon: <Target className="w-4 h-4 text-indigo-600" /> },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 font-display">
            Score Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent breakdown across 8 key ATS evaluation parameters totaling 100%
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full self-start sm:self-auto">
          Weighted Scoring Model
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ key, icon }) => {
          const item: CategoryScoreItem = categoryScores[key];
          if (!item) return null;

          return (
            <div
              key={key}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      {icon}
                    </div>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {item.weight}% WT
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-2 mb-1.5">
                  <span className={`text-base font-extrabold px-2 py-0.5 rounded-md border text-center ${getScoreColor(item.score)}`}>
                    {item.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden my-2">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(item.score)}`}
                    style={{ width: `${Math.min(100, Math.max(5, item.score))}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed mt-2 pt-2 border-t border-slate-200/60">
                {item.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
