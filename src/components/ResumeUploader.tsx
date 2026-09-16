import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileText,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  FileCode,
} from 'lucide-react';
import { UploadedResumeFile } from '../types';
import { SAMPLE_PRESETS } from '../data/sampleData';

interface ResumeUploaderProps {
  uploadedFile: UploadedResumeFile | null;
  resumeText: string;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  onResumeTextChange: (text: string) => void;
  onSelectSamplePreset: (presetId: string) => void;
  errorMessage?: string | null;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  uploadedFile,
  resumeText,
  onFileSelect,
  onFileRemove,
  onResumeTextChange,
  onSelectSamplePreset,
  errorMessage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTextViewer, setShowTextViewer] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
    e.target.value = '';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
              1
            </span>
            Upload Your Resume
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Provide your current resume in standard ATS-compatible document format
          </p>
        </div>
      </div>

      {/* Quick Sample Selector */}
      <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-700">Need a quick test?</span>
          <span className="text-slate-400">Load sample profile</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectSamplePreset(preset.id)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all font-medium flex items-center gap-1.5"
            >
              <FileCode className="w-3 h-3 text-indigo-500" />
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dropzone or Selected File Card */}
      {!uploadedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 min-h-[220px] rounded-xl border-2 border-dashed transition-all duration-150 flex flex-col items-center justify-center p-6 text-center cursor-pointer ${
            isDragging
              ? 'border-indigo-600 bg-indigo-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/70 bg-slate-50/30'
          }`}
          id="resume-dropzone"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload Resume File"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={handleInputChange}
            id="resume-file-input"
          />

          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 shadow-xs">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-sm font-semibold text-slate-800 mb-1">
            Drag & drop your resume here
          </h3>
          <p className="text-xs text-indigo-600 font-medium mb-3">
            or click to browse
          </p>

          <span className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-500 text-[11px] font-medium">
            PDF or DOCX • Maximum 10 MB
          </span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between rounded-xl border border-indigo-100 bg-indigo-50/20 p-4 sm:p-5">
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate" title={uploadedFile.name}>
                    {uploadedFile.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="uppercase font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">
                      {uploadedFile.name.split('.').pop() || 'PDF'}
                    </span>
                    <span>•</span>
                    <span>{formatFileSize(uploadedFile.size)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onFileRemove}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Remove file"
                aria-label="Remove uploaded resume"
                id="remove-resume-file-btn"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Extracted Text Preview / Editor Accordion */}
            <div className="mt-3 pt-3 border-t border-indigo-100/60">
              <button
                type="button"
                onClick={() => setShowTextViewer(!showTextViewer)}
                className="flex items-center justify-between w-full text-xs font-medium text-indigo-700 hover:text-indigo-800 transition-colors py-1 cursor-pointer"
              >
                <span>{showTextViewer ? 'Hide extracted text' : 'View extracted resume text'}</span>
                {showTextViewer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showTextViewer && (
                <div className="mt-2">
                  <textarea
                    value={resumeText}
                    onChange={(e) => onResumeTextChange(e.target.value)}
                    rows={6}
                    placeholder="Extracted resume text..."
                    className="w-full text-xs font-mono text-slate-700 bg-white border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    You can edit the extracted text above to adjust what is sent to the parser.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Privacy Notice (Prompt Mandate #31) */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span>
          Your resume is used for analysis in this application. Avoid uploading sensitive information you do not want processed.
        </span>
      </div>
    </div>
  );
};
