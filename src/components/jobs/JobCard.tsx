import React from 'react';
import { JobOpportunity } from '../../types';
import {
  MapPin,
  Briefcase,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Building2,
  Clock,
  DollarSign,
  ChevronRight,
} from 'lucide-react';

interface JobCardProps {
  job: JobOpportunity;
  positionNumber?: number;
  onViewJob: (job: JobOpportunity) => void;
  onApply: (job: JobOpportunity) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, positionNumber, onViewJob, onApply }) => {
  const getMatchBadgeColor = (percentage: number) => {
    if (percentage >= 90) {
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200/80',
        dot: 'bg-emerald-500',
        bar: 'bg-emerald-600',
      };
    }
    if (percentage >= 80) {
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200/80',
        dot: 'bg-indigo-500',
        bar: 'bg-indigo-600',
      };
    }
    return {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200/80',
      dot: 'bg-amber-500',
      bar: 'bg-amber-500',
    };
  };

  const colors = getMatchBadgeColor(job.matchPercentage);
  const matchedSkillsSet = new Set((job.matchedSkills || []).map((s) => s.toLowerCase()));

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:border-indigo-200"
      id={`job-card-${job.id}`}
    >
      <div>
        {/* Top bar: Company & Matching Percentage */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200/70 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors">
              {job.companyLogoText || job.company.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                {positionNumber !== undefined && (
                  <span
                    className="text-[10px] font-bold text-indigo-700 bg-indigo-50/90 px-1.5 py-0.5 rounded border border-indigo-100 shrink-0"
                    title={`Job position #${positionNumber}`}
                  >
                    #{positionNumber}
                  </span>
                )}
                <h4 className="text-xs font-semibold text-slate-500 truncate flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{job.company}</span>
                </h4>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate font-display mt-0.5">
                {job.title}
              </h3>
            </div>
          </div>

          {/* Matching Percentage Badge */}
          <div
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text} border ${colors.border} shadow-2xs`}
            title={`${job.matchPercentage}% Compatibility match based on your resume`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{job.matchPercentage}% Match</span>
          </div>
        </div>

        {/* Location, Job Type & Metadata */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 mb-4 pt-1">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700">{job.jobType}</span>
          </div>
          {job.salaryRange && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{job.salaryRange}</span>
            </div>
          )}
          {job.postedDate && (
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 shrink-0" />
              <span>{job.postedDate}</span>
            </div>
          )}
        </div>

        {/* Compatibility progress indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
            <span>Skill & Profile Match</span>
            <span className="font-semibold text-slate-700">{job.matchPercentage}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.bar} rounded-full transition-all duration-500`}
              style={{ width: `${job.matchPercentage}%` }}
            />
          </div>
        </div>

        {/* Short description preview */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Required Skills list */}
        <div className="mb-5">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Required Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {job.requiredSkills.map((skill, idx) => {
              const isMatched = matchedSkillsSet.has(skill.toLowerCase());
              return (
                <span
                  key={`${job.id}-skill-${idx}`}
                  className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.8 rounded-md transition-all ${
                    isMatched
                      ? 'bg-emerald-50/90 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100/80 text-slate-700 border border-slate-200/60'
                  }`}
                >
                  {isMatched && <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />}
                  <span>{skill}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons: View Job & Apply Now */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onViewJob(job)}
          id={`view-job-btn-${job.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
        >
          <span>View Job</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {job.applicationUrl || job.redirectUrl ? (
          <a
            href={job.applicationUrl || job.redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            id={`apply-job-btn-${job.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm shadow-indigo-200 hover:shadow-md transition-all cursor-pointer text-center"
          >
            <span>Apply Now</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <button
            type="button"
            onClick={() => onApply(job)}
            id={`apply-job-btn-${job.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm shadow-indigo-200 hover:shadow-md transition-all cursor-pointer"
          >
            <span>Apply Now</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
