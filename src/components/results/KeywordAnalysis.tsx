import React, { useState } from 'react';
import { KeywordItem } from '../../types';
import { Check, X, Star, Tag, Sparkles } from 'lucide-react';

interface KeywordAnalysisProps {
  matchedKeywords: KeywordItem[];
  missingKeywords: KeywordItem[];
  importantKeywords: KeywordItem[];
}

export const KeywordAnalysis: React.FC<KeywordAnalysisProps> = ({
  matchedKeywords = [],
  missingKeywords = [],
  importantKeywords = [],
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'matched' | 'missing' | 'important'>('all');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 font-display">
            <Tag className="w-5 h-5 text-indigo-600" />
            Keyword Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Applicant Tracking Systems match resume text directly against job description terms
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            All ({matchedKeywords.length + missingKeywords.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('matched')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'matched' ? 'bg-white text-emerald-700 shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            Matched ({matchedKeywords.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('missing')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'missing' ? 'bg-white text-rose-700 shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            Missing ({missingKeywords.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('important')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'important' ? 'bg-white text-amber-700 shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            Important ({importantKeywords.length})
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Matched Keywords Section */}
        {(activeTab === 'all' || activeTab === 'matched') && (
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                Matched Keywords ({matchedKeywords.length})
              </h4>
              <span className="text-[11px] text-emerald-700 font-medium">
                Found in both your resume and the job description
              </span>
            </div>

            {matchedKeywords.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No exact matched keywords detected.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((item, idx) => (
                  <span
                    key={`matched-${idx}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white border border-emerald-200 text-emerald-900 shadow-2xs"
                  >
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{item.keyword}</span>
                    {item.frequencyInResume && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full">
                        {item.frequencyInResume}x in resume
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Missing Keywords Section */}
        {(activeTab === 'all' || activeTab === 'missing') && (
          <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <X className="w-4 h-4 text-rose-600 stroke-[2.5]" />
                Missing Keywords ({missingKeywords.length})
              </h4>
              <span className="text-[11px] text-rose-700 font-medium">
                Important terms in the job description not clearly found in your resume
              </span>
            </div>

            {missingKeywords.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No critical missing keywords identified.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((item, idx) => (
                  <span
                    key={`missing-${idx}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white border border-rose-200 text-rose-900 shadow-2xs"
                  >
                    <X className="w-3 h-3 text-rose-500 shrink-0" />
                    <span>{item.keyword}</span>
                    {item.importance === 'high' && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded-full">
                        High Priority
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* High Priority Keywords Section */}
        {(activeTab === 'all' || activeTab === 'important') && (
          <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
                Important Keywords ({importantKeywords.length})
              </h4>
              <span className="text-[11px] text-amber-800 font-medium">
                Top core competencies highlighted multiple times by the employer
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {importantKeywords.map((item, idx) => (
                <span
                  key={`important-${idx}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-amber-200 text-amber-900 shadow-2xs"
                >
                  <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>{item.keyword}</span>
                  {item.frequencyInJob && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-full">
                      {item.frequencyInJob}x in job post
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
