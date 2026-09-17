import { JobOpportunity } from '../types';
import { calculateJobMatches } from '../data/jobsData';

export interface JobsSearchParams {
  query?: string;
  location?: string;
  page?: number;
  resultsPerPage?: number;
  country?: string;
  fullTime?: boolean;
  contract?: boolean;
  partTime?: boolean;
  resumeText?: string;
}

export interface JobsSearchResponse {
  success: boolean;
  isConfigured: boolean;
  source: 'adzuna' | 'mock' | 'error';
  total: number;
  page: number;
  resultsPerPage: number;
  jobs: JobOpportunity[];
  resolvedCountry?: string;
  resolvedLocation?: string;
  error?: string;
}

/**
 * Detect the most relevant job search query from resume text.
 * This is used only when the user has uploaded a resume and
 * no meaningful job query has been provided.
 */
function deriveJobQueryFromResume(resumeText: string): string {
  const text = resumeText.toLowerCase();

  const rolePatterns: Array<{ query: string; keywords: string[] }> = [
    {
      query: 'PLSQL Developer',
      keywords: [
        'pl/sql',
        'plsql',
        'oracle pl/sql',
        'oracle database',
        'stored procedure',
        'stored procedures',
        'packages',
        'triggers',
      ],
    },
    {
      query: 'Oracle Developer',
      keywords: [
        'oracle developer',
        'oracle sql',
        'oracle database',
        'oracle forms',
        'oracle reports',
      ],
    },
    {
      query: 'SQL Developer',
      keywords: [
        'sql developer',
        'sql server',
        'mysql',
        'postgresql',
        'postgres',
        'database developer',
      ],
    },
    {
      query: 'Frontend Developer',
      keywords: [
        'frontend developer',
        'front end developer',
        'react',
        'react.js',
        'reactjs',
        'angular',
        'vue.js',
        'html',
        'css',
        'javascript',
        'typescript',
      ],
    },
    {
      query: 'Backend Developer',
      keywords: [
        'backend developer',
        'back end developer',
        'node.js',
        'nodejs',
        'express.js',
        'express',
        'java spring',
        'spring boot',
        'django',
        'flask',
      ],
    },
    {
      query: 'Full Stack Developer',
      keywords: [
        'full stack developer',
        'fullstack developer',
        'mern',
        'mean stack',
        'full stack',
      ],
    },
    {
      query: 'Data Analyst',
      keywords: [
        'data analyst',
        'power bi',
        'tableau',
        'data analysis',
        'data analytics',
        'excel',
      ],
    },
    {
      query: 'Data Scientist',
      keywords: [
        'data scientist',
        'machine learning',
        'deep learning',
        'pandas',
        'scikit-learn',
        'tensorflow',
        'pytorch',
      ],
    },
    {
      query: 'DevOps Engineer',
      keywords: [
        'devops',
        'docker',
        'kubernetes',
        'jenkins',
        'terraform',
        'aws devops',
        'ci/cd',
      ],
    },
    {
      query: 'Software Engineer',
      keywords: [
        'software engineer',
        'software developer',
        'application developer',
      ],
    },
    {
      query: 'QA Engineer',
      keywords: [
        'qa engineer',
        'quality assurance',
        'software testing',
        'test automation',
        'selenium',
        'manual testing',
      ],
    },
  ];

  let bestMatch = 'Software Engineer';
  let bestScore = 0;

  for (const role of rolePatterns) {
    let score = 0;

    for (const keyword of role.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score++;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = role.query;
    }
  }

  return bestMatch;
}

/**
 * Check whether the supplied query is just a generic/default query.
 */
function isGenericJobQuery(query: string): boolean {
  const normalized = query.trim().toLowerCase();

  const genericQueries = [
    '',
    'software engineer',
    'software developer',
    'developer',
    'engineer',
    'find jobs',
    'recommended jobs',
  ];

  return genericQueries.includes(normalized);
}

/**
 * Fetch real jobs through our secure backend proxy to Adzuna.
 *
 * Important:
 * When resumeText is available, we derive a relevant job role
 * from the resume BEFORE calling Adzuna. This prevents a PL/SQL,
 * Frontend, Data Analyst, etc. resume from receiving unrelated
 * generic Software Engineer searches.
 */
