import type { JobOpportunity } from '../src/types';
import { INITIAL_JOBS } from '../src/data/jobsData';

type JobsApiResponse = {
  success: boolean;
  isConfigured: boolean;
  total: number;
  page: number;
  resultsPerPage: number;
  jobs: JobOpportunity[];
  source: 'adzuna' | 'mock';
  error?: string;
};

const supportedCountries = new Set(['at', 'au', 'be', 'br', 'ca', 'ch', 'de', 'es', 'fr', 'gb', 'in', 'it', 'mx', 'nl', 'nz', 'pl', 'sg', 'us', 'za']);

const text = (value: unknown) => (typeof value === 'string' ? value : '');
const cleanHtml = (value: unknown) => text(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

function getSampleJobs(search: URLSearchParams, page: number, resultsPerPage: number): JobsApiResponse {
  const queryTerms = (search.get('what') || '').toLowerCase().split(/\s+/).filter(Boolean);
  const typeFilter = search.get('full_time') ? 'Full-time' : search.get('part_time') ? 'Part-time' : search.get('contract') ? 'Contract' : undefined;
  const matches = INITIAL_JOBS.filter((job) => {
    const searchable = `${job.title} ${job.description} ${job.requiredSkills.join(' ')}`.toLowerCase();
    return (!queryTerms.length || queryTerms.some((term) => searchable.includes(term))) && (!typeFilter || job.jobType === typeFilter);
  });
  const jobs = matches.slice((page - 1) * resultsPerPage, page * resultsPerPage);
  return {
    success: true,
    isConfigured: false,
    source: 'mock',
    total: matches.length,
    page,
    resultsPerPage,
    jobs,
  };
}

function jobTypeFrom(source: Record<string, unknown>): JobOpportunity['jobType'] {
  const description = `${text(source.title)} ${cleanHtml(source.description)}`.toLowerCase();
  if (description.includes('remote')) return 'Remote';
  if (description.includes('hybrid')) return 'Hybrid';
  if (description.includes('contract')) return 'Contract';
  if (description.includes('part-time') || description.includes('part time')) return 'Part-time';
  return 'Full-time';
}

function formatSalary(value: unknown): string | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

function toJob(source: Record<string, unknown>): JobOpportunity {
  const minimumSalary = formatSalary(source.salary_min);
  const maximumSalary = formatSalary(source.salary_max);
  const salaryRange = minimumSalary && maximumSalary
    ? `${minimumSalary} – ${maximumSalary}`
    : minimumSalary || maximumSalary;
  const rawLocation = source.location as Record<string, unknown> | undefined;
  const locationParts = Array.isArray(rawLocation?.display_name) ? rawLocation.display_name : [];

  return {
    id: text(source.id) || text(source.redirect_url) || crypto.randomUUID(),
    title: text(source.title) || 'Untitled position',
    company: text((source.company as Record<string, unknown> | undefined)?.display_name) || 'Company not listed',
    location: locationParts.filter((part): part is string => typeof part === 'string').join(', ') || 'Location not listed',
    jobType: jobTypeFrom(source),
    salaryRange,
    postedDate: text(source.created),
    matchPercentage: 0,
    requiredSkills: [],
    description: cleanHtml(source.description),
    applicationUrl: text(source.redirect_url) || undefined,
    redirectUrl: text(source.redirect_url) || undefined,
  };
}

export async function getJobs(search: URLSearchParams, credentials: { appId?: string; appKey?: string }): Promise<JobsApiResponse> {
  const appId = credentials.appId?.trim();
  const appKey = credentials.appKey?.trim();
  const page = Math.max(1, Number.parseInt(search.get('page') || '1', 10) || 1);
  const resultsPerPage = Math.min(50, Math.max(1, Number.parseInt(search.get('results_per_page') || '50', 10) || 50));

  if (!appId || !appKey) {
    return getSampleJobs(search, page, resultsPerPage);
  }

  const requestedCountry = (search.get('country') || 'in').toLowerCase();
  const country = supportedCountries.has(requestedCountry) ? requestedCountry : 'in';
  const endpoint = new URL(`https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`);
  endpoint.searchParams.set('app_id', appId);
  endpoint.searchParams.set('app_key', appKey);
  endpoint.searchParams.set('results_per_page', String(resultsPerPage));
  for (const key of ['what', 'where', 'full_time', 'part_time', 'contract']) {
    const value = search.get(key);
    if (value) endpoint.searchParams.set(key, value);
  }

  try {
    const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
    if (!response.ok) {
      return { success: false, isConfigured: true, source: 'adzuna', total: 0, page, resultsPerPage, jobs: [], error: `Job provider responded with HTTP ${response.status}.` };
    }
    const data = await response.json() as { count?: unknown; results?: unknown };
    const results = Array.isArray(data.results) ? data.results : [];
    return {
      success: true,
      isConfigured: true,
      source: 'adzuna',
      total: typeof data.count === 'number' ? data.count : results.length,
      page,
      resultsPerPage,
      jobs: results.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object')).map(toJob),
    };
  } catch (error) {
    console.error('Adzuna request failed:', error);
    return { success: false, isConfigured: true, source: 'adzuna', total: 0, page, resultsPerPage, jobs: [], error: 'Unable to contact the job provider. Please try again later.' };
  }
}
