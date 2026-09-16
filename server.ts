import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { runLocalATSAnalysis } from './src/services/localAnalyzer';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasGemini = Boolean(getGeminiClient());
  res.json({ status: 'ok', hasGeminiKey: hasGemini, timestamp: new Date().toISOString() });
});

// Resume analysis endpoint
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
      return res.status(400).json({ error: 'Please enter the target job title.' });
    }
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ error: 'Please paste the job description before analyzing.' });
    }
    if (!resumeText && !fileBase64) {
      return res.status(400).json({ error: 'Please upload a PDF or DOCX file.' });
    }

    const safeTitle = targetJobTitle.trim();
    const safeJobDesc = jobDescription.trim();
    const safeFileName = fileName || 'Uploaded_Resume.pdf';
    const textToAnalyze = resumeText || '';

    // If client requested demo mode or no Gemini API key is configured
    const ai = getGeminiClient();

    if (forceDemo || !ai) {
      const localResult = runLocalATSAnalysis(
        textToAnalyze,
        safeTitle,
        safeJobDesc,
        safeFileName,
        true // marked as demo
      );
      return res.json({ result: localResult, source: 'heuristic-engine' });
    }

    // Use Gemini 3.8 Flash for deep semantic ATS parsing
    try {
      const prompt = `You are a world-class ATS (Applicant Tracking System) and Senior Technical Recruiter.
Analyze the following resume against the target job title and job description.

Target Job Title: ${safeTitle}
Job Description:
${safeJobDesc}

Resume Text:
${textToAnalyze.slice(0, 15000)}

Scoring Model Rules (Strictly calculate the overall score 0-100 based on weighted categories):
1. Keyword Match (25% weight): evaluate exact and semantic keyword overlap.
2. Skills Match (20% weight): evaluate hard and soft skills required in JD vs shown in resume.
3. Job Title Alignment (10% weight): evaluate alignment between target job title and resume titles/summary.
4. Experience Relevance (15% weight): evaluate relevance of experience bullets to JD responsibilities.
5. Resume Structure (10% weight): presence of standard ATS sections (Summary, Skills, Experience, Education).
6. Formatting Compatibility (10% weight): linear text layout, standard headings, no messy tables/graphics.
7. Achievements & Impact (5% weight): presence of quantified metrics (%, $, numbers, outcomes).
8. Overall Job Alignment (5% weight): seniority, tone, domain fit.

Return ONLY a JSON object with this exact structure:
{
  "score": <number 0-100 calculated from weighted categories>,
  "scoreInterpretation": <"Excellent" | "Good" | "Needs Improvement" | "Poor">,
  "summary": {
    "overview": "<concise 2-sentence summary>",
    "whatItDoesWell": "<key strengths>",
    "whatIsPreventingHigherScore": "<main gaps>",
    "mostImportantChangesFirst": "<top priority fixes>"
  },
  "categoryScores": {
    "keywordMatch": { "name": "Keyword Match", "weight": 25, "score": <number 0-100>, "explanation": "<short explanation>" },
    "skillsMatch": { "name": "Skills Match", "weight": 20, "score": <number 0-100>, "explanation": "<short explanation>" },
    "jobTitleAlignment": { "name": "Job Title Alignment", "weight": 10, "score": <number 0-100>, "explanation": "<short explanation>" },
    "experienceRelevance": { "name": "Experience Relevance", "weight": 15, "score": <number 0-100>, "explanation": "<short explanation>" },
    "resumeStructure": { "name": "Resume Structure", "weight": 10, "score": <number 0-100>, "explanation": "<short explanation>" },
    "formattingCompatibility": { "name": "Formatting Compatibility", "weight": 10, "score": <number 0-100>, "explanation": "<short explanation>" },
    "achievementsImpact": { "name": "Achievements & Impact", "weight": 5, "score": <number 0-100>, "explanation": "<short explanation>" },
    "overallAlignment": { "name": "Overall Job Alignment", "weight": 5, "score": <number 0-100>, "explanation": "<short explanation>" }
  },
  "matchedKeywords": [ { "keyword": "<keyword>", "frequencyInResume": <number>, "frequencyInJob": <number> } ],
  "missingKeywords": [ { "keyword": "<keyword>", "importance": "<high | medium>" } ],
  "importantKeywords": [ { "keyword": "<keyword>", "importance": "high" } ],
  "skillsAnalysis": {
    "matchedSkills": [ "<skill>", ... ],
    "missingSkills": [ "<skill>", ... ],
    "recommendedSkills": [ "<skill>", ... ],
    "disclaimer": "If you genuinely have this skill, consider adding it to the appropriate section of your resume."
  },
  "sectionAnalysis": [
    {
      "name": "Contact Information",
      "status": "<Excellent | Good | Needs Improvement | Missing>",
      "qualityScore": <number 0-100>,
      "explanation": "<short text>",
      "suggestion": "<actionable advice>"
    },
    { "name": "Professional Summary", "status": "<Excellent | Good | Needs Improvement | Missing>", "qualityScore": <number>, "explanation": "<text>", "suggestion": "<text>" },
    { "name": "Skills", "status": "<Excellent | Good | Needs Improvement | Missing>", "qualityScore": <number>, "explanation": "<text>", "suggestion": "<text>" },
    { "name": "Work Experience", "status": "<Excellent | Good | Needs Improvement | Missing>", "qualityScore": <number>, "explanation": "<text>", "suggestion": "<text>" },
    { "name": "Education", "status": "<Excellent | Good | Needs Improvement | Missing>", "qualityScore": <number>, "explanation": "<text>", "suggestion": "<text>" },
    { "name": "Projects", "status": "<Excellent | Good | Needs Improvement | Missing>", "qualityScore": <number>, "explanation": "<text>", "suggestion": "<text>" },
    { "name": "Certifications", "status": "<Excellent | Good | Needs Improvement | Missing>", "qualityScore": <number>, "explanation": "<text>", "suggestion": "<text>" },
    { "name": "Achievements", "status": "<Excellent | Good | Needs Improvement | Missing>", "qualityScore": <number>, "explanation": "<text>", "suggestion": "<text>" }
  ],
  "formattingCheck": [
    { "title": "Standard Section Headings", "status": "<good | attention | issue | undetermined>", "detail": "<details>" },
    { "title": "Single or Multi-Column Layout", "status": "<good | attention | issue | undetermined>", "detail": "<details>" },
    { "title": "Complex Tables & Data Grids", "status": "<good | attention | issue | undetermined>", "detail": "<details>" },
    { "title": "Text Inside Images or Graphics", "status": "undetermined", "detail": "Unable to reliably determine from the provided document." },
    { "title": "Decorative Icons & Symbols", "status": "<good | attention | issue | undetermined>", "detail": "<details>" },
    { "title": "Information in Headers/Footers", "status": "undetermined", "detail": "Unable to reliably determine from the provided document." },
    { "title": "Date Format Consistency", "status": "<good | attention | issue | undetermined>", "detail": "<details>" },
    { "title": "Difficult-to-Parse Formatting", "status": "<good | attention | issue | undetermined>", "detail": "<details>" }
  ],
  "achievementAnalysis": {
    "score": <number 0-100>,
    "detectedMetrics": [ "<metric example>", ... ],
    "hasQuantifiableResults": <boolean>,
    "suggestion": "Consider adding measurable results to your experience bullets where possible.",
    "examples": [ "<improved bullet example>", ... ]
  },
  "actionVerbAnalysis": {
    "detectedWeakVerbs": [
      { "weakPhrase": "Responsible for managing...", "suggestedVerbs": ["Managed", "Directed", "Orchestrated"] }
    ],
    "generalAdvice": "Replace passive responsibility language with strong action verbs."
  },
  "strengths": [ "<strength 1>", "<strength 2>", "<strength 3>", "<strength 4>" ],
  "improvements": [ "<improvement 1>", "<improvement 2>", "<improvement 3>", "<improvement 4>" ],
  "recommendations": [
    {
      "title": "<recommendation title>",
      "whatIsMissingOrWeak": "<explanation>",
      "whyItMatters": "<explanation>",
      "whatUserCanImprove": "<practical guidance>"
    }
  ]
}`;

      const contents: any[] = [];
      if (fileBase64 && fileMimeType === 'application/pdf') {
        contents.push({
          inlineData: {
            mimeType: 'application/pdf',
            data: fileBase64,
          },
        });
      }
      contents.push({ text: prompt });

      const geminiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = geminiResponse.text?.trim() || '{}';
      const parsedJson = JSON.parse(responseText);

      parsedJson.isDemo = false;
      parsedJson.fileName = safeFileName;
      parsedJson.targetJobTitle = safeTitle;
      parsedJson.analyzedAt = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      return res.json({ result: parsedJson, source: 'gemini-ai' });
    } catch (aiError) {
      console.warn('Gemini analysis error, utilizing intelligent local analyzer:', aiError);
      const fallbackResult = runLocalATSAnalysis(
        textToAnalyze,
        safeTitle,
        safeJobDesc,
        safeFileName,
        false
      );
      return res.json({ result: fallbackResult, source: 'fallback-engine' });
    }
  } catch (error) {
    console.error('Server error handling /api/analyze:', error);
    return res.status(500).json({
      error: "We couldn't complete the analysis. Please check your inputs and try again.",
    });
  }
});

// Setup Vite development middleware or static production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ResumeIQ Server listening on port ${PORT}`);
  });
}

startServer();
