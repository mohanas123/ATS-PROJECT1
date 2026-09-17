import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { runLocalATSAnalysis } from './src/services/localAnalyzer';
import { getJobs } from './server/jobsApi';

dotenv.config();

const app = express();

/*
 * ResumeIQ backend runs on port 3005.
 * Frontend Vite (/api proxy) also points to port 3005.
 */
const PORT = 3005;
const HOST = '0.0.0.0';

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

/* =========================
   GEMINI CLIENT
========================= */

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;

  if (!key || key === 'MY_GEMINI_API_KEY') {
    return null;
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
    });
  }

  return aiClient;
}

/* =========================
   HEALTH CHECK
========================= */

app.get('/api/health', (_req, res) => {
  const hasGemini = Boolean(getGeminiClient());

  res.json({
    status: 'ok',
    hasGeminiKey: hasGemini,
    hasAdzunaAppId: Boolean(process.env.ADZUNA_APP_ID),
    hasAdzunaAppKey: Boolean(process.env.ADZUNA_APP_KEY),
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   LIVE JOBS ENDPOINT
========================= */

app.get('/api/jobs', async (req, res) => {
  try {
    const search = new URLSearchParams();

    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === 'string') {
        search.set(key, value);
      }
    }

    const result = await getJobs(search, {
      appId: process.env.ADZUNA_APP_ID,
      appKey: process.env.ADZUNA_APP_KEY,
    });

    res
      .status(
        result.success
          ? 200
          : result.isConfigured
            ? 502
            : 503
      )
      .json(result);
  } catch (error) {
    console.error('Jobs API error:', error);

    res.status(500).json({
      success: false,
      isConfigured: Boolean(
        process.env.ADZUNA_APP_ID &&
        process.env.ADZUNA_APP_KEY
      ),
      source: 'error',
      total: 0,
      page: 1,
      resultsPerPage: 50,
      jobs: [],
      error: 'Unable to retrieve jobs from the backend service.',
    });
  }
});

/* =========================
   RESUME ANALYSIS
========================= */

app.post('/api/analyze', async (req, res) => {
  try {
    const {
      resumeText,
      targetJobTitle,
      jobDescription,
      fileName,
      fileBase64,
      fileMimeType,
      forceDemo,
    } = req.body;

    if (!targetJobTitle || !targetJobTitle.trim()) {
      return res.status(400).json({
        error: 'Please enter the target job title.',
      });
    }

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        error: 'Please paste the job description before analyzing.',
      });
    }

    if (!resumeText && !fileBase64) {
      return res.status(400).json({
        error: 'Please upload a PDF or DOCX file.',
      });
    }

    const safeTitle = targetJobTitle.trim();
    const safeJobDesc = jobDescription.trim();
    const safeFileName =
      fileName || 'Uploaded_Resume.pdf';

    const textToAnalyze = resumeText || '';

    const ai = getGeminiClient();

    /* =========================
       LOCAL FALLBACK
    ========================= */

    if (forceDemo || !ai) {
      const localResult = runLocalATSAnalysis(
        textToAnalyze,
        safeTitle,
        safeJobDesc,
        safeFileName,
        true
      );

      return res.json({
        result: localResult,
        source: 'heuristic-engine',
      });
    }

    /* =========================
       GEMINI ANALYSIS
    ========================= */

    try {
      const prompt = `
You are a professional ATS (Applicant Tracking System)
and Senior Technical Recruiter.

Analyze the following resume against the target job title
and job description.

Target Job Title:
${safeTitle}

Job Description:
${safeJobDesc}

Resume Text:
${textToAnalyze.slice(0, 15000)}

Scoring Model Rules:

1. Keyword Match (25% weight)
Evaluate exact and semantic keyword overlap.

2. Skills Match (20% weight)
Evaluate hard and soft skills required in the JD
versus skills shown in the resume.

3. Job Title Alignment (10% weight)
Evaluate alignment between target job title and
resume titles/summary.

4. Experience Relevance (15% weight)
Evaluate relevance of experience bullets to JD responsibilities.

5. Resume Structure (10% weight)
Check standard ATS sections:
Summary, Skills, Experience, Education.

6. Formatting Compatibility (10% weight)
Evaluate ATS-friendly linear text layout,
standard headings and absence of problematic formatting.

7. Achievements & Impact (5% weight)
Check for quantified metrics, numbers and outcomes.

8. Overall Job Alignment (5% weight)
Evaluate seniority, domain and role alignment.

Return ONLY valid JSON.

Use this exact structure:

{
  "score": 0,
  "scoreInterpretation": "Excellent",
  "summary": {
    "overview": "",
    "whatItDoesWell": "",
    "whatIsPreventingHigherScore": "",
    "mostImportantChangesFirst": ""
  },
  "categoryScores": {
    "keywordMatch": {
      "name": "Keyword Match",
      "weight": 25,
      "score": 0,
      "explanation": ""
    },
    "skillsMatch": {
      "name": "Skills Match",
      "weight": 20,
      "score": 0,
      "explanation": ""
    },
    "jobTitleAlignment": {
      "name": "Job Title Alignment",
      "weight": 10,
      "score": 0,
      "explanation": ""
    },
    "experienceRelevance": {
      "name": "Experience Relevance",
      "weight": 15,
      "score": 0,
      "explanation": ""
    },
    "resumeStructure": {
      "name": "Resume Structure",
      "weight": 10,
      "score": 0,
      "explanation": ""
    },
    "formattingCompatibility": {
      "name": "Formatting Compatibility",
      "weight": 10,
      "score": 0,
      "explanation": ""
    },
    "achievementsImpact": {
      "name": "Achievements & Impact",
      "weight": 5,
      "score": 0,
      "explanation": ""
    },
    "overallAlignment": {
      "name": "Overall Job Alignment",
      "weight": 5,
      "score": 0,
      "explanation": ""
    }
  },
  "matchedKeywords": [],
  "missingKeywords": [],
  "importantKeywords": [],
  "skillsAnalysis": {
    "matchedSkills": [],
    "missingSkills": [],
    "recommendedSkills": [],
    "disclaimer": "If you genuinely have this skill, consider adding it to the appropriate section of your resume."
  },
  "sectionAnalysis": [],
  "formattingCheck": [],
  "achievementAnalysis": {
    "score": 0,
    "detectedMetrics": [],
    "hasQuantifiableResults": false,
    "suggestion": "Consider adding measurable results to your experience bullets where possible.",
    "examples": []
  },
  "actionVerbAnalysis": {
    "detectedWeakVerbs": [],
    "generalAdvice": "Replace passive responsibility language with strong action verbs."
  },
  "strengths": [],
  "improvements": [],
  "recommendations": []
}
`;

      const contents: any[] = [];

      if (
        fileBase64 &&
        fileMimeType === 'application/pdf'
      ) {
        contents.push({
          inlineData: {
            mimeType: 'application/pdf',
            data: fileBase64,
          },
        });
      }

      contents.push({
        text: prompt,
      });

      const geminiResponse =
        await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

      const responseText =
        geminiResponse.text?.trim() || '{}';

      const parsedJson = JSON.parse(responseText);

      parsedJson.isDemo = false;
      parsedJson.fileName = safeFileName;
      parsedJson.targetJobTitle = safeTitle;
      parsedJson.analyzedAt =
        new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

      return res.json({
        result: parsedJson,
        source: 'gemini-ai',
      });
    } catch (aiError) {
      console.warn(
        'Gemini analysis error. Using local analyzer:',
        aiError
      );

      const fallbackResult =
        runLocalATSAnalysis(
          textToAnalyze,
          safeTitle,
          safeJobDesc,
          safeFileName,
          false
        );

      return res.json({
        result: fallbackResult,
        source: 'fallback-engine',
      });
    }
  } catch (error) {
    console.error(
      'Server error handling /api/analyze:',
      error
    );

    return res.status(500).json({
      error:
        "We couldn't complete the analysis. Please check your inputs and try again.",
    });
  }
});

/* =========================
   START SERVER
========================= */

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } =
      await import('vite');

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(
      process.cwd(),
      'dist'
    );

    app.use(express.static(distPath));

    app.get('*', (_req, res) => {
      res.sendFile(
        path.join(distPath, 'index.html')
      );
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(
      `ResumeIQ Server listening on port ${PORT}`
    );
    console.log(
      `Health: http://localhost:${PORT}/api/health`
    );
    console.log(
      `Jobs: http://localhost:${PORT}/api/jobs`
    );
  });
}

startServer().catch((error) => {
  console.error(
    'Failed to start ResumeIQ server:',
    error
  );
  process.exit(1);
});