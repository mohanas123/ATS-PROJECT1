import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { JobOpportunity, UploadedResumeFile } from '../types';
import { INITIAL_JOBS, calculateJobMatches } from '../data/jobsData';
import { SAMPLE_PRESETS } from '../data/sampleData';
import { JobCard } from '../components/jobs/JobCard';
import { JobDetailsModal } from '../components/jobs/JobDetailsModal';
import { JobApplyModal } from '../components/jobs/JobApplyModal';
import { extractTextFromFile } from '../utils/fileExtractor';
import { searchJobs } from '../services/jobsService';

import {
  SUPPORTED_COUNTRIES,
  normalizeLocationInput,
  detectCountryFromLocation,
  getCountryName,
  buildResultSummaryText,
} from '../utils/locationHelper';

import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Trash2,
  Sparkles,
  Search,
  Briefcase,
  AlertCircle,
  FileCode,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check,
  RefreshCw,
  ChevronDown,
  MapPin,
  Loader2,
  ExternalLink,
  Globe,
} from 'lucide-react';

interface JobsPageProps {
  initialResume?: UploadedResumeFile | null;
  onNavigateToATS?: () => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({
  initialResume = null,
  onNavigateToATS,
}) => {
  /* =========================================================
     RESUME STATE
  ========================================================= */

  const [uploadedResume, setUploadedResume] =
    useState<UploadedResumeFile | null>(initialResume || null);

  const [resumeText, setResumeText] = useState<string>(
    initialResume?.content || ''
  );

  const [fileError, setFileError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  /* =========================================================
     SEARCH STATE
  ========================================================= */

  const [keywordInput, setKeywordInput] =
    useState<string>('Software Engineer');

  const [locationInput, setLocationInput] =
    useState<string>('');

  const [countryInput, setCountryInput] =
    useState<string>('in');

  const [activeKeyword, setActiveKeyword] =
    useState<string>('Software Engineer');

  const [activeLocation, setActiveLocation] =
    useState<string>('');

  const [activeCountry, setActiveCountry] =
    useState<string>('in');

  /* =========================================================
     JOB DATA STATE
  ========================================================= */

  const [jobsList, setJobsList] =
    useState<JobOpportunity[]>([]);

  const [totalApiJobs, setTotalApiJobs] =
    useState<number>(0);

  const [apiPage, setApiPage] =
    useState<number>(1);

  const [isLoadingJobs, setIsLoadingJobs] =
    useState<boolean>(true);

  const [isLoadingMoreFromApi, setIsLoadingMoreFromApi] =
    useState<boolean>(false);

  const [jobsError, setJobsError] =
    useState<string | null>(null);

  const [isAdzunaConfigured, setIsAdzunaConfigured] =
    useState<boolean>(true);

  const [isSearching, setIsSearching] =
    useState(false);

  const [hasSearched, setHasSearched] =
    useState(Boolean(initialResume));

  /* =========================================================
     FILTER STATE
  ========================================================= */

  const [selectedTypeFilter, setSelectedTypeFilter] =
    useState<string>('All');

  const [searchQuery, setSearchQuery] =
    useState<string>('');

  const ADZUNA_BATCH_SIZE = 50;

  const [hasReachedEnd, setHasReachedEnd] =
    useState<boolean>(false);

  const [loadMoreError, setLoadMoreError] =
    useState<string | null>(null);

  /* =========================================================
     MODAL STATE
  ========================================================= */

  const [selectedJobForDetails, setSelectedJobForDetails] =
    useState<JobOpportunity | null>(null);

  const [selectedJobForApply, setSelectedJobForApply] =
    useState<JobOpportunity | null>(null);

  /* =========================================================
     REFS
  ========================================================= */

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const recommendedSectionRef =
    useRef<HTMLDivElement>(null);

  /* =========================================================
     LOAD JOBS
  ========================================================= */

  const loadJobsData = useCallback(
    async ({
      keyword = keywordInput,
      location = locationInput,
      country = countryInput,
      page = 1,
      append = false,
      resume = resumeText,
    }: {
      keyword?: string;
      location?: string;
      country?: string;
      page?: number;
      append?: boolean;
      resume?: string;
    } = {}) => {
      if (append) {
        setIsLoadingMoreFromApi(true);
        setLoadMoreError(null);
      } else {
        setIsLoadingJobs(true);
        setJobsError(null);
        setLoadMoreError(null);
        setHasReachedEnd(false);
      }

      try {
        const normalizedLoc =
          normalizeLocationInput(location);

        const detection =
          detectCountryFromLocation(location);

        if (!detection.isSupported) {
          setJobsError(
            detection.unsupportedMessage ||
              `Adzuna job search is currently not available for ${detection.countryName}.`
          );

          if (!append) {
            setJobsList([]);
            setTotalApiJobs(0);
          }

          setIsLoadingJobs(false);
          setIsLoadingMoreFromApi(false);
          return;
        }

        let effectiveCountry = country;

        if (
          country === 'all' &&
          detection.detectedCountryCode
        ) {
          effectiveCountry =
            detection.detectedCountryCode;
        }

        /*
         * IMPORTANT:
         *
         * resume is passed directly to searchJobs().
         *
         * jobsService.ts will detect the correct role
         * from the resume before calling Adzuna.
         *
         * Example:
         *
         * PL/SQL + Oracle
         *       ↓
         * PLSQL Developer
         *
         * React + JavaScript
         *       ↓
         * Frontend Developer
         *
         * Power BI + Excel
         *       ↓
         * Data Analyst
         */

        const response = await searchJobs({
          query: keyword,
          location: normalizedLoc,
          country: effectiveCountry,
          page,
          resultsPerPage: ADZUNA_BATCH_SIZE,
          resumeText: resume?.trim() || undefined,
        });

        setIsAdzunaConfigured(
          response.isConfigured
        );

        if (
          response.success &&
          response.jobs.length > 0
        ) {
          if (append) {
            setJobsList((prev) => {
              const existingIds = new Set(
                prev.map((j) => j.id)
              );

              const uniqueNewJobs =
                response.jobs.filter(
                  (j) => !existingIds.has(j.id)
                );

              return [
                ...prev,
                ...uniqueNewJobs,
              ];
            });
          } else {
            setJobsList(response.jobs);
          }

          setTotalApiJobs(response.total);
          setApiPage(page);
          setJobsError(null);
          setLoadMoreError(null);

          /*
           * Use the actual detected/search keyword.
           *
           * If searchJobs derived a role from the resume,
           * response does not currently return that query,
           * so we display the keyword supplied to the service.
           */
          setActiveKeyword(keyword);
          setActiveLocation(normalizedLoc);

          setActiveCountry(
            response.resolvedCountry ||
              effectiveCountry ||
              'in'
          );

          if (
            response.jobs.length <
              ADZUNA_BATCH_SIZE ||
            (
              response.total > 0 &&
              page * ADZUNA_BATCH_SIZE >=
                response.total
            )
          ) {
            setHasReachedEnd(true);
          }
        } else if (
          response.success &&
          response.jobs.length === 0
        ) {
          if (!append) {
            setJobsList([]);
            setTotalApiJobs(0);
          }

          setHasReachedEnd(true);
          setJobsError(null);

          setActiveKeyword(keyword);
          setActiveLocation(normalizedLoc);

          setActiveCountry(
            response.resolvedCountry ||
              effectiveCountry ||
              'in'
          );
        } else {
          if (append) {
            setLoadMoreError(
              response.error ||
                'Failed to fetch additional jobs from Adzuna.'
            );
          } else {
            setJobsError(
              response.error ||
                'Failed to retrieve jobs from the Adzuna API.'
            );
          }
        }
      } catch (err: any) {
        console.error(
          'Error fetching jobs:',
          err
        );

        if (append) {
          setLoadMoreError(
            'An unexpected network error occurred while loading more jobs.'
          );
        } else {
          setJobsError(
            'An unexpected error occurred while communicating with the jobs API.'
          );
        }
      } finally {
        setIsLoadingJobs(false);
        setIsSearching(false);
        setIsLoadingMoreFromApi(false);
      }
    },
    [
      keywordInput,
      locationInput,
      countryInput,
      resumeText,
    ]
  );

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadJobsData({
      keyword: 'Software Engineer',
      location: '',
      country: 'in',
      page: 1,
      resume: initialResume?.content || '',
    });
  }, []);

