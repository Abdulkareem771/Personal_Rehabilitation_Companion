import type { ClinicalRule, ClinicalContext, RuleOutput } from "./types";
import { calculateConfidence, type EvidenceCriterion } from "./confidence";

export const acuteCapsuleGuardingRule: ClinicalRule = {
  id: "SAFETY-01",
  name: "Acute Anterior Capsule Guarding",
  category: "shoulder",
  priority: "safety-override",
  condition: (ctx: ClinicalContext) => ctx.painLevel >= 5 || ctx.shoulderStatus === "painful",
  evaluate: (ctx: ClinicalContext): RuleOutput => {
    const criteria: EvidenceCriterion[] = [
      { label: "Resting or active pain rating >= 5/10", weight: 50, isMet: (c) => c.painLevel >= 5 },
      { label: "Reported painful or guarded joint capsule", weight: 30, isMet: (c) => c.shoulderStatus === "painful" || c.shoulderStatus === "guarded" },
      { label: "Elevated systemic fatigue (>= 6/10)", weight: 20, isMet: (c) => c.fatigueLevel >= 6 },
    ];
    const { confidencePct, metLabels, missingLabels } = calculateConfidence(ctx, criteria);

    return {
      title: "Acute Joint Capsule Guarding Detected",
      actionDirective: "SAFETY OVERRIDE: Replace overhead abduction exercises with passive gravity pendulums and cryotherapy today.",
      priority: "safety-override",
      confidencePct,
      trace: {
        triggeredRuleId: "SAFETY-01",
        ruleName: "Acute Anterior Capsule Guarding",
        evidenceMet: metLabels,
        evidenceMissing: missingLabels,
        whyExplanation: `Pain level ${ctx.painLevel}/10 indicates synovial joint irritation. Pushing overhead resistance during acute flare-ups risks supraspinatus impingement.`,
      },
      workoutModified: true,
      modificationDetail: "All resistance blocks replaced with 5-minute passive pendulums and isometric external rotation holds.",
    };
  },
};

export const subluxationInstabilityRule: ClinicalRule = {
  id: "SAFETY-02",
  name: "Glenohumeral Instability & Subluxation Warning",
  category: "shoulder",
  priority: "medical-warning",
  condition: (ctx: ClinicalContext) => ctx.shoulderStatus === "subluxation" || ctx.shoulderStatus === "clicking",
  evaluate: (ctx: ClinicalContext): RuleOutput => {
    const criteria: EvidenceCriterion[] = [
      { label: "Sensation of joint slipping / subluxation", weight: 60, isMet: (c) => c.shoulderStatus === "subluxation" },
      { label: "Audible clicking or catching sensation", weight: 40, isMet: (c) => c.shoulderStatus === "clicking" },
    ];
    const { confidencePct, metLabels, missingLabels } = calculateConfidence(ctx, criteria);

    return {
      title: "Glenohumeral Instability Alert",
      actionDirective: "MEDICAL WARNING: Strictly keep elbow tucked against ribcage during external rotations. Avoid end-range abduction above 90°.",
      priority: "medical-warning",
      confidencePct,
      trace: {
        triggeredRuleId: "SAFETY-02",
        ruleName: "Glenohumeral Instability & Subluxation Warning",
        evidenceMet: metLabels,
        evidenceMissing: missingLabels,
        whyExplanation: "Bankart lesions or capsule laxity allow the humeral head to translate anteriorly when the arm reaches end-range abduction and external rotation.",
      },
      workoutModified: true,
      modificationDetail: "End-range external rotation restricted to scapular plane (0° abduction).",
    };
  },
};

export const safetyRules: ClinicalRule[] = [
  acuteCapsuleGuardingRule,
  subluxationInstabilityRule,
];
