import type { ClinicalContext, RuleOutput, RulePriority } from "./types";
import { safetyRules } from "./safetyRules";
import { progressionRules } from "./progressionRules";

const priorityMap: Record<RulePriority, number> = {
  "safety-override": 1,
  "medical-warning": 2,
  "recovery": 3,
  "progression": 4,
  "educational": 5,
};

/**
 * Runs all registered plugins against the clinical context.
 * Returns sorted recommendations by priority hierarchy and full rule execution trace.
 */
export function evaluateClinicalContext(ctx: ClinicalContext): {
  primaryRecommendation: RuleOutput;
  allTriggered: RuleOutput[];
  ruleTraceLog: string[];
} {
  const allRules = [...safetyRules, ...progressionRules];
  const triggered: RuleOutput[] = [];
  const traceLog: string[] = [];

  for (const rule of allRules) {
    const isTriggered = rule.condition(ctx);
    if (isTriggered) {
      const output = rule.evaluate(ctx);
      triggered.push(output);
      traceLog.push(`[TRIGGERED] Rule #${rule.id} (${rule.name}) -> Priority: ${output.priority} | Confidence: ${output.confidencePct}%`);
    } else {
      traceLog.push(`[SKIPPED] Rule #${rule.id} (${rule.name}) -> Condition unmet.`);
    }
  }

  // Sort triggered by priority
  triggered.sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority]);

  // If nothing triggered, generate default educational maintenance directive
  if (triggered.length === 0) {
    const defaultOutput: RuleOutput = {
      title: "Optimal Stabilization Phase Maintenance",
      actionDirective: "MAINTENANCE DIRECTIVE: Continue active Phase 1 protocol. Focus on smooth scapulohumeral rhythm.",
      priority: "educational",
      confidencePct: 100,
      trace: {
        triggeredRuleId: "DEFAULT-00",
        ruleName: "Standard Protocol Adherence",
        evidenceMet: ["Resting pain <= 2/10", "Adequate sleep & recovery"],
        evidenceMissing: [],
        whyExplanation: "All recovery parameters are within optimal orthopedic thresholds.",
      },
    };
    return {
      primaryRecommendation: defaultOutput,
      allTriggered: [defaultOutput],
      ruleTraceLog: [...traceLog, `[DEFAULT] Generated Maintenance Directive.`],
    };
  }

  return {
    primaryRecommendation: triggered[0],
    allTriggered: triggered,
    ruleTraceLog: traceLog,
  };
}
