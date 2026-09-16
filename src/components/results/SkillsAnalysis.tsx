import React from 'react';
import { Wrench, CheckCircle2, AlertCircle, Lightbulb, ShieldAlert } from 'lucide-react';

interface SkillsAnalysisProps {
  skillsAnalysis: {
    matchedSkills: string[];
    missingSkills: string[];
    recommendedSkills: string[];
    disclaimer: string;
  };
}

export const SkillsAnalysis: React.FC<SkillsAnalysisProps> = ({ skillsAnalysis }) => {
  const matchedSkills = skillsAnalysis?.matchedSkills || [];
  const missingSkills = skillsAnalysis?.missingSkills || [];
  const recommendedSkills = skillsAnalysis?.recommendedSkills || [];
  const disclaimer = skillsAnalysis?.disclaimer || 'Ensure all listed skills accurately reflect your authentic capabilities.';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 font-display">
            <Wrench className="w-5 h-5 text-indigo-600" />
            Skills Match
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Technical and functional domain proficiencies required for the position
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Matched Skills */}
        <div className="p-5 rounded-xl border border-emerald-100 bg-emerald-50/20 flex flex-col">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Matched Skills ({matchedSkills.length})
            </h4>
          </div>

          <div className="flex-1">
            {matchedSkills.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No exact skill matches identified.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {matchedSkills.map((skill, idx) => (
                  <span
                    key={`skill-matched-${idx}`}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-emerald-200 text-emerald-800 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="p-5 rounded-xl border border-rose-100 bg-rose-50/20 flex flex-col">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-rose-100">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
              Missing Skills ({missingSkills.length})
            </h4>
          </div>

          <div className="flex-1">
            {missingSkills.length === 0 ? (
              <p className="text-xs text-slate-500 italic">All key required skills were detected!</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map((skill, idx) => (
                  <span
                    key={`skill-missing-${idx}`}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-rose-200 text-rose-800 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recommended Skills */}
        <div className="p-5 rounded-xl border border-indigo-100 bg-indigo-50/20 flex flex-col">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-indigo-100">
            <Lightbulb className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Recommended Skills ({recommendedSkills.length})
            </h4>
          </div>

          <div className="flex-1">
            {recommendedSkills.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No additional skills needed.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {recommendedSkills.map((skill, idx) => (
                  <span
                    key={`skill-rec-${idx}`}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-indigo-200 text-indigo-800 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mandatory Ethical Disclaimer */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Skill Inclusion Guideline: </span>
          <span>{disclaimer || 'If you genuinely have this skill, consider adding it to the appropriate section of your resume.'}</span>
        </div>
      </div>
    </div>
  );
};
