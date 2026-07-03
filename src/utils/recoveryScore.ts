// ─────────────────────────────────────────────────────────────────────────────
// Recovery Score Calculation
// Weights are user-configurable (stored in UserProfile.recoveryWeights).
// Each dimension normalised to 0-1 before applying weight.
// ─────────────────────────────────────────────────────────────────────────────
import type { RecoveryEntry, RecoveryWeights } from "@/types";

type RecoveryInput = Omit<RecoveryEntry, "id" | "score">;

export function calculateRecoveryScore(
  entry: RecoveryInput,
  weights: RecoveryWeights
): number {
  // Inverted dimensions: higher raw value = worse recovery
  const painNorm      = (10 - entry.pain)             / 10;
  const fatigueNorm   = (10 - entry.fatigue)          / 10;

  // Direct dimensions: higher = better
  const sleepNorm     = entry.sleepQuality            / 10;
  const stabilityNorm = entry.shoulderStability       / 10;

  // Binary to 0-1
  const hydration     = entry.waterGoalMet   ? 1 : 0;
  const nutrition     = entry.proteinGoalMet ? 1 : 0;

  const raw =
    painNorm      * weights.pain      +
    sleepNorm     * weights.sleep     +
    fatigueNorm   * weights.fatigue   +
    stabilityNorm * weights.stability +
    hydration     * weights.hydration +
    nutrition     * weights.nutrition;

  // Normalise to 0-100 (weights should sum to 1.0 but clip defensively)
  return Math.round(Math.min(100, Math.max(0, raw * 100)));
}

export type RecoveryLevel = "rest" | "light" | "normal" | "push";

export function getRecoveryLevel(score: number): RecoveryLevel {
  if (score <= 40) return "rest";
  if (score <= 60) return "light";
  if (score <= 80) return "normal";
  return "push";
}

export function getRecoveryMessage(score: number): string {
  const level = getRecoveryLevel(score);
  switch (level) {
    case "rest":   return "High fatigue detected. Prioritise rest and mobility today.";
    case "light":  return "Low readiness. Stick to lighter exercises and stretching.";
    case "normal": return "Normal readiness. Proceed with today's program.";
    case "push":   return "Excellent readiness. Full session and progression recommended.";
  }
}

export function getRecoveryColor(score: number): string {
  if (score <= 40) return "text-rehab-red";
  if (score <= 60) return "text-rehab-amber";
  if (score <= 80) return "text-rehab-teal";
  return "text-rehab-green";
}
