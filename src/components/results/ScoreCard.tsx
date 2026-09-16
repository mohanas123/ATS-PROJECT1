import React from 'react';
import { ScoreRating } from '../../types';
import {
  Sparkles,
  Download,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Printer,
} from 'lucide-react';

interface ScoreCardProps {
  score: number;
  interpretation: ScoreRating;
  isDemo: boolean;
  targetJobTitle: string;
  fileName: string;
  analyzedAt: string;
  onReset: () => void;
  onDownloadReport: () => void;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  interpretation,
  isDemo,
  targetJobTitle,
  fileName,
  analyzedAt,
  onReset,
  onDownloadReport,
}) => {
  // SVG circular calculation
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getRatingStyle = (rating: ScoreRating) => {
    switch (rating) {
      case 'Excellent':
        return {
          textColor: 'text-emerald-700',
          badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          strokeColor: '#059669',
          icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
          summaryText: 'Excellent match! Your resume shows high semantic relevance to the job requirements.',
        };
      case 'Good':
        return {
          textColor: 'text-indigo-700',
          badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          strokeColor: '#4f46e5',
          icon: <CheckCircle className="w-4 h-4 text-indigo-600" />,
          summaryText: 'Good compatibility. With a few keyword and formatting refinements, this resume can rank even higher.',
        };
      case 'Needs Improvement':
        return {
          textColor: 'text-amber-700',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          strokeColor: '#d97706',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
          summaryText: 'Needs improvement. Key skills and role terminology are currently missing or under-emphasized.',
        };
      case 'Poor':
      default:
        return {
          textColor: 'text-rose-700',
          badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
          strokeColor: '#e11d48',
          icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
          summaryText: 'Low match. Significant structural and keyword optimization is required to pass modern ATS filters.',
        };
    }
  };

  const style = getRatingStyle(interpretation);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Metadata & Demo Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100 mb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-900">{fileName}</span>
          <span>•</span>
          <span>Target: <strong className="text-indigo-700 font-medium">{targetJobTitle}</strong></span>
          <span>•</span>
          <span className="hidden sm:inline">Analyzed: {analyzedAt}</span>
        </div>

        <div className="flex items-center gap-2">
          {isDemo && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300/80 shadow-2xs inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-700" />
              Demo Analysis
            </span>
          )}

          <div className="flex items-center gap-2 no-print">
            <button
              type="button"
              onClick={onDownloadReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
              id="download-analysis-btn"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download Analysis</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all cursor-pointer shadow-2xs"
              id="analyze-another-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Analyze Another Resume</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Score Centerpiece */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Large Circular Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-100"
                strokeWidth="14"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Progress Circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={style.strokeColor}
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Centered Score text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none font-display">
                {score}
              </span>
              <span className="text-sm font-bold text-slate-400 mt-0.5">/ 100</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${style.badgeBg}`}>
              {style.icon}
              {interpretation}
            </span>
          </div>
        </div>

        {/* Score Details and Interpretation */}
        <div className="md:col-span-7 flex flex-col justify-center text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2 font-display">
            Your Estimated ATS Compatibility Score
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
            {style.summaryText}
          </p>

          {/* Scale Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            <div className={`p-2.5 rounded-xl border text-center transition-all ${interpretation === 'Excellent' ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-400' : 'bg-slate-50 border-slate-200 opacity-70'}`}>
              <div className="text-[11px] font-bold text-emerald-800 uppercase">90–100</div>
              <div className="text-xs font-medium text-emerald-700">Excellent</div>
            </div>
            <div className={`p-2.5 rounded-xl border text-center transition-all ${interpretation === 'Good' ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-400' : 'bg-slate-50 border-slate-200 opacity-70'}`}>
              <div className="text-[11px] font-bold text-indigo-800 uppercase">75–89</div>
              <div className="text-xs font-medium text-indigo-700">Good</div>
            </div>
            <div className={`p-2.5 rounded-xl border text-center transition-all ${interpretation === 'Needs Improvement' ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-400' : 'bg-slate-50 border-slate-200 opacity-70'}`}>
              <div className="text-[11px] font-bold text-amber-800 uppercase">60–74</div>
              <div className="text-xs font-medium text-amber-700">Needs Imp.</div>
            </div>
            <div className={`p-2.5 rounded-xl border text-center transition-all ${interpretation === 'Poor' ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-400' : 'bg-slate-50 border-slate-200 opacity-70'}`}>
              <div className="text-[11px] font-bold text-rose-800 uppercase">0–59</div>
              <div className="text-xs font-medium text-rose-700">Poor</div>
            </div>
          </div>

          {/* Disclaimer (Mandatory by Prompt #9) */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Important Disclaimer:</strong> This is an estimated compatibility score based on the provided resume and job description. Actual ATS systems may use different parsing and ranking methods.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
