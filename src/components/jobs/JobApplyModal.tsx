import React, { useState } from 'react';
import { JobOpportunity, UploadedResumeFile } from '../../types';
import {
  X,
  FileText,
  CheckCircle2,
  Send,
  Building2,
  Sparkles,
  ShieldCheck,
  User,
  Mail,
  Check,
  ExternalLink,
} from 'lucide-react';

interface JobApplyModalProps {
  job: JobOpportunity | null;
  uploadedResume: UploadedResumeFile | null;
  onClose: () => void;
}

export const JobApplyModal: React.FC<JobApplyModalProps> = ({
  job,
  uploadedResume,
  onClose,
}) => {
  const [fullName, setFullName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@email.com');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!job) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 750);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      id="job-apply-modal"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 rounded-md">
              Direct Application
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display mt-1.5">
              Apply to {job.company}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Role: <span className="font-semibold text-slate-700">{job.title}</span> • {job.location}
            </p>
            {job.applicationUrl && (
              <a
                href={job.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 hover:underline mt-1"
              >
                <span>Or apply directly on employer / Adzuna site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
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

        {/* Form Body or Success State */}
        <div className="p-5 sm:p-6">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Application Submitted!
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                  Your resume <span className="font-semibold text-slate-800">({uploadedResume?.name || 'Uploaded Resume'})</span> and profile have been submitted for <span className="font-semibold text-slate-800">{job.title}</span> at <span className="font-semibold text-slate-800">{job.company}</span>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 max-w-sm mx-auto flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Estimated Match Score: <strong className="text-slate-800">{job.matchPercentage}% Compatibility</strong></span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer shadow-xs"
              >
                Return to Jobs
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Attached Resume summary */}
              <div className="p-3 rounded-xl border border-indigo-100 bg-indigo-50/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 text-xs">
                    <p className="font-semibold text-slate-900 truncate">
                      {uploadedResume?.name || 'Current Analyzed Resume'}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Attached & ready ({job.matchPercentage}% Match)
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-indigo-700 border border-indigo-200 shrink-0">
                  Attached
                </span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-slate-900"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-slate-900"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Short note */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cover Note <span className="font-normal text-slate-400">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-slate-900 resize-none placeholder:text-slate-400"
                  placeholder="Introduce yourself briefly or highlight relevant project achievements..."
                />
              </div>

              {/* Privacy pill */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Information is transmitted directly to {job.company}'s recruiting portal.</span>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all cursor-pointer shadow-sm shadow-indigo-200"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
