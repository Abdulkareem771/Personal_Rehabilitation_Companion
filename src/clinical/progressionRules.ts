import type { ClinicalRule, ClinicalContext, RuleOutput } from "./types";
import { calculateConfidence, type EvidenceCriterion } from "./confidence";

export const scapularCompetencyProgressionRule: ClinicalRule = {
  id: "PROG-01",
  name: "Scapulohumeral Rhythm Phase Promotion",
  category: "shoulder",
  priority: "progression",
  condition: (ctx: ClinicalContext) => ctx.painLevel <= 2 && ctx.rolling7DayPainAvg <= 2 && ctx.compliancePct >= 80,
  evaluate: (ctx: ClinicalContext): RuleOutput => {
    const criteria: EvidenceCriterion[] = [
      { label: "Resting pain rating <= 2/10", weight: 30, isMet: (c) => c.painLevel <= 2 },
      { label: "7-day longitudinal rolling pain <= 2/10", weight: 30, isMet: (c) => c.rolling7DayPainAvg <= 2 },
      { label: "Workout compliance >= 80%", weight: 25, isMet: (c) => c.compliancePct >= 80 },
      { label: "External rotation ROM >= 65°", weight: 15, isMet: (c) => (c.externalRotationDeg || 70) >= 65 },
    ];
    const { confidencePct, metLabels, missingLabels } = calculateConfidence(ctx, criteria);

    return {
      title: "Scapular Stabilization Competency Verified",
      actionDirective: "PROGRESSION RECOMMENDED: Ready to transition from Phase 1 Isometric Holds to Phase 2 Light Yellow Band Resistance.",
      priority: "progression",
      confidencePct,
      trace: {
        triggeredRuleId: "PROG-01",
        ruleName: "Scapulohumeral Rhythm Phase Promotion",
        evidenceMet: metLabels,
        evidenceMissing: missingLabels,
        whyExplanation: `Pain has remained stable (${ctx.rolling7DayPainAvg}/10 avg) across ${ctx.compliancePct}% protocol adherence, proving tissue adaptation.`,
      },
      workoutModified: false,
    };
  },
};

export const sleepDeficitRecoveryRule: ClinicalRule = {
  id: "REC-01",
  name: "Collagen Synthesis Sleep Deficit",
  category: "universal",
  priority: "recovery",
  condition: (ctx: ClinicalContext) => ctx.sleepHours < 6.5,
  evaluate: (ctx: ClinicalContext): RuleOutput => {
    const criteria: EvidenceCriterion[] = [
      { label: "Sleep duration < 6.5 hours", weight: 60, isMet: (c) => c.sleepHours < 6.5 },
      { label: "Elevated systemic fatigue (>= 5/10)", weight: 40, isMet: (c) => c.fatigueLevel >= 5 },
    ];
    const { confidencePct, metLabels, missingLabels } = calculateConfidence(ctx, criteria);

    return {
      title: "Suboptimal Tissue Repair Recovery",
      actionDirective: "RECOVERY OPTIMIZATION: Take an extra 60s rest between sets today and ensure 20g collagen peptides pre-workout.",
      priority: "recovery",
      confidencePct,
      trace: {
        triggeredRuleId: "REC-01",
        ruleName: "Collagen Synthesis Sleep Deficit",
        evidenceMet: metLabels,
        evidenceMissing: missingLabels,
        whyExplanation: "Growth hormone secretion peaks during deep slow-wave sleep. Sleep deprivation directly impairs collagen matrix cross-linking.",
      },
      workoutModified: false,
    };
  },
};

export const progressionRules: ClinicalRule[] = [
  scapularCompetencyProgressionRule,
  sleepDeficitRecoveryRule,
];