export async function searchJobs(
  params: JobsSearchParams = {}
): Promise<JobsSearchResponse> {
  const {
    query = '',
    location = '',
    page = 1,
    resultsPerPage = 50,
    country,
    fullTime,
    contract,
    partTime,
    resumeText,
  } = params;

  try {
    /*
     * Resume-aware search:
     *
     * If a resume exists and the supplied query is empty/generic,
     * automatically derive the actual job role from the resume.
     */
    let searchQuery = query.trim();

    if (resumeText && resumeText.trim() && isGenericJobQuery(searchQuery)) {
      searchQuery = deriveJobQueryFromResume(resumeText);
    }

    /* In development, always go through Vite's same-origin proxy. This
     * prevents browser CORS checks and routes the request to localhost:3005.
     * A deployed frontend may override the production API URL if needed. */
    const jobsApiUrl = import.meta.env.DEV
      ? '/api/jobs'
      : import.meta.env.VITE_JOBS_API_URL?.trim() ||
        'https://resumeiq-backend-two.vercel.app/api/jobs';
    const url = new URL(jobsApiUrl, window.location.origin);

    if (searchQuery) {
      url.searchParams.set('what', searchQuery);
    }

    if (location.trim()) {
      url.searchParams.set('where', location.trim());
    }

    url.searchParams.set('page', String(page));
    url.searchParams.set('results_per_page', String(resultsPerPage));

    if (country) {
      url.searchParams.set('country', country.trim());
    }

    if (fullTime) {
      url.searchParams.set('full_time', '1');
    }

    if (contract) {
      url.searchParams.set('contract', '1');
    }

    if (partTime) {
      url.searchParams.set('part_time', '1');
    }

    console.log('ResumeIQ job search:', {
      originalQuery: query,
      detectedQuery: searchQuery,
      location,
      hasResume: Boolean(resumeText),
    });

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      return {
        success: false,
        isConfigured: true,
        source: 'error',
        total: 0,
        page,
        resultsPerPage,
        jobs: [],
        error: `Server responded with HTTP ${res.status}. Please try again later.`,
      };
    }

    const data = await res.json();

    if (!data.success) {
      return {
        success: false,
        isConfigured: Boolean(data.isConfigured),
        source: 'error',
        total: 0,
        page,
        resultsPerPage,
        jobs: [],
        error:
          data.error ||
          'Failed to retrieve jobs from the Adzuna API.',
      };
    }

    let jobs: JobOpportunity[] = Array.isArray(data.jobs)
      ? data.jobs
      : [];

    /*
     * After getting real jobs from Adzuna,
     * calculate resume compatibility.
     */
    if (resumeText && resumeText.trim()) {
      jobs = calculateJobMatches(resumeText, jobs);
    }

    /*
     * Sort matching jobs by compatibility score when available.
     * This keeps the most relevant resume matches at the top.
     */
    jobs = [...jobs].sort((a: any, b: any) => {
      const scoreA =
        typeof a.matchScore === 'number' ? a.matchScore : 0;

      const scoreB =
        typeof b.matchScore === 'number' ? b.matchScore : 0;

      return scoreB - scoreA;
    });

    return {
      success: true,
      isConfigured: Boolean(data.isConfigured),
      source: data.source === 'mock' ? 'mock' : 'adzuna',
      total:
        typeof data.total === 'number'
          ? data.total
          : jobs.length,
      page: data.page || page,
      resultsPerPage:
        data.resultsPerPage || resultsPerPage,
      jobs,
      resolvedCountry: data.resolvedCountry,
      resolvedLocation: data.resolvedLocation,
    };
  } catch (err: any) {
    console.error(
      'Client error calling /api/jobs:',
      err
    );

    return {
      success: false,
      isConfigured: true,
      source: 'error',
      total: 0,
      page,
      resultsPerPage,
      jobs: [],
      error:
        err?.message ||
        'Network error while contacting jobs backend service.',
    };
  }
}
