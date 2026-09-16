import React from 'react';
import { FormattingCheckItem, FormattingStatus } from '../../types';
import {
  FileCheck,
  Check,
  AlertTriangle,
  X,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

interface FormattingCheckProps {
  formattingCheck: FormattingCheckItem[];
}

export const FormattingCheck: React.FC<FormattingCheckProps> = ({ formattingCheck = [] }) => {
  const getStatusIcon = (status: FormattingStatus) => {
    switch (status) {
      case 'good':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
            Good
          </span>
        );
      case 'attention':
        return (
          <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-xs bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Needs Attention
          </span>
        );
      case 'issue':
        return (
          <span className="inline-flex items-center gap-1 text-rose-700 font-semibold text-xs bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
            <X className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
            Issue Found
          </span>
        );
      case 'undetermined':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-slate-600 font-semibold text-xs bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            Undetermined
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 font-display">
            <FileCheck className="w-5 h-5 text-indigo-600" />
            ATS Formatting Check
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verification against layout flaws that cause parsing corruption in corporate ATS databases
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {formattingCheck.map((item, idx) => (
          <div
            key={`format-${idx}`}
            className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition-all flex items-start justify-between gap-3"
          >
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {item.detail}
              </p>
            </div>
            <div className="shrink-0">
              {getStatusIcon(item.status)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
        <span>
          ATS parsers rely on plain text extraction. Clean typography and single-column layouts guarantee maximum parse fidelity.
        </span>
      </div>
    </div>
  );
};
