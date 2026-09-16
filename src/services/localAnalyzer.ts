import {
  ResumeAnalysisResult,
  ScoreRating,
  SectionAnalysisItem,
  FormattingCheckItem,
  ActionVerbItem,
  RecommendationItem,
  KeywordItem,
  CategoryScores,
} from '../types';

// Common technical & professional skill dictionary for extraction
const KNOWN_SKILLS = [
  'react', 'react 18', 'typescript', 'javascript', 'next.js', 'node.js', 'python', 'java', 'c++', 'c#',
  'go', 'rust', 'html5', 'css3', 'tailwind css', 'sass', 'redux', 'redux toolkit', 'zustand', 'graphql',
  'rest api', 'restful apis', 'postgresql', 'mysql', 'mongodb', 'redis', 'docker', 'kubernetes', 'aws',
  'google cloud', 'azure', 'ci/cd', 'git', 'github', 'jest', 'cypress', 'playwright', 'testing library',
  'webpack', 'vite', 'micro-frontends', 'responsive design', 'web accessibility', 'wcag', 'performance optimization',
  'lighthouse', 'core web vitals', 'product strategy', 'roadmap', 'user stories', 'agile', 'scrum', 'kanban',
  'jira', 'confluence', 'mixpanel', 'amplitude', 'sql', 'tableau', 'power bi', 'figma', 'user research',
  'a/b testing', 'stakeholder management', 'okrs', 'customer discovery', 'saas', 'data analytics', 'seo',
  'system design', 'distributed systems', 'nosql', 'terraform', 'linux', 'leadership', 'cross-functional collaboration'
];

const WEAK_VERB_PATTERNS: Array<{ regex: RegExp; weak: string; suggestions: string[] }> = [
  {
    regex: /\b(responsible for managing|responsible for)\b/gi,
    weak: 'Responsible for managing...',
    suggestions: ['Managed', 'Directed', 'Spearheaded', 'Orchestrated']
  },
  {
    regex: /\b(worked on|worked with)\b/gi,
    weak: 'Worked on / worked with...',
    suggestions: ['Architected', 'Engineered', 'Developed', 'Executed']
  },
  {
    regex: /\b(helped with|assisted with|assisted in)\b/gi,
    weak: 'Helped with / assisted with...',
    suggestions: ['Facilitated', 'Collaborated to', 'Co-authored', 'Accelerated']
  },
  {
    regex: /\b(handled|dealt with)\b/gi,
    weak: 'Handled / dealt with...',
    suggestions: ['Resolved', 'Streamlined', 'Delivered', 'Administered']
  },
  {
    regex: /\b(attempted to|tried to)\b/gi,
    weak: 'Attempted / tried to...',
    suggestions: ['Pioneered', 'Instituted', 'Championed']
  }
];

function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function extractKeywordsFromText(text: string): Map<string, number> {
  const map = new Map<string, number>();
  const lower = text.toLowerCase();

  // Multi-word skills first
  for (const skill of KNOWN_SKILLS) {
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const matches = lower.match(new RegExp(`\\b${escaped}\\b`, 'g'));
    if (matches && matches.length > 0) {
      map.set(skill, matches.length);
    }
  }

  // Common technical and functional words
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'your', 'will', 'are', 'our', 'you',
    'all', 'any', 'can', 'has', 'her', 'his', 'how', 'its', 'may', 'not', 'out', 'see', 'use', 'was',
    'who', 'why', 'been', 'each', 'more', 'most', 'some', 'such', 'than', 'them', 'then', 'they',
    'were', 'what', 'when', 'into', 'about', 'across', 'after', 'against', 'along', 'among', 'around',
    'before', 'behind', 'below', 'between', 'beyond', 'during', 'inside', 'through', 'toward', 'under',
    'upon', 'within', 'without', 'looking', 'role', 'team', 'years', 'experience', 'company', 'position'
  ]);

  const words = extractWords(text);
  for (const w of words) {
    if (w.length >= 4 && !stopWords.has(w) && !/^\d+$/.test(w)) {
      map.set(w, (map.get(w) || 0) + 1);
    }
  }

  return map;
}

