import type { IncomingMessage, ServerResponse } from 'node:http';
import { getJobs } from '../server/jobsApi.js';

const allowedOrigins = new Set([
  process.env.ALLOWED_ORIGIN,
  'https://smiilemart.in',
  'https://www.smiilemart.in',
  'https://smilema.in',
  'http://localhost:5173',
  'http://localhost:5174',
]);

function sendJson(
  res: ServerResponse,
  status: number,
  payload: unknown
) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

/** Vercel serverless endpoint for the separately deployed jobs backend. */
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }

  try {
    const requestUrl = new URL(req.url || '/api/jobs', 'http://localhost');
    const result = await getJobs(requestUrl.searchParams, {
      appId: process.env.ADZUNA_APP_ID,
      appKey: process.env.ADZUNA_APP_KEY,
    });

    sendJson(
      res,
      result.success ? 200 : result.isConfigured ? 502 : 503,
      result
    );
  } catch (error) {
    console.error('Vercel jobs API error:', error);
    sendJson(res, 500, {
      success: false,
      isConfigured: Boolean(
        process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY
      ),
      source: 'error',
      total: 0,
      page: 1,
      resultsPerPage: 50,
      jobs: [],
      error: 'Unable to retrieve jobs from the backend service.',
    });
  }
}
