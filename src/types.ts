export type ScoreRating = 'Excellent' | 'Good' | 'Needs Improvement' | 'Poor';

export type SectionStatus = 'Excellent' | 'Good' | 'Needs Improvement' | 'Missing';

export type FormattingStatus = 'good' | 'attention' | 'issue' | 'undetermined';

export interface CategoryScoreItem {
  name: string;
  weight: number;
  score: number;
  explanation: string;
}

export interface CategoryScores {
  keywordMatch: CategoryScoreItem;
  skillsMatch: CategoryScoreItem;
  jobTitleAlignment: CategoryScoreItem;
  experienceRelevance: CategoryScoreItem;
  resumeStructure: CategoryScoreItem;
  formattingCompatibility: CategoryScoreItem;
  achievementsImpact: CategoryScoreItem;
  overallAlignment: CategoryScoreItem;
}

export interface KeywordItem {
  keyword: string;
  category?: string;
  frequencyInResume?: number;
  frequencyInJob?: number;
  importance?: 'high' | 'medium' | 'standard';
}

export interface SectionAnalysisItem {
  name:
    | 'Contact Information'
    | 'Professional Summary'
    | 'Skills'
    | 'Work Experience'
    | 'Education'
    | 'Projects'
    | 'Certifications'
    | 'Achievements';
  status: SectionStatus;
  qualityScore: number;
  explanation: string;
  suggestion: string;
}

export interface FormattingCheckItem {
  title: string;
  status: FormattingStatus;
  detail: string;
}

export interface ActionVerbItem {
  weakPhrase: string;
  suggestedVerbs: string[];
  context?: string;
}

export interface RecommendationItem {
  title: string;
  whatIsMissingOrWeak: string;
  whyItMatters: string;
  whatUserCanImprove: string;
}

export interface AnalysisSummary {
  overview: string;
  whatItDoesWell: string;
  whatIsPreventingHigherScore: string;
  mostImportantChangesFirst: string;
}

export interface ResumeAnalysisResult {
  score: number;
  scoreInterpretation: ScoreRating;
  isDemo: boolean;
  analyzedAt: string;
  targetJobTitle: string;
  fileName: string;
  summary: AnalysisSummary;
  categoryScores: CategoryScores;
  matchedKeywords: KeywordItem[];
  missingKeywords: KeywordItem[];
  importantKeywords: KeywordItem[];
  skillsAnalysis: {
    matchedSkills: string[];
    missingSkills: string[];
    recommendedSkills: string[];
    disclaimer: string;
  };
  sectionAnalysis: SectionAnalysisItem[];
  formattingCheck: FormattingCheckItem[];
  achievementAnalysis: {
    score: number;
    detectedMetrics: string[];
    hasQuantifiableResults: boolean;
    suggestion: string;
    examples: string[];
  };
  actionVerbAnalysis: {
    detectedWeakVerbs: ActionVerbItem[];
    generalAdvice: string;
  };
  strengths: string[];
  improvements: string[];
  recommendations: RecommendationItem[];
}

export interface UploadedResumeFile {
  file: File | null;
  name: string;
  size: number;
  type: string;
  content: string; // extracted text or sample text
  base64Data?: string;
}
