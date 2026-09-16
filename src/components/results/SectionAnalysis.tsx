import React from 'react';
import { SectionAnalysisItem, SectionStatus } from '../../types';
import {
  LayoutList,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface SectionAnalysisProps {
  sectionAnalysis: SectionAnalysisItem[];
}

export const SectionAnalysis: React.FC<SectionAnalysisProps> = ({ sectionAnalysis = [] }) => {
  const getStatusBadge = (status: SectionStatus) => {
    switch (status) {
      case 'Excellent':
        return {
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
        };
      case 'Good':
        return {
          badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />,
        };
      case 'Needs Improvement':
        return {
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
        };
      case 'Missing':
      default:
        return {
          badge: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />,
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 font-display">
            <LayoutList className="w-5 h-5 text-indigo-600" />
            Resume Section Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluation of standard ATS resume sections, completeness, and content quality
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sectionAnalysis.map((sec, idx) => {
          const statusStyle = getStatusBadge(sec.status);

          return (
            <div
              key={`section-${idx}`}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/30 hover:bg-slate-50/70 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    {sec.name}
                  </h4>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle.badge}`}
                  >
                    {statusStyle.icon}
                    {sec.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {sec.explanation}
                </p>
              </div>

              {/* Suggestion block */}
              <div className="pt-2.5 border-t border-slate-200/60 flex items-start gap-2 text-xs text-indigo-900 bg-indigo-50/40 p-2.5 rounded-lg">
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-indigo-950">Recommendation: </span>
                  <span className="text-slate-700">{sec.suggestion}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
