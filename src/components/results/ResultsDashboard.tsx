import React from 'react';
import { ResumeAnalysisResult } from '../../types';
import { ScoreCard } from './ScoreCard';
import { ScoreBreakdown } from './ScoreBreakdown';
import { KeywordAnalysis } from './KeywordAnalysis';
import { SkillsAnalysis } from './SkillsAnalysis';
import { SectionAnalysis } from './SectionAnalysis';
import { FormattingCheck } from './FormattingCheck';
import { AchievementAnalysis } from './AchievementAnalysis';
import { ActionVerbAnalysis } from './ActionVerbAnalysis';
import { StrengthsAndImprovements } from './StrengthsAndImprovements';
import { Recommendations } from './Recommendations';
import { AnalysisSummaryCard } from './AnalysisSummaryCard';

interface ResultsDashboardProps {
  analysis: ResumeAnalysisResult;
  onReset: () => void;
  onDownloadReport: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  analysis,
  onReset,
  onDownloadReport,
}) => {
  return (
    <div id="results-dashboard" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* 1. ATS Score & Rating */}
      <div id="section-score-card">
        <ScoreCard
          score={analysis.score}
          interpretation={analysis.scoreInterpretation}
          isDemo={analysis.isDemo}
          targetJobTitle={analysis.targetJobTitle}
          fileName={analysis.fileName}
          analyzedAt={analysis.analyzedAt}
          onReset={onReset}
          onDownloadReport={onDownloadReport}
        />
      </div>

      {/* 2. Score Breakdown (8 weighted categories) */}
      <div id="section-score-breakdown">
        <ScoreBreakdown categoryScores={analysis.categoryScores} />
      </div>

      {/* 3. Keyword Analysis (Matched, Missing, Important) */}
      <div id="section-keyword-analysis">
        <KeywordAnalysis
          matchedKeywords={analysis.matchedKeywords}
          missingKeywords={analysis.missingKeywords}
          importantKeywords={analysis.importantKeywords}
        />
      </div>

      {/* 4. Skills Analysis */}
      <div id="section-skills-analysis">
        <SkillsAnalysis skillsAnalysis={analysis.skillsAnalysis} />
      </div>

      {/* 5. Resume Section Analysis (8 core sections) */}
      <div id="section-section-analysis">
        <SectionAnalysis sectionAnalysis={analysis.sectionAnalysis} />
      </div>

      {/* 6. ATS Formatting Check */}
      <div id="section-formatting-check">
        <FormattingCheck formattingCheck={analysis.formattingCheck} />
      </div>

      {/* 7. Measurable Achievements & Metrics */}
      <div id="section-achievement-analysis">
        <AchievementAnalysis achievementAnalysis={analysis.achievementAnalysis} />
      </div>

      {/* 8. Action Verb Analysis */}
      <div id="section-action-verbs">
        <ActionVerbAnalysis actionVerbAnalysis={analysis.actionVerbAnalysis} />
      </div>

      {/* 9 & 10. Strengths & Areas to Improve */}
      <div id="section-strengths-improvements">
        <StrengthsAndImprovements
          strengths={analysis.strengths}
          improvements={analysis.improvements}
        />
      </div>

      {/* 11. AI Recommendations */}
      <div id="section-recommendations">
        <Recommendations recommendations={analysis.recommendations} />
      </div>

      {/* 12. Overall Analysis Summary */}
      <div id="section-overall-summary">
        <AnalysisSummaryCard summary={analysis.summary} />
      </div>
    </div>
  );
};