  /* =========================================================
     FILE SIZE
  ========================================================= */

  const formatFileSize = (
    bytes: number
  ): string => {
    if (bytes === 0) return '0 B';

    const k = 1024;

    const sizes = [
      'B',
      'KB',
      'MB',
    ];

    const i = Math.floor(
      Math.log(bytes) / Math.log(k)
    );

    return (
      parseFloat(
        (
          bytes /
          Math.pow(k, i)
        ).toFixed(1)
      ) +
      ' ' +
      sizes[i]
    );
  };

  /* =========================================================
     FILE UPLOAD
  ========================================================= */

  const handleFileSelect =
    async (file: File) => {
      setFileError(null);

      if (
        file.size >
        10 * 1024 * 1024
      ) {
        setFileError(
          'File exceeds 10MB limit. Please upload a smaller document.'
        );
        return;
      }

      const validExtensions = [
        'pdf',
        'docx',
      ];

      const ext =
        file.name
          .split('.')
          .pop()
          ?.toLowerCase();

      if (
        !ext ||
        !validExtensions.includes(ext)
      ) {
        setFileError(
          'Unsupported format. Please upload a PDF or DOCX file.'
        );
        return;
      }

      setIsParsing(true);

      try {
        /*
         * Extract the actual resume text.
         */
        const extractedText =
          await extractTextFromFile(file);

        if (
          !extractedText ||
          !extractedText.trim()
        ) {
          throw new Error(
            'No readable text found in resume'
          );
        }

        const newUploadedResume:
          UploadedResumeFile = {
          file,
          name: file.name,
          size: file.size,
          type:
            file.type || ext,
          content: extractedText,
        };

        setUploadedResume(
          newUploadedResume
        );

        setResumeText(
          extractedText
        );

        /*
         * Do not search here.
         *
         * The user must click
         * "Find Matching Jobs".
         *
         * This ensures we fetch fresh jobs
         * using the actual resume.
         */
      } catch (err) {
        console.error(
          'File parsing error:',
          err
        );

        setFileError(
          'Could not parse resume content. Please upload a readable PDF or DOCX file.'
        );
      } finally {
        setIsParsing(false);
      }
    };

