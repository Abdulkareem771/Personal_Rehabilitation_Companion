import type { ClinicalContext } from "./types";
import { evaluateClinicalContext } from "./recommendationEngine";

export interface SimulationPreset {
  id: string;
  name: string;
  description: string;
  context: ClinicalContext;
}

export const simulationPresets: SimulationPreset[] = [
  {
    id: "optimal-progression",
    name: "Optimal Phase Promotion",
    description: "Low pain (1/10), high sleep (8h), and 95% workout compliance.",
    context: {
      painLevel: 1,
      sleepHours: 8,
      fatigueLevel: 2,
      proteinGrams: 160,
      compliancePct: 95,
      shoulderAbductionDeg: 170,
      externalRotationDeg: 75,
      shoulderStatus: "stable",
      rolling7DayPainAvg: 1.2,
    },
  },
  {
    id: "acute-flare-up",
    name: "Acute Capsule Guarding Spike",
    description: "Sharp anterior pain (6/10) with joint capsule guarding.",
    context: {
      painLevel: 6,
      sleepHours: 5.5,
      fatigueLevel: 7,
      proteinGrams: 110,
      compliancePct: 70,
      shoulderAbductionDeg: 120,
      externalRotationDeg: 45,
      shoulderStatus: "guarded",
      rolling7DayPainAvg: 4.8,
    },
  },
  {
    id: "subluxation-catching",
    name: "Bankart Instability Catching",
    description: "Low resting pain (2/10) but reported subluxation clicking sensation.",
    context: {
      painLevel: 2,
      sleepHours: 7,
      fatigueLevel: 4,
      proteinGrams: 140,
      compliancePct: 90,
      shoulderAbductionDeg: 150,
      externalRotationDeg: 60,
      shoulderStatus: "subluxation",
      rolling7DayPainAvg: 2.1,
    },
  },
];

export function runSimulation(ctx: ClinicalContext) {
  return evaluateClinicalContext(ctx);
}
