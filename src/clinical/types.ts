export type RulePriority = 
  | "safety-override"    // Level 1: Highest priority (pain >= 5, acute flare up)
  | "medical-warning"    // Level 2: Subluxation, sharp clicking, medication conflicts
  | "recovery"           // Level 3: Sleep deficit, hydration, fatigue optimization
  | "progression"        // Level 4: Phase promotion when criteria met
  | "educational";       // Level 5: General biomechanical guidance

export interface ClinicalContext {
  painLevel: number;             // 0 - 10
  sleepHours: number;            // 0 - 12
  fatigueLevel: number;          // 0 - 10
  proteinGrams?: number;         // daily intake
  compliancePct: number;         // 0 - 100
  shoulderAbductionDeg?: number; // 0 - 180
  externalRotationDeg?: number;  // 0 - 90
  shoulderStatus: "stable" | "clicking" | "subluxation" | "guarded" | "painful";
  rolling7DayPainAvg: number;
}

export interface ExplainabilityTrace {
  triggeredRuleId: string;
  ruleName: string;
  evidenceMet: string[];
  evidenceMissing: string[];
  whyExplanation: string;
}

export interface RuleOutput {
  title: string;
  actionDirective: string;
  priority: RulePriority;
  confidencePct: number; // 0 - 100
  trace: ExplainabilityTrace;
  workoutModified?: boolean;
  modificationDetail?: string;
}

export interface ClinicalRule {
  id: string;
  name: string;
  category: "shoulder" | "universal";
  priority: RulePriority;
  condition: (ctx: ClinicalContext) => boolean;
  evaluate: (ctx: ClinicalContext) => RuleOutput;
}
