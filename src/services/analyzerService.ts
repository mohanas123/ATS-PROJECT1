import { ResumeAnalysisResult, UploadedResumeFile } from '../types';
import { runLocalATSAnalysis } from './localAnalyzer';
import { extractTextFromFile, readFileAsBase64 } from '../utils/fileExtractor';

export interface AnalyzeParams {
  resumeFile: UploadedResumeFile | null;
  resumeText: string;
  targetJobTitle: string;
  jobDescription: string;
  isDemoMode?: boolean;
}

export async function analyzeResume({
  resumeFile,
  resumeText,
  targetJobTitle,
  jobDescription,
  isDemoMode = false,
}: AnalyzeParams): Promise<ResumeAnalysisResult> {
  const fileName = resumeFile?.name || 'Resume_Document.pdf';

  // Extract text if not already populated
  let fullText = resumeText;
  let fileBase64: string | undefined = resumeFile?.base64Data;
  const mimeType = resumeFile?.file?.type || (fileName.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

  if (!fullText && resumeFile?.file) {
    try {
      fullText = await extractTextFromFile(resumeFile.file);
      if (!fileBase64) {
        fileBase64 = await readFileAsBase64(resumeFile.file);
      }
    } catch (err) {
      console.warn('Text extraction error:', err);
    }
  }

  // If running in explicit demo mode
  if (isDemoMode) {
    // Artificial small delay for realistic scanning feel
    await new Promise((resolve) => setTimeout(resolve, 1400));
    return runLocalATSAnalysis(
      fullText || 'Demonstration resume content with standard engineering experience and competencies.',
      targetJobTitle,
      jobDescription,
      fileName,
      true
    );
  }

  // Attempt backend analysis with Gemini or heuristic
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeText: fullText,
        targetJobTitle,
        jobDescription,
        fileName,
        fileBase64,
        fileMimeType: mimeType,
        forceDemo: false,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.result && typeof data.result.score === 'number') {
        return data.result as ResumeAnalysisResult;
      }
    }
  } catch (apiErr) {
    console.warn('API call failed, switching to local ATS engine:', apiErr);
  }

  // Graceful fallback to client-side local analyzer
  await new Promise((resolve) => setTimeout(resolve, 800));
  return runLocalATSAnalysis(
    fullText || 'Experience in software engineering, frontend technologies, and product development.',
    targetJobTitle,
    jobDescription,
    fileName,
    false
  );
}
