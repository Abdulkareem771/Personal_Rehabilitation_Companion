import type { SafetyLevel } from "../types";
import { safetyCopy } from "../data/exercises";

export function SafetyBadge({ level }: { level: SafetyLevel }) {
  return <span className={`safety-badge ${level}`}>{safetyCopy[level]}</span>;
}
