import type { ClinicalContext } from "./types";

export interface EvidenceCriterion {
  label: string;
  weight: number;
  isMet: (ctx: ClinicalContext) => boolean;
}

/**
 * Dynamically calculates a confidence percentage:
 * confidence = sum(weightedEvidenceMet) / maximumPossibleEvidence * 100
 */
export function calculateConfidence(ctx: ClinicalContext, criteria: EvidenceCriterion[]): {
  confidencePct: number;
  metLabels: string[];
  missingLabels: string[];
} {
  if (criteria.length === 0) return { confidencePct: 100, metLabels: [], missingLabels: [] };

  let metPoints = 0;
  let maxPoints = 0;
  const metLabels: string[] = [];
  const missingLabels: string[] = [];

  for (const c of criteria) {
    maxPoints += c.weight;
    if (c.isMet(ctx)) {
      metPoints += c.weight;
      metLabels.push(c.label);
    } else {
      missingLabels.push(c.label);
    }
  }

  const rawPct = maxPoints > 0 ? (metPoints / maxPoints) * 100 : 100;
  return {
    confidencePct: Math.round(Math.min(100, Math.max(0, rawPct))),
    metLabels,
    missingLabels,
  };
}