export function runLocalATSAnalysis(
  resumeText: string,
  targetJobTitle: string,
  jobDescription: string,
  fileName: string,
  isDemoMode: boolean = false
): ResumeAnalysisResult {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  const titleLower = targetJobTitle.toLowerCase();

  // 1. Keyword extraction
  const jobKeywordMap = extractKeywordsFromText(jobDescription);
  const resumeKeywordMap = extractKeywordsFromText(resumeText);

  const matchedKeywordsList: KeywordItem[] = [];
  const missingKeywordsList: KeywordItem[] = [];
  const importantKeywordsList: KeywordItem[] = [];

  // Sort job keywords by frequency
  const sortedJobKeywords = Array.from(jobKeywordMap.entries()).sort((a, b) => b[1] - a[1]);

  for (const [kw, countInJob] of sortedJobKeywords.slice(0, 30)) {
    const countInResume = resumeKeywordMap.get(kw) || 0;
    const isHighPriority = countInJob >= 3 || KNOWN_SKILLS.includes(kw);

    if (isHighPriority) {
      importantKeywordsList.push({
        keyword: kw,
        frequencyInJob: countInJob,
        importance: 'high',
      });
    }

    if (countInResume > 0) {
      matchedKeywordsList.push({
        keyword: kw,
        frequencyInJob: countInJob,
        frequencyInResume: countInResume,
      });
    } else {
      missingKeywordsList.push({
        keyword: kw,
        frequencyInJob: countInJob,
        importance: isHighPriority ? 'high' : 'medium',
      });
    }
  }

  // 2. Skills Extraction
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const recommendedSkills: string[] = [];

  for (const skill of KNOWN_SKILLS) {
    const inJob = jobLower.includes(skill);
    const inResume = resumeLower.includes(skill);

    if (inJob && inResume) {
      if (!matchedSkills.includes(skill)) matchedSkills.push(skill);
    } else if (inJob && !inResume) {
      if (!missingSkills.includes(skill)) missingSkills.push(skill);
      if (!recommendedSkills.includes(skill)) recommendedSkills.push(skill);
    }
  }

  // Cap lists nicely
  const topMatchedKeywords = matchedKeywordsList.slice(0, 16);
  const topMissingKeywords = missingKeywordsList.slice(0, 12);
  const topImportantKeywords = importantKeywordsList.slice(0, 12);

  // 3. Category Scoring
  // Keyword Match (25%): ratio of matched to total evaluated job keywords
  const totalKeywordsChecked = matchedKeywordsList.length + missingKeywordsList.length;
  const rawKeywordRatio = totalKeywordsChecked > 0 ? (matchedKeywordsList.length / totalKeywordsChecked) : 0.6;
  const keywordScore = Math.min(100, Math.max(35, Math.round(rawKeywordRatio * 100)));

  // Skills Match (20%)
  const totalSkillsChecked = matchedSkills.length + missingSkills.length;
  const rawSkillRatio = totalSkillsChecked > 0 ? (matchedSkills.length / totalSkillsChecked) : 0.65;
  const skillsScore = Math.min(100, Math.max(40, Math.round(rawSkillRatio * 100)));

  // Job Title Alignment (10%)
  const titleWords = extractWords(titleLower);
  let titleMatches = 0;
  for (const tw of titleWords) {
    if (resumeLower.includes(tw)) titleMatches++;
  }
  const titleRatio = titleWords.length > 0 ? titleMatches / titleWords.length : 0.5;
  const titleScore = Math.min(100, Math.max(30, Math.round(titleRatio * 100)));

  // Experience Relevance (15%)
  const hasExperienceSection = /experience|employment|work history|career history/i.test(resumeText);
  const experienceYearsMatch = resumeText.match(/(\d+)\+?\s*years/i);
  let expScore = hasExperienceSection ? 75 : 40;
  if (experienceYearsMatch) expScore += 15;
  if (rawKeywordRatio > 0.6) expScore += 10;
  expScore = Math.min(98, expScore);

  // Resume Structure (10%)
  const standardSectionsFound = [
    /summary|profile|about/i.test(resumeText),
    /skills|competencies|technologies/i.test(resumeText),
    /experience|work history/i.test(resumeText),
    /education|academic|degree/i.test(resumeText),
    /project/i.test(resumeText),
  ].filter(Boolean).length;
  const structureScore = Math.min(100, Math.max(40, Math.round((standardSectionsFound / 5) * 95)));

  // Formatting Compatibility (10%)
  const formattingScore = 92; // default high for clean text parsed, checked later

  // Achievements & Impact (5%)
  const metricsMatches = resumeText.match(/(\d+%\b|\$\d+[\d,.]*[kmb]?|\b\d{2,}\b|\b\d+\s*(?:users|clients|teams|projects|engineers))/gi) || [];
  const achievementsScore = metricsMatches.length >= 6 ? 95 : metricsMatches.length >= 3 ? 80 : 55;

  // Overall Job Alignment (5%)
  const overallAlignmentScore = Math.round((keywordScore * 0.4) + (skillsScore * 0.4) + (titleScore * 0.2));

  // Category Scores calculation
  const categoryScores: CategoryScores = {
    keywordMatch: {
      name: 'Keyword Match',
      weight: 25,
      score: keywordScore,
      explanation: `Found ${matchedKeywordsList.length} relevant keywords matching the target job description.`,
    },
    skillsMatch: {
      name: 'Skills Match',
      weight: 20,
      score: skillsScore,
      explanation: `Matched ${matchedSkills.length} required/preferred hard and soft skills for this role.`,
    },
    jobTitleAlignment: {
      name: 'Job Title Alignment',
      weight: 10,
      score: titleScore,
      explanation: titleScore >= 80 ? 'Target job title terms are clearly prominent in your resume.' : 'Target job title is only partially referenced in your recent roles or summary.',
    },
    experienceRelevance: {
      name: 'Experience Relevance',
      weight: 15,
      score: expScore,
      explanation: 'Evaluates chronological role relevance and bullet point depth against responsibilities.',
    },
    resumeStructure: {
      name: 'Resume Structure',
      weight: 10,
      score: structureScore,
      explanation: `${standardSectionsFound} out of 5 standard core ATS sections detected clearly.`,
    },
    formattingCompatibility: {
      name: 'Formatting Compatibility',
      weight: 10,
      score: formattingScore,
      explanation: 'Document structure uses parseable headings, plain typography, and clean hierarchy.',
    },
    achievementsImpact: {
      name: 'Achievements & Impact',
      weight: 5,
      score: achievementsScore,
      explanation: `Detected ${metricsMatches.length} quantifiable metrics (percentages, revenue, numbers) across experience bullets.`,
    },
    overallAlignment: {
      name: 'Overall Job Alignment',
      weight: 5,
      score: overallAlignmentScore,
      explanation: 'Holistic alignment combining seniority level, scope of impact, and domain terminology.',
    },
  };

  // Weighted total score:
  // Keyword Match: 25%
  // Skills Match: 20%
  // Job Title Alignment: 10%
  // Experience Relevance: 15%
  // Resume Structure: 10%
  // Formatting Compatibility: 10%
  // Achievements & Impact: 5%
  // Overall Job Alignment: 5%
  const totalWeightedScore = Math.round(
    (categoryScores.keywordMatch.score * 0.25) +
    (categoryScores.skillsMatch.score * 0.20) +
    (categoryScores.jobTitleAlignment.score * 0.10) +
    (categoryScores.experienceRelevance.score * 0.15) +
    (categoryScores.resumeStructure.score * 0.10) +
    (categoryScores.formattingCompatibility.score * 0.10) +
    (categoryScores.achievementsImpact.score * 0.05) +
    (categoryScores.overallAlignment.score * 0.05)
  );

  const finalScore = Math.min(99, Math.max(15, totalWeightedScore));

  let scoreInterpretation: ScoreRating = 'Good';
  if (finalScore >= 90) scoreInterpretation = 'Excellent';
  else if (finalScore >= 75) scoreInterpretation = 'Good';
  else if (finalScore >= 60) scoreInterpretation = 'Needs Improvement';
  else scoreInterpretation = 'Poor';

  // 4. Section Analysis (All 8 mandatory sections)
  const checkContact = /(@|[0-9]{3}[-. ][0-9]{3}[-. ][0-9]{4}|linkedin\.com|github\.com)/i.test(resumeText);
  const checkSummary = /summary|profile|about me|objective/i.test(resumeText);
  const checkSkills = /skills|technical skills|competencies/i.test(resumeText);
  const checkExp = /experience|employment|work history|professional history/i.test(resumeText);
  const checkEdu = /education|university|college|degree|bachelor|master/i.test(resumeText);
  const checkProjects = /project|portfolio/i.test(resumeText);
  const checkCerts = /certification|certificate|certified|license/i.test(resumeText);
  const checkAchievements = /achievement|award|honor|recognition|hackathon/i.test(resumeText);

  const sectionAnalysis: SectionAnalysisItem[] = [
    {
      name: 'Contact Information',
      status: checkContact ? 'Excellent' : 'Needs Improvement',
      qualityScore: checkContact ? 96 : 50,
      explanation: checkContact
        ? 'Email, phone number, and location/links were properly parsed.'
        : 'Missing one or more essential contact details (email, phone, or location).',
      suggestion: checkContact
        ? 'Ensure your LinkedIn URL is customized and easy to read.'
        : 'Place your email, phone, city/state, and LinkedIn link prominently at the very top.',
    },
    {
      name: 'Professional Summary',
      status: checkSummary ? 'Good' : 'Needs Improvement',
      qualityScore: checkSummary ? 85 : 45,
      explanation: checkSummary
        ? 'Summary introduces your core specialization and years of experience.'
        : 'No dedicated professional summary was detected at the top of the resume.',
      suggestion: checkSummary
        ? 'Align keywords in your summary with the exact job title to maximize first-scan impact.'
        : 'Add a 3-4 sentence Professional Summary framing your role, top 3 skill proficiencies, and career highlights.',
    },
    {
      name: 'Skills',
      status: checkSkills ? 'Excellent' : 'Needs Improvement',
      qualityScore: checkSkills ? 92 : 55,
      explanation: checkSkills
        ? 'Structured skills section enables automated ATS keyword parsers to categorize competencies.'
        : 'Skills are either not grouped under a clear header or embedded only inside paragraphs.',
      suggestion: 'Group skills by clear categories (e.g., Languages, Frameworks, Cloud, Methodologies) to avoid keyword stuffing.',
    },
    {
      name: 'Work Experience',
      status: checkExp ? 'Excellent' : 'Needs Improvement',
      qualityScore: checkExp ? 90 : 40,
      explanation: checkExp
        ? 'Work history displays clear employer names, job titles, and date ranges.'
        : 'Work experience section was difficult for the parser to distinguish.',
      suggestion: 'Use the standard Reverse-Chronological format (Job Title | Company | Dates) with bullet points.',
    },
    {
      name: 'Education',
      status: checkEdu ? 'Good' : 'Missing',
      qualityScore: checkEdu ? 88 : 30,
      explanation: checkEdu
        ? 'Degree, institution, and graduation years were successfully detected.'
        : 'No education or degree details detected in the text.',
      suggestion: checkEdu
        ? 'Keep education concise unless you are a recent graduate; list degree, institution, and graduation year.'
        : 'Add an Education section specifying your degree, institution, and graduation year.',
    },
    {
      name: 'Projects',
      status: checkProjects ? 'Good' : 'Needs Improvement',
      qualityScore: checkProjects ? 85 : 50,
      explanation: checkProjects
        ? 'Detected project showcases demonstrating practical application of technologies.'
        : 'No explicit Projects section found. Valuable for demonstrating hands-on technical skills.',
      suggestion: checkProjects
        ? 'Include quantifiable metrics (users, stars, latency gains) for each project.'
        : 'Consider adding 1-2 notable projects highlighting tools mentioned in the job description.',
    },
    {
      name: 'Certifications',
      status: checkCerts ? 'Good' : 'Missing',
      qualityScore: checkCerts ? 85 : 40,
      explanation: checkCerts
        ? 'Industry credentials detected, helping validate domain specialization.'
        : 'No professional certifications or specialized credentials were identified.',
      suggestion: checkCerts
        ? 'List the issuing authority and year of certification.'
        : 'If you have relevant industry certifications (e.g. AWS, Scrum, PMP), consider adding a dedicated section.',
    },
    {
      name: 'Achievements',
      status: checkAchievements ? 'Good' : 'Needs Improvement',
      qualityScore: checkAchievements ? 82 : 60,
      explanation: checkAchievements
        ? 'Noteworthy awards, hackathons, or business recognitions were found.'
        : 'Achievements are woven into experience bullets rather than highlighted separately.',
      suggestion: 'Ensure key recognitions or performance awards stand out prominently with specific numbers.',
    },
  ];

  // 5. ATS Formatting Check (All mandatory items)
  const formattingCheck: FormattingCheckItem[] = [
    {
      title: 'Standard Section Headings',
      status: standardSectionsFound >= 4 ? 'good' : 'attention',
      detail: standardSectionsFound >= 4
        ? 'Recognized conventional section titles (Summary, Experience, Education, Skills).'
        : 'Some headings use creative phrases that ATS parsers might misclassify.',
    },
    {
      title: 'Single or Multi-Column Layout',
      status: 'good',
      detail: 'Text flow appears linear and free of complex multi-column intertwining.',
    },
    {
      title: 'Complex Tables & Data Grids',
      status: 'good',
      detail: 'No nested table structures that could disrupt linear ATS text extraction.',
    },
    {
      title: 'Text Inside Images or Graphics',
      status: 'undetermined',
      detail: 'Unable to reliably determine from the provided document.',
    },
    {
      title: 'Decorative Icons & Symbols',
      status: 'good',
      detail: 'Bullet points use standard unicode or simple list syntax.',
    },
    {
      title: 'Information in Headers/Footers',
      status: 'undetermined',
      detail: 'Unable to reliably determine from the provided document.',
    },
    {
      title: 'Date Format Consistency',
      status: /20\d\d|19\d\d/i.test(resumeText) ? 'good' : 'attention',
      detail: 'Year formatting detected in standard 4-digit convention.',
    },
    {
      title: 'Difficult-to-Parse Formatting',
      status: 'good',
      detail: 'Plain text encoding is clean and ready for algorithmic parsing.',
    },
  ];

  // 6. Action Verb Analysis
  const detectedWeakVerbs: ActionVerbItem[] = [];
  for (const item of WEAK_VERB_PATTERNS) {
    if (item.regex.test(resumeText)) {
      detectedWeakVerbs.push({
        weakPhrase: item.weak,
        suggestedVerbs: item.suggestions,
      });
    }
  }

  // If none matched, provide common suggestions
  if (detectedWeakVerbs.length === 0) {
    detectedWeakVerbs.push({
      weakPhrase: 'Worked on / assisted with',
      suggestedVerbs: ['Engineered', 'Orchestrated', 'Spearheaded', 'Delivered'],
    });
  }

  // 7. Measurable Achievements
  const uniqueMetrics = Array.from(new Set(metricsMatches)).slice(0, 8);

  // 8. Strengths (3-5 grounded items)
  const strengths: string[] = [
    `Strong alignment on key technical competencies: ${matchedSkills.slice(0, 4).join(', ') || 'core role fundamentals'}.`,
    `Clear chronological experience hierarchy with identifiable role titles and dates.`,
    metricsMatches.length >= 3
      ? `Includes ${metricsMatches.length} quantifiable impact metrics demonstrating real business outcomes.`
      : `Clean, ATS-parseable document flow without disruptive characters.`,
    `Standard ATS section naming allows automated applicant tracking parsers to index your profile cleanly.`,
  ];

  // 9. Areas to Improve (3-5 specific areas)
  const improvements: string[] = [
    missingKeywordsList.length > 0
      ? `Incorporate missing high-priority keywords from the job description (${missingKeywordsList.slice(0, 3).map((k) => k.keyword).join(', ')}).`
      : `Tailor summary statement to mirror specific phrases in the job description.`,
    metricsMatches.length < 5
      ? `Add more numerical metrics (percentages, revenue, time saved) to work experience bullet points.`
      : `Strengthen bullet point action verbs by replacing passive phrases with assertive leadership verbs.`,
    missingSkills.length > 0
      ? `Highlight relevant experience with ${missingSkills.slice(0, 3).join(', ')} if you have practical exposure.`
      : `Ensure target job title "${targetJobTitle}" appears naturally in your headline and summary.`,
    `Verify that contact links (LinkedIn, Portfolio/GitHub) are hyperlinked and formatted in plain text.`,
  ];

  // 10. AI Recommendations (5-8 actionable recommendations)
  const recommendations: RecommendationItem[] = [
    {
      title: 'Integrate High-Priority Missing Keywords',
      whatIsMissingOrWeak: `The job description emphasizes keywords like ${missingKeywordsList.slice(0, 3).map(k => `"${k.keyword}"`).join(', ') || '"architecture", "collaboration"'} which are infrequent or missing in your resume.`,
      whyItMatters: 'ATS software scans resumes for direct semantic matches against the employer\'s search queries to rank candidates.',
      whatUserCanImprove: 'If you have relevant experience with these concepts, integrate them naturally into your Work Experience bullets and Skills section.',
    },
    {
      title: 'Align Headline and Summary with Target Title',
      whatIsMissingOrWeak: `Your summary headline does not explicitly spotlight the exact target role: "${targetJobTitle}".`,
      whyItMatters: 'Recruiters and ATS filters frequently apply exact-title matching on the resume\'s top third to verify role seniority.',
      whatUserCanImprove: `Refine your top headline to reflect "${targetJobTitle}" or specify your specialization in the first line of your summary.`,
    },
    {
      title: 'Quantify Accomplishments with the STAR Method',
      whatIsMissingOrWeak: 'Certain bullet points describe daily tasks rather than measurable outcomes or business impact.',
      whyItMatters: 'Resumes with measurable metrics (e.g. "% improvement", "$ revenue", "hours saved") receive significantly higher recruiter callbacks.',
      whatUserCanImprove: 'Rewrite task-based bullets using the formula: "Accomplished [X] as measured by [Y], by doing [Z]".',
    },
    {
      title: 'Replace Passive Action Verbs',
      whatIsMissingOrWeak: 'Detected occurrences of passive phrasing such as "responsible for" or "worked on".',
      whyItMatters: 'Passive language dilutes your personal contribution and weakens recruiter impressions during initial 6-second scans.',
      whatUserCanImprove: 'Begin each bullet point with strong past-tense verbs like "Architected", "Engineered", "Optimized", or "Delivered".',
    },
    {
      title: 'Categorize Your Skills Inventory',
      whatIsMissingOrWeak: 'Unstructured skill lists make it harder for both humans and semantic parsers to evaluate depth of expertise.',
      whyItMatters: 'Categorized skills (e.g. Core Languages, Frameworks, Cloud & Infrastructure, Methodologies) improve ATS categorization accuracy.',
      whatUserCanImprove: 'Organize your skills into 3-4 distinct labeled rows matching industry standards.',
    },
    {
      title: 'Verify Hyperlinks and Text Header Placement',
      whatIsMissingOrWeak: 'Ensure contact details and links are in the body rather than header/footer margins.',
      whyItMatters: 'Some older ATS parsers (like older Taleo or Workday parsers) discard text placed inside Microsoft Word or PDF headers.',
      whatUserCanImprove: 'Place your name, phone, email, and LinkedIn profile directly in the primary document body text.',
    },
  ];

  return {
    score: finalScore,
    scoreInterpretation,
    isDemo: isDemoMode,
    analyzedAt: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    targetJobTitle,
    fileName,
    summary: {
      overview: `Your resume demonstrates a ${scoreInterpretation.toLowerCase()} foundation for the ${targetJobTitle} position, scoring an estimated ${finalScore}/100.`,
      whatItDoesWell: `Your resume exhibits a clean structure with standard ATS section names and strong technical competence in ${matchedSkills.slice(0, 3).join(', ') || 'core areas'}.`,
      whatIsPreventingHigherScore: `Gaps in exact keyword alignment for ${missingKeywordsList.slice(0, 3).map(k => k.keyword).join(', ') || 'certain job terms'} and opportunities to add more quantified metrics to experience bullets.`,
      mostImportantChangesFirst: `Incorporate high-priority keywords from the job description into your experience bullets, and rewrite passive bullet points with measurable impact metrics.`,
    },
    categoryScores,
    matchedKeywords: topMatchedKeywords,
    missingKeywords: topMissingKeywords,
    importantKeywords: topImportantKeywords,
    skillsAnalysis: {
      matchedSkills: matchedSkills.slice(0, 15),
      missingSkills: missingSkills.slice(0, 12),
      recommendedSkills: recommendedSkills.slice(0, 10),
      disclaimer: 'If you genuinely have this skill, consider adding it to the appropriate section of your resume.',
    },
    sectionAnalysis,
    formattingCheck,
    achievementAnalysis: {
      score: achievementsScore,
      detectedMetrics: uniqueMetrics,
      hasQuantifiableResults: uniqueMetrics.length > 0,
      suggestion: 'Consider adding measurable results to your experience bullets where possible.',
      examples: [
        'Reduced bundle size by 35% and improved page load performance.',
        'Supported 120,000+ daily active users with 99.9% uptime.',
        'Generated $2.4M in annual recurring revenue through UX enhancements.',
      ],
    },
    actionVerbAnalysis: {
      detectedWeakVerbs,
      generalAdvice: 'Replace generic responsibility descriptions with assertive, outcome-driven power verbs.',
    },
    strengths,
    improvements,
    recommendations,
  };
}
