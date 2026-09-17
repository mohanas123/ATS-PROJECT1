import React from 'react';
import { JobOpportunity } from '../../types';
import {
  X,
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface JobDetailsModalProps {
  job: JobOpportunity | null;
  onClose: () => void;
  onApply: (job: JobOpportunity) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose, onApply }) => {
  if (!job) return null;

  const matchedSkillsSet = new Set((job.matchedSkills || []).map((s) => s.toLowerCase()));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      id="job-details-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-job-title"
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
              {job.companyLogoText || job.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {job.company}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">{job.department || 'Engineering'}</span>
              </div>
              <h2
                id="modal-job-title"
                className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display"
              >
                {job.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Location
              </span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-500" />
                {job.location}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Job Type
              </span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <Briefcase className="w-3 h-3 text-slate-500" />
                {job.jobType}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Salary
              </span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <DollarSign className="w-3 h-3 text-slate-500" />
                {job.salaryRange || 'Competitive'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                ATS Match
              </span>
              <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                {job.matchPercentage}% Compatibility
              </span>
            </div>
          </div>

          {/* Role Overview */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-display">
              Role Overview
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">{job.description}</p>
          </div>

          {/* Required Skills & Resume Match */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-display flex items-center justify-between">
              <span>Required Skills Breakdown</span>
              <span className="text-xs font-medium text-emerald-700 normal-case flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {(job.matchedSkills || []).length} of {job.requiredSkills.length} matched from resume
              </span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill, idx) => {
                const isMatched = matchedSkillsSet.has(skill.toLowerCase());
                return (
                  <span
                    key={`modal-skill-${idx}`}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      isMatched
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isMatched ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    )}
                    <span>{skill}</span>
                    {isMatched && (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/60 px-1 rounded">
                        Matched
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-display">
                Key Responsibilities
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {job.responsibilities.map((resp, i) => (
                  <li key={`resp-${i}`} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
                    <span className="leading-relaxed">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Qualifications */}
          {job.qualifications && job.qualifications.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-display">
                Qualifications & Requirements
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {job.qualifications.map((qual, i) => (
                  <li key={`qual-${i}`} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{qual}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="p-4 rounded-xl bg-indigo-50/30 border border-indigo-100">
              <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-display">
                <Award className="w-4 h-4 text-indigo-600" />
                Perks & Benefits
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {job.benefits.map((benefit, i) => (
                  <div key={`benefit-${i}`} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {job.applicationUrl && (
              <a
                href={job.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all cursor-pointer"
              >
                <span>Official Adzuna Listing</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onApply(job);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm shadow-indigo-200 hover:shadow-md transition-all cursor-pointer"
            >
              <span>Quick Apply</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
