import React from 'react';
import { Briefcase, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/sampleData';

interface JobDetailsFormProps {
  jobTitle: string;
  jobDescription: string;
  onJobTitleChange: (title: string) => void;
  onJobDescriptionChange: (desc: string) => void;
  onLoadPresetJD: (presetId: string) => void;
  titleError?: string | null;
  descError?: string | null;
}

export const JobDetailsForm: React.FC<JobDetailsFormProps> = ({
  jobTitle,
  jobDescription,
  onJobTitleChange,
  onJobDescriptionChange,
  onLoadPresetJD,
  titleError,
  descError,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
              2
            </span>
            Add Job Details
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Specify the position and requirements you are targeting
          </p>
        </div>
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
        {/* Job Title Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="target-job-title-input"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              Target Job Title <span className="text-rose-500">*</span>
            </label>
          </div>
          <input
            id="target-job-title-input"
            type="text"
            value={jobTitle}
            onChange={(e) => onJobTitleChange(e.target.value)}
            placeholder="e.g. Frontend Developer"
            className={`w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50/50 border transition-all text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 ${
              titleError
                ? 'border-rose-300 focus:ring-rose-400'
                : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
            }`}
          />
          {titleError && (
            <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {titleError}
            </p>
          )}
        </div>

        {/* Job Description Textarea */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="job-description-textarea"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              Job Description <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {jobDescription.length} characters
            </span>
          </div>

          <textarea
            id="job-description-textarea"
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            placeholder="Paste the complete job description here..."
            rows={8}
            className={`w-full flex-1 p-3.5 rounded-xl text-sm bg-slate-50/50 border transition-all text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 resize-none leading-relaxed ${
              descError
                ? 'border-rose-300 focus:ring-rose-400'
                : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
            }`}
          />
          {descError && (
            <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {descError}
            </p>
          )}
        </div>

        {/* Preset helper */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
          <span className="text-[11px] text-slate-400">Sample descriptions:</span>
          <div className="flex items-center gap-2">
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onLoadPresetJD(preset.id)}
                className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>{preset.jobTitle}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
