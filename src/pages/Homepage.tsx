import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Hero } from '../components/Hero';
import { ResumeUploader } from '../components/ResumeUploader';
import { JobDetailsForm } from '../components/JobDetailsForm';
import { LoadingState } from '../components/LoadingState';
import { EmptyResultsState } from '../components/EmptyResultsState';
import { ResultsDashboard } from '../components/results/ResultsDashboard';

import { UploadedResumeFile, ResumeAnalysisResult } from '../types';
import { SAMPLE_PRESETS } from '../data/sampleData';
import { analyzeResume } from '../services/analyzerService';
import {
  extractTextFromFile,
  readFileAsBase64,
} from '../utils/fileExtractor';

import {
  Sparkles,
  AlertCircle,
  ArrowRight,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  // Main form state
  const [uploadedResume, setUploadedResume] =
    useState<UploadedResumeFile | null>(null);

  const [resumeText, setResumeText] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');

  // Mode and loading
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [analysisResult, setAnalysisResult] =
    useState<ResumeAnalysisResult | null>(null);

  // Errors
  const [fileError, setFileError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descError, setDescError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const analyzerSectionRef = useRef<HTMLDivElement>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);

  // Scroll to analyzer
  const scrollToAnalyzer = () => {
    analyzerSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  // Handle How It Works navigation
  const goToHowItWorks = () => {
    navigate('/how-it-works');
  };

  // Handle file selection
  const handleFileSelect = async (file: File) => {
    setFileError(null);
    setGeneralError(null);

    const MAX_SIZE = 10 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      setFileError(
        'Your file is larger than 10 MB. Please upload a smaller file.'
      );
      return;
    }

    const validExtensions = ['pdf', 'docx'];

    const fileNameLower = file.name.toLowerCase();
    const extension = fileNameLower.split('.').pop() || '';

    const validMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (
      !validExtensions.includes(extension) &&
      !validMimes.includes(file.type)
    ) {
      setFileError('Please upload a PDF or DOCX file under 10 MB.');
      return;
    }

    try {
      const extracted = await extractTextFromFile(file);
      const base64 = await readFileAsBase64(file);

      setUploadedResume({
        file,
        name: file.name,
        size: file.size,
        type: file.type || 'application/pdf',
        content: extracted,
        base64Data: base64,
      });

      if (extracted && extracted.trim().length > 0) {
        setResumeText(extracted);
      } else {
        setResumeText(
          `[Uploaded Document: ${file.name}]\nDocument uploaded for semantic ATS analysis.`
        );
      }
    } catch (err) {
      console.warn('Error reading uploaded file:', err);

      setUploadedResume({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        content: '',
      });
    }
  };

  // Remove uploaded file
  const handleFileRemove = () => {
    setUploadedResume(null);
    setResumeText('');
    setFileError(null);
  };

  // Load sample preset
  const handleLoadSamplePreset = (presetId: string) => {
    const preset = SAMPLE_PRESETS.find(
      (p) => p.id === presetId
    );

    if (!preset) return;

    setUploadedResume({
      file: null,
      name: preset.fileName,
      size: 142 * 1024,
      type: 'application/pdf',
      content: preset.resumeText,
    });

    setResumeText(preset.resumeText);
    setJobTitle(preset.jobTitle);
    setJobDescription(preset.jobDescription);

    setFileError(null);
    setTitleError(null);
    setDescError(null);
    setGeneralError(null);
  };

  // Load preset job description
  const handleLoadPresetJD = (presetId: string) => {
    const preset = SAMPLE_PRESETS.find(
      (p) => p.id === presetId
    );

    if (!preset) return;

    setJobTitle(preset.jobTitle);
    setJobDescription(preset.jobDescription);

    setTitleError(null);
    setDescError(null);
  };

  // Run ATS analysis
  const handleAnalyze = async () => {
    let hasError = false;

    setGeneralError(null);

    if (
      !uploadedResume &&
      (!resumeText || !resumeText.trim())
    ) {
      setFileError('Please upload a PDF or DOCX file.');
      hasError = true;
    } else {
      setFileError(null);
    }

    if (!jobTitle || !jobTitle.trim()) {
      setTitleError('Please enter the target job title.');
      hasError = true;
    } else {
      setTitleError(null);
    }

    if (
      !jobDescription ||
      !jobDescription.trim()
    ) {
      setDescError(
        'Please paste the job description before analyzing.'
      );
      hasError = true;
    } else {
      setDescError(null);
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const result = await analyzeResume({
        resumeFile: uploadedResume,
        resumeText,
        targetJobTitle: jobTitle.trim(),
        jobDescription: jobDescription.trim(),
        isDemoMode,
      });

      setAnalysisResult(result);

      setTimeout(() => {
        resultsSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 100);
    } catch (err) {
      console.error('Analysis error:', err);

      setGeneralError(
        "We couldn't complete the analysis. Please check your inputs and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reset analysis
  const handleResetAnalysis = () => {
    setAnalysisResult(null);
    setUploadedResume(null);
    setResumeText('');
    setJobTitle('');
    setJobDescription('');

    setFileError(null);
    setTitleError(null);
    setDescError(null);
    setGeneralError(null);

    scrollToAnalyzer();
  };

  // Download report
  const handleDownloadReport = () => {
    if (!analysisResult) return;

    const reportContent = `=====================================================
RESUMEIQ - ATS COMPATIBILITY ANALYSIS REPORT
=====================================================
Target Job Title: ${analysisResult.targetJobTitle}
Analyzed Document: ${analysisResult.fileName}
Analyzed At: ${analysisResult.analyzedAt}
Estimated ATS Score: ${analysisResult.score}/100 (${analysisResult.scoreInterpretation})
Mode: ${analysisResult.isDemo ? 'Demonstration Mode' : 'AI Analysis'}

-----------------------------------------------------
1. EXECUTIVE SUMMARY
-----------------------------------------------------
${analysisResult.summary.overview}

Strengths:
${analysisResult.summary.whatItDoesWell}

Areas Preventing Higher Score:
${analysisResult.summary.whatIsPreventingHigherScore}

Immediate Action Items:
${analysisResult.summary.mostImportantChangesFirst}

-----------------------------------------------------
2. WEIGHTED SCORE BREAKDOWN
-----------------------------------------------------
${Object.values(analysisResult.categoryScores || {})
  .map(
    (c) =>
      ` - ${c.name} (${c.weight}% weight): ${c.score}/100\n   ${c.explanation}`
  )
  .join('\n\n')}

-----------------------------------------------------
3. KEYWORD MATCH SUMMARY
-----------------------------------------------------
Matched Keywords (${(analysisResult.matchedKeywords || []).length}):
${(analysisResult.matchedKeywords || [])
  .map(
    (k) =>
      ` - [MATCHED] ${k.keyword} (${k.frequencyInResume || 1}x in resume)`
  )
  .join('\n') || 'None detected'}

Missing High-Priority Keywords (${(analysisResult.missingKeywords || []).length}):
${(analysisResult.missingKeywords || [])
  .map(
    (k) =>
      ` - [MISSING] ${k.keyword} (${k.importance || 'high'} priority)`
  )
  .join('\n') || 'None'}

-----------------------------------------------------
4. SKILLS ANALYSIS
-----------------------------------------------------
Matched Skills: ${
      (analysisResult.skillsAnalysis?.matchedSkills || []).join(', ') ||
      'None'
    }

Missing Skills: ${
      (analysisResult.skillsAnalysis?.missingSkills || []).join(', ') ||
      'None'
    }

Recommended Skills: ${
      (analysisResult.skillsAnalysis?.recommendedSkills || []).join(', ') ||
      'None'
    }

-----------------------------------------------------
5. CORE STRENGTHS
-----------------------------------------------------
${(analysisResult.strengths || [])
  .map((s, i) => ` ${i + 1}. ${s}`)
  .join('\n')}

-----------------------------------------------------
6. AREAS FOR IMPROVEMENT
-----------------------------------------------------
${(analysisResult.improvements || [])
  .map((imp, i) => ` ${i + 1}. ${imp}`)
  .join('\n')}

-----------------------------------------------------
7. ACTIONABLE AI RECOMMENDATIONS
-----------------------------------------------------
${(analysisResult.recommendations || [])
  .map(
    (r, i) =>
      `[Recommendation ${i + 1}] ${r.title}\n - What is missing or weak: ${r.whatIsMissingOrWeak}\n - Why it matters: ${r.whyItMatters}\n - Recommended improvement: ${r.whatUserCanImprove}`
  )
  .join('\n\n')}

=====================================================
Report generated by ResumeIQ – AI ATS Resume Checker
=====================================================`;

    try {
      const blob = new Blob(
        [reportContent],
        { type: 'text/plain;charset=utf-8' }
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;

      const sanitizedTitle = (
        analysisResult.targetJobTitle || 'Analysis'
      ).replace(/[^a-zA-Z0-9_-]/g, '_');

      a.download = `ResumeIQ_ATS_Report_${sanitizedTitle}.txt`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(
        'Failed to create file download:',
        err
      );
    }

    try {
      window.print();
    } catch {
      // Ignore print restrictions
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-800">

      <main className="flex-1">

        {/* Hero */}
        <div className="no-print">
          <Hero
            onAnalyzeClick={scrollToAnalyzer}
            onHowItWorksClick={goToHowItWorks}
          />
        </div>

        {/* Resume Analyzer */}
        <section
          ref={analyzerSectionRef}
          id="analyzer"
          className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 no-print"
        >
          <div className="text-center max-w-3xl mx-auto mb-10">

            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full">
              Resume Auditor
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 font-display">
              Analyze Your Resume Against The Role
            </h2>

            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Upload your document, paste the target job requirements, and receive a comprehensive ATS compatibility breakdown.
            </p>

            {/* Mode Switcher */}
            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-600">

              <span
                className={
                  !isDemoMode
                    ? 'font-bold text-indigo-700'
                    : 'text-slate-500'
                }
              >
                Live AI Analysis
              </span>

              <button
                type="button"
                onClick={() =>
                  setIsDemoMode(!isDemoMode)
                }
                className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                title="Toggle Demo Mode"
                aria-label="Toggle Demo Mode"
              >
                {isDemoMode ? (
                  <ToggleRight className="w-7 h-7 text-indigo-600" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-400" />
                )}
              </button>

              <span
                className={
                  isDemoMode
                    ? 'font-bold text-amber-700'
                    : 'text-slate-500'
                }
              >
                Demo Mode (Offline)
              </span>

            </div>
          </div>

          {/* Analyzer Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

            {/* Resume Upload */}
            <div className="h-full">
              <ResumeUploader
                uploadedFile={uploadedResume}
                resumeText={resumeText}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                onResumeTextChange={setResumeText}
                onSelectSamplePreset={handleLoadSamplePreset}
                errorMessage={fileError}
              />
            </div>

            {/* Job Details */}
            <div className="h-full">
              <JobDetailsForm
                jobTitle={jobTitle}
                jobDescription={jobDescription}
                onJobTitleChange={(title) => {
                  setJobTitle(title);

                  if (titleError) {
                    setTitleError(null);
                  }
                }}
                onJobDescriptionChange={(desc) => {
                  setJobDescription(desc);

                  if (descError) {
                    setDescError(null);
                  }
                }}
                onLoadPresetJD={handleLoadPresetJD}
                titleError={titleError}
                descError={descError}
              />
            </div>

          </div>

          {/* General Error */}
          {generalError && (
            <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 max-w-xl mx-auto">

              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />

              <span>{generalError}</span>

            </div>
          )}

          {/* Analyze Button */}
          <div className="mt-10 flex flex-col items-center justify-center">

            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              id="main-analyze-resume-btn"
              className={`inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl text-base font-bold text-white shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 ${
                isLoading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-indigo-200 hover:shadow-xl hover:scale-[1.01] cursor-pointer'
              }`}
            >
              <Sparkles
                className={
                  isLoading ? 'w-5 h-5 animate-spin' : 'w-5 h-5'
                }
              />

              <span>
                {isLoading
                  ? 'Analyzing Resume...'
                  : 'Analyze Resume'}
              </span>

              {!isLoading && (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>

            <p className="text-[11px] text-slate-400 mt-2.5">
              Takes ~2-3 seconds to parse document semantics and calculate category percentiles.
            </p>

          </div>
        </section>

        {/* Results */}
        <section
          ref={resultsSectionRef}
          id="results-section"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
        >
          {isLoading ? (
            <LoadingState />
          ) : analysisResult ? (
            <ResultsDashboard
              analysis={analysisResult}
              onReset={handleResetAnalysis}
              onDownloadReport={handleDownloadReport}
            />
          ) : (
            <div className="no-print">
              <EmptyResultsState />
            </div>
          )}
        </section>

      </main>

    </div>
  );
};

export default HomePage;