  /* =========================================================
     DRAG & DROP
  ========================================================= */

  const handleDragOver =
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

  const handleDragLeave =
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

  const handleDrop =
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (
        e.dataTransfer.files &&
        e.dataTransfer.files.length > 0
      ) {
        handleFileSelect(
          e.dataTransfer.files[0]
        );
      }
    };

  /* =========================================================
     SAMPLE RESUME
  ========================================================= */

  const handleLoadSample =
    (presetId: string) => {
      const preset =
        SAMPLE_PRESETS.find(
          (p) => p.id === presetId
        );

      if (!preset) return;

      setFileError(null);

      const sampleFile:
        UploadedResumeFile = {
        file: null,
        name: preset.fileName,
        size: 48500,
        type: 'pdf',
        content: preset.resumeText,
      };

      setUploadedResume(
        sampleFile
      );

      setResumeText(
        preset.resumeText
      );

      setHasSearched(false);
    };

  /* =========================================================
     REMOVE RESUME
  ========================================================= */

  const handleRemoveFile =
    () => {
      setUploadedResume(null);
      setResumeText('');
      setFileError(null);
      setHasSearched(false);
    };

  /* =========================================================
     ⭐ MAIN RESUME MATCHING FUNCTION
  ========================================================= */

  const handleFindMatchingJobs =
    async () => {
      const currentResumeText =
        (
          resumeText ||
          uploadedResume?.content ||
          ''
        ).trim();

      if (!currentResumeText) {
        setFileError(
          'Please upload your resume (PDF or DOCX) to find matching jobs.'
        );
        return;
      }

      setFileError(null);
      setIsSearching(true);

      /*
       * VERY IMPORTANT:
       *
       * We DO NOT score the old jobs here.
       *
       * We fetch NEW jobs from Adzuna.
       *
       * The keyword is intentionally generic:
       * "Software Engineer"
       *
       * jobsService.ts sees the resumeText and
       * replaces this generic query with the
       * appropriate role.
       *
       * Example:
       *
       * Resume:
       * PL/SQL + Oracle + SQL
       *
       * Query sent by jobsService:
       * PLSQL Developer
       */

      setApiPage(1);
      setHasReachedEnd(false);

      await loadJobsData({
        keyword: 'Software Engineer',
        location: locationInput,
        country: countryInput,
        page: 1,
        append: false,
        resume: currentResumeText,
      });

      setHasSearched(true);

      setTimeout(() => {
        recommendedSectionRef.current?.scrollIntoView(
          {
            behavior: 'smooth',
            block: 'start',
          }
        );
      }, 200);
    };

  /* =========================================================
     NORMAL SEARCH
  ========================================================= */

  const handleSearchSubmit =
    (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      setApiPage(1);
      setHasReachedEnd(false);

      const cleanLoc =
        normalizeLocationInput(
          locationInput
        );

      setLocationInput(cleanLoc);

      let effectiveCountry =
        countryInput;

      const detection =
        detectCountryFromLocation(
          cleanLoc
        );

      if (
        countryInput === 'all' &&
        detection.detectedCountryCode
      ) {
        effectiveCountry =
          detection.detectedCountryCode;

        setCountryInput(
          detection.detectedCountryCode
        );
      }

      loadJobsData({
        keyword:
          keywordInput.trim(),
        location: cleanLoc,
        country: effectiveCountry,
        page: 1,
        append: false,
        resume: resumeText,
      });

      setTimeout(() => {
        recommendedSectionRef.current?.scrollIntoView(
          {
            behavior: 'smooth',
          }
        );
      }, 100);
    };

  /* =========================================================
     SAMPLE POSITIONS
  ========================================================= */

  const handleLoadSamplePositions =
    () => {
      const sampleList =
        resumeText
          ? calculateJobMatches(
              resumeText,
              INITIAL_JOBS
            )
          : INITIAL_JOBS;

      setJobsList(sampleList);
      setTotalApiJobs(
        sampleList.length
      );
      setJobsError(null);
      setHasReachedEnd(true);
    };

  /* =========================================================
     LOAD MORE
  ========================================================= */

  const handleLoadMoreFromAdzuna =
    async () => {
      if (
        isLoadingMoreFromApi ||
        hasReachedEnd
      ) {
        return;
      }

      const nextPage =
        apiPage + 1;

      await loadJobsData({
        keyword: activeKeyword,
        location: activeLocation,
        country: activeCountry,
        page: nextPage,
        append: true,
        resume: resumeText,
      });
    };

  /* =========================================================
     FILTER JOBS
  ========================================================= */

  const filteredJobs =
    useMemo(() => {
      return jobsList.filter(
        (job) => {
          const matchesType =
            selectedTypeFilter ===
              'All' ||
            job.jobType
              .toLowerCase() ===
              selectedTypeFilter.toLowerCase();

          const query =
            searchQuery
              .trim()
              .toLowerCase();

          const matchesQuery =
            !query ||
            job.title
              .toLowerCase()
              .includes(query) ||
            job.company
              .toLowerCase()
              .includes(query) ||
            job.location
              .toLowerCase()
              .includes(query) ||
            job.requiredSkills.some(
              (skill) =>
                skill
                  .toLowerCase()
                  .includes(query)
            );

          return (
            matchesType &&
            matchesQuery
          );
        }
      );
    }, [
      jobsList,
      selectedTypeFilter,
      searchQuery,
    ]);

  const hasMoreFromApi =
    !hasReachedEnd &&
    (
      totalApiJobs === 0 ||
      jobsList.length <
        totalApiJobs
    );

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden pt-10 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-white via-indigo-50/20 to-slate-50 border-b border-slate-200/80">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between mb-6">

            <button
              type="button"
              onClick={() => {
                if (onNavigateToATS) {
                  onNavigateToATS();
                } else if (
                  typeof window !==
                    'undefined' &&
                  window.history.length >
                    1
                ) {
                  window.history.back();
                } else {
                  window.location.href =
                    '/';
                }
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                Back to Resume Analyzer
              </span>
            </button>

            <span className="text-xs text-slate-400 hidden sm:inline">
              ResumeIQ AI ATS • Adzuna Job Search
            </span>
          </div>

          <div className="text-center">

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                AI Career Match Engine
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto mb-5">
              Find Jobs That Match{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600">
                Your Resume
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Upload your resume and discover job opportunities that match your skills and experience.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  Skill-Weighted Matching
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>
                  Live Job Positions
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>
                  Free & Confidential
                </span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">

        {/* ===================================================
            RESUME UPLOAD
        =================================================== */}

        <div className="max-w-3xl mx-auto mb-14">

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                    1
                  </span>

                  Upload Your Resume
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Upload your resume in PDF or DOCX format to find relevant live jobs.
                </p>

              </div>

              <div className="hidden sm:flex items-center gap-2">

                <span className="text-[11px] text-slate-400">
                  Quick Test:
                </span>

                {SAMPLE_PRESETS
                  .slice(0, 2)
                  .map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        handleLoadSample(
                          preset.id
                        )
                      }
                      className="text-[11px] font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg"
                    >
                      <FileCode className="w-3 h-3 inline mr-1" />
                      {preset.title
                        .split('(')[0]
                        .trim()}
                    </button>
                  ))}
              </div>
            </div>

            {/* UPLOAD AREA */}

            {!uploadedResume ? (

              <div
                onDragOver={
                  handleDragOver
                }
                onDragLeave={
                  handleDragLeave
                }
                onDrop={handleDrop}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className={`rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-300 hover:border-indigo-400 bg-slate-50/40'
                }`}
              >

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e) => {
                    if (
                      e.target.files &&
                      e.target.files.length >
                        0
                    ) {
                      handleFileSelect(
                        e.target.files[0]
                      );
                    }

                    e.target.value = '';
                  }}
                />

                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-1">
                  Drag & drop your resume file here
                </h3>

                <p className="text-xs text-indigo-600 font-medium mb-4">
                  or click to browse your device
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-white border border-indigo-200"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Upload Resume
                </button>

                <p className="text-[11px] text-slate-400 mt-3">
                  PDF or DOCX • Max 10 MB
                </p>

              </div>

            ) : (

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/20 p-5 sm:p-6">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                  <div className="flex items-center gap-3.5 min-w-0">

                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>

                    <div className="min-w-0">

                      <h4
                        className="text-sm sm:text-base font-bold text-slate-900 truncate"
                        title={
                          uploadedResume.name
                        }
                      >
                        {
                          uploadedResume.name
                        }
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 text-xs mt-1">

                        <span className="uppercase font-bold text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                          {uploadedResume.name
                            .split('.')
                            .pop() ||
                            'PDF'}
                        </span>

                        <span className="text-slate-400">
                          •
                        </span>

                        <span className="text-slate-500">
                          {formatFileSize(
                            uploadedResume.size
                          )}
                        </span>

                        <span className="text-slate-400">
                          •
                        </span>

                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Upload Successful & Parsed
                        </span>

                      </div>

                    </div>
                  </div>

                  <div className="flex items-center gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Change File
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleRemoveFile
                      }
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e) => {
                    if (
                      e.target.files &&
                      e.target.files.length >
                        0
                    ) {
                      handleFileSelect(
                        e.target.files[0]
                      );
                    }

                    e.target.value = '';
                  }}
                />

                <div className="mt-4 pt-3 border-t border-emerald-100 text-xs text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Resume parsed successfully. Ready to find matching jobs.
                </div>

              </div>
            )}

            {/* ERROR */}

            {fileError && (
              <div className="mt-4 flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>
                  {fileError}
                </span>
              </div>
            )}

            {/* =================================================
                FIND MATCHING JOBS
            ================================================= */}

            <div className="mt-6 flex flex-col items-center">

              <button
                type="button"
                onClick={
                  handleFindMatchingJobs
                }
                disabled={
                  isSearching ||
                  isParsing
                }
                className={`inline-flex items-center justify-center gap-2.5 px-9 py-3.5 rounded-xl text-sm font-bold text-white shadow-md transition-all ${
                  isSearching ||
                  isParsing
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                }`}
              >

                <Sparkles
                  className={`w-4 h-4 ${
                    isSearching
                      ? 'animate-spin'
                      : ''
                  }`}
                />

                <span>
                  {isSearching
                    ? 'Reading Resume & Finding Matches...'
                    : 'Find Matching Jobs'}
                </span>

                {!isSearching && (
                  <ArrowRight className="w-4 h-4" />
                )}

              </button>

              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Resume skills and experience are used to find relevant live job opportunities.
              </p>

            </div>

          </div>
        </div>

        {/* =====================================================
            RECOMMENDED JOBS
        ===================================================== */}

        <section
          ref={
            recommendedSectionRef
          }
          id="recommended-jobs-section"
          className="scroll-mt-24"
        >

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-5 border-b border-slate-200">

            <div>

              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                Matched Opportunities
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex flex-wrap items-center gap-3">

                <span>
                  Recommended Jobs
                </span>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {totalApiJobs > 0
                    ? `${totalApiJobs.toLocaleString()} Found`
                    : `${filteredJobs.length} Available`}
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">

                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />

                  Adzuna Live API (
                  {getCountryName(
                    activeCountry
                  )}
                  )

                </span>

              </h2>

              <p className="text-xs sm:text-sm text-slate-600 mt-1.5">

                {buildResultSummaryText(
                  filteredJobs.length,
                  totalApiJobs,
                  activeLocation,
                  activeCountry
                )}

                {activeKeyword && (
                  <span>
                    {' '}
                    for "
                    {activeKeyword}"
                  </span>
                )}

                {uploadedResume && (
                  <span>
                    {' '}
                    • Ranked by compatibility with{' '}
                    <strong>
                      {
                        uploadedResume.name
                      }
                    </strong>
                  </span>
                )}

              </p>

            </div>

            {/* FILTER */}

            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm text-xs font-medium text-slate-600">

              {[
                'All',
                'Remote',
                'Hybrid',
                'Full-time',
                'Contract',
              ].map((type) => (

                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setSelectedTypeFilter(
                      type
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedTypeFilter ===
                    type
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {type}
                </button>

              ))}

            </div>

          </div>

          {/* ===================================================
              SEARCH FORM
          =================================================== */}

          <form
            onSubmit={
              handleSearchSubmit
            }
            className="mb-6 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm"
          >

            <div className="flex flex-col lg:flex-row gap-3">

              {/* KEYWORD */}

              <div className="flex-1 relative">

                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />

                <input
                  type="text"
                  value={
                    keywordInput
                  }
                  onChange={(e) =>
                    setKeywordInput(
                      e.target.value
                    )
                  }
                  placeholder="Job title, keywords, or skills..."
                  className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-600"
                />

              </div>

              {/* LOCATION */}

              <div className="w-full lg:w-72 relative">

                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />

                <input
                  type="text"
                  value={
                    locationInput
                  }
                  onChange={(e) => {
                    const val =
                      e.target.value;

                    setLocationInput(
                      val
                    );

                    const det =
                      detectCountryFromLocation(
                        val
                      );

                    if (
                      countryInput ===
                        'all' &&
                      det.detectedCountryCode
                    ) {
                      setCountryInput(
                        det.detectedCountryCode
                      );
                    }
                  }}
                  placeholder="City, State, or Country..."
                  className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-600"
                />

              </div>

              {/* COUNTRY */}

              <div className="w-full lg:w-56 relative">

                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />

                <select
                  value={
                    countryInput
                  }
                  onChange={(e) =>
                    setCountryInput(
                      e.target.value
                    )
                  }
                  className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 appearance-none cursor-pointer"
                >

                  {SUPPORTED_COUNTRIES.map(
                    (c) => (
                      <option
                        key={c.code}
                        value={c.code}
                      >
                        {c.flag}{' '}
                        {c.name}
                      </option>
                    )
                  )}

                </select>

                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />

              </div>

              {/* FIND JOBS */}

              <button
                type="submit"
                disabled={
                  isLoadingJobs
                }
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 shrink-0"
              >

                {isLoadingJobs ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Find Jobs
                  </>
                )}

              </button>

            </div>

            {/* QUICK SEARCH */}

            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">

              <span className="text-[11px] font-medium text-slate-400">
                Popular:
              </span>

              {[
                'Software Engineer',
                'Data Scientist',
                'Developer',
                'Frontend',
                'DevOps',
              ].map((tag) => (

                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setKeywordInput(
                      tag
                    );

                    loadJobsData({
                      keyword: tag,
                      location:
                        locationInput,
                      country:
                        countryInput,
                      page: 1,
                      append: false,
                      resume:
                        resumeText,
                    });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[11px] font-medium"
                >
                  {tag}
                </button>

              ))}

              <span className="text-slate-300">
                |
              </span>

              {(
                countryInput ===
                'in'
                  ? [
                      'Coimbatore',
                      'Coimbatore, Tamil Nadu',
                      'Tamil Nadu',
                      'Chennai',
                      'Bengaluru',
                      'Hyderabad',
                      'India',
                    ]
                  : [
                      'Coimbatore, Tamil Nadu',
                      'Bengaluru',
                      'London',
                      'Singapore',
                      'United States',
                    ]
              ).map((loc) => (

                <button
                  key={loc}
                  type="button"
                  onClick={() => {

                    setLocationInput(
                      loc
                    );

                    const det =
                      detectCountryFromLocation(
                        loc
                      );

                    const effCountry =
                      det.detectedCountryCode ||
                      countryInput;

                    if (
                      det.detectedCountryCode &&
                      countryInput ===
                        'all'
                    ) {
                      setCountryInput(
                        det.detectedCountryCode
                      );
                    }

                    loadJobsData({
                      keyword:
                        keywordInput,
                      location: loc,
                      country:
                        effCountry,
                      page: 1,
                      append: false,
                      resume:
                        resumeText,
                    });

                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[11px] font-medium"
                >
                  📍 {loc}
                </button>

              ))}

              {/* CURRENT RESULT FILTER */}

              <div className="relative w-full sm:w-56 sm:ml-auto">

                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />

                <input
                  type="text"
                  value={
                    searchQuery
                  }
                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value
                    )
                  }
                  placeholder="Filter current results..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50"
                />

              </div>

            </div>

          </form>

          {/* ===================================================
              LOADING
          =================================================== */}

          {isLoadingJobs && (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">

              {[
                1,
                2,
                3,
                4,
                5,
                6,
              ].map((n) => (

                <div
                  key={n}
                  className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4"
                >

                  <div className="flex gap-3">

                    <div className="w-12 h-12 bg-slate-200 rounded-xl" />

                    <div className="space-y-2">

                      <div className="h-5 w-44 bg-slate-200 rounded" />

                      <div className="h-3 w-28 bg-slate-200 rounded" />

                    </div>

                  </div>

                  <div className="h-10 bg-slate-100 rounded" />

                  <div className="h-9 bg-slate-200 rounded-xl" />

                </div>

              ))}

            </div>

          )}

          {/* ===================================================
              ERROR
          =================================================== */}

          {!isLoadingJobs &&
            jobsError &&
            jobsList.length === 0 && (

              <div className="bg-white rounded-2xl border border-amber-200 p-8 max-w-xl mx-auto text-center">

                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">

                  <AlertCircle className="w-7 h-7" />

                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {!isAdzunaConfigured
                    ? 'Adzuna API Setup'
                    : 'Unable to Retrieve Jobs'}
                </h3>

                <p className="text-sm text-slate-600 mt-2">
                  {jobsError}
                </p>

                {!isAdzunaConfigured && (

                  <div className="mt-4 p-4 bg-slate-50 rounded-xl border text-left text-xs">

                    <p className="font-semibold mb-2">
                      To enable live job searches:
                    </p>

                    <p>
                      Get your free App ID & Key at{' '}
                      <a
                        href="https://developer.adzuna.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 font-medium"
                      >
                        developer.adzuna.com
                        <ExternalLink className="w-3 h-3 inline ml-1" />
                      </a>
                    </p>

                  </div>

                )}

                <div className="mt-6 flex flex-wrap justify-center gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      loadJobsData({
                        keyword:
                          keywordInput,
                        location:
                          locationInput,
                        country:
                          countryInput,
                        page: 1,
                        append: false,
                        resume:
                          resumeText,
                      })
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry API Search
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleLoadSamplePositions
                    }
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100"
                  >
                    Load Sample Positions
                  </button>

                </div>

              </div>
            )}

          {/* ===================================================
              JOB CARDS
          =================================================== */}

          {!isLoadingJobs &&
            (!jobsError ||
              jobsList.length > 0) && (

              <>

                {filteredJobs.length ===
                0 ? (

                  <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto">

                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">

                      <MapPin className="w-7 h-7" />

                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      No matching jobs found
                    </h3>

                    <p className="text-sm text-slate-600 mt-2">
                      Try another location or job search.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedTypeFilter(
                          'All'
                        );
                      }}
                      className="mt-5 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-xl"
                    >
                      Reset Filters
                    </button>

                  </div>

                ) : (

                  <>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {filteredJobs.map(
                        (job, idx) => (

                          <JobCard
                            key={
                              job.id
                            }
                            job={job}
                            positionNumber={
                              idx + 1
                            }
                            onViewJob={(
                              selected
                            ) =>
                              setSelectedJobForDetails(
                                selected
                              )
                            }
                            onApply={(
                              selected
                            ) =>
                              setSelectedJobForApply(
                                selected
                              )
                            }
                          />

                        )
                      )}

                    </div>

                    {/* =================================================
                        LOAD MORE
                    ================================================= */}

                    <div className="mt-10 max-w-xl mx-auto">

                      {loadMoreError && (

                        <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">

                          <div className="flex items-center gap-2">

                            <AlertCircle className="w-4 h-4 text-amber-600" />

                            <span>
                              {loadMoreError}
                            </span>

                          </div>

                          <button
                            type="button"
                            onClick={
                              handleLoadMoreFromAdzuna
                            }
                            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-semibold"
                          >
                            Retry
                          </button>

                        </div>

                      )}

                      {hasMoreFromApi ? (

                        <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 text-center">

                          <div className="w-full mb-5">

                            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">

                              <span>
                                Showing{' '}
                                <strong>
                                  {
                                    jobsList.length
                                  }
                                </strong>{' '}
                                positions
                              </span>

                              <span className="text-indigo-600">
                                {totalApiJobs >
                                0
                                  ? `${totalApiJobs.toLocaleString()} total`
                                  : 'More available'}
                              </span>

                            </div>

                            {totalApiJobs >
                              0 && (

                              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">

                                <div
                                  className="h-full bg-indigo-600 rounded-full transition-all"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.max(
                                        5,
                                        (jobsList.length /
                                          totalApiJobs) *
                                          100
                                      )
                                    )}%`,
                                  }}
                                />

                              </div>
                            )}

                            <p className="text-[11px] text-slate-400 mt-2">
                              Batch{' '}
                              {apiPage} • Fetch the next 50 positions from Adzuna.
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={
                              handleLoadMoreFromAdzuna
                            }
                            disabled={
                              isLoadingMoreFromApi
                            }
                            className="inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                          >

                            {isLoadingMoreFromApi ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Fetching Jobs...
                              </>
                            ) : (
                              <>
                                Load More Jobs
                                <span className="px-1.5 py-0.5 rounded-md bg-indigo-500">
                                  +50
                                </span>
                                <ChevronDown className="w-4 h-4" />
                              </>
                            )}

                          </button>

                        </div>

                      ) : (

                        filteredJobs.length >
                          0 && (

                          <div className="flex items-center justify-center gap-2 p-5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-600 text-center">

                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />

                            All available positions loaded.

                          </div>

                        )
                      )}

                    </div>

                  </>
                )}

              </>
            )}

          {/* ===================================================
              BOTTOM CTA
          =================================================== */}

          <div className="mt-14 p-6 rounded-2xl bg-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">

            <div className="text-center sm:text-left">

              <h3 className="text-lg font-bold">
                Want to boost your match percentage?
              </h3>

              <p className="text-xs text-indigo-200 max-w-xl mt-1">
                Run our detailed ATS Audit to find missing keywords, formatting issues, and improvements.
              </p>

            </div>

            {onNavigateToATS && (

              <button
                type="button"
                onClick={
                  onNavigateToATS
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-indigo-950 bg-white"
              >

                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />

                Open ATS Checker

              </button>

            )}

          </div>

        </section>
      </main>

      {/* =======================================================
          MODALS
      ======================================================= */}

      <JobDetailsModal
        job={
          selectedJobForDetails
        }
        onClose={() =>
          setSelectedJobForDetails(
            null
          )
        }
        onApply={(job) => {
          setSelectedJobForDetails(
            null
          );

          setSelectedJobForApply(
            job
          );
        }}
      />

      <JobApplyModal
        job={
          selectedJobForApply
        }
        uploadedResume={
          uploadedResume
        }
        onClose={() =>
          setSelectedJobForApply(
            null
          )
        }
      />

    </div>
  );
};