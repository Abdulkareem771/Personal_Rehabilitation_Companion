// ─────────────────────────────────────────────────────────────────────────────
// ReForge — Master Type Definitions
// All domain types live here. Import from "@/types" everywhere.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Primitives ──────────────────────────────────────────────────────────────

export type Units = "metric" | "imperial";
export type Theme = "light" | "dark" | "medical-blue";
export type ISODateString = string; // "YYYY-MM-DD"
export type ISOTimestamp  = string; // full ISO 8601

// ─── User Profile ─────────────────────────────────────────────────────────────

export interface InjuryRecord {
  id: string;
  bodyPart: string;
  description: string;
  date: ISODateString;
  resolved: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  bodyFatPct?: number;
  conditions: string[];
  goals: string[];
  injuryHistory: InjuryRecord[];
  units: Units;
  theme: Theme;
  recoveryWeights: RecoveryWeights;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

export interface AppSettings {
  id: "singleton";
  profileId: string;
  sidebarCollapsed: boolean;
  workoutModeEnabled: boolean;
  learningTipsEnabled: boolean;
  streakDimensions: StreakDimension[];
  updatedAt: ISOTimestamp;
}

// ─── Media ───────────────────────────────────────────────────────────────────

export type MediaType = "image" | "gif" | "lottie" | "video" | "svg" | "pdf" | "infographic";

export interface MediaAsset {
  id: string;
  type: MediaType;
  filename: string;
  blob?: Blob;          // stored in IndexedDB
  externalUrl?: string; // YouTube / external fallback (offline-unsafe, optional)
  caption?: string;
  tags: string[];
  exerciseIds: string[]; // exercises this media belongs to (many-to-many)
  createdAt: ISOTimestamp;
}

// ─── Exercise — Core Entity ───────────────────────────────────────────────────

export type SafetyLevel    = "green" | "yellow" | "red";
export type Difficulty     = 1 | 2 | 3 | 4 | 5;
export type ExerciseCategory =
  | "mobility" | "stability" | "strength" | "hypertrophy"
  | "posture"  | "core"      | "cardio"   | "flexibility" | "balance";
export type Equipment =
  | "bodyweight" | "band" | "dumbbell" | "barbell"
  | "machine"    | "cable" | "kettlebell" | "other";

export type ExerciseTag =
  | "shoulder-stability" | "rotator-cuff"  | "posture"      | "core"
  | "hip"                | "knee"          | "ankle"        | "balance"
  | "warmup"             | "cooldown"      | "mobility"     | "strength"
  | "hypertrophy"        | "endurance"     | "rehab"        | "gym"
  | "home"               | "bodyweight"    | "bilateral"    | "unilateral"
  | "scapular"           | "posterior-chain";

export interface ExerciseContent {
  // What to do
  purpose: string;
  instructions: string[];
  breathingCues: string;
  tempoCue: string;      // e.g. "3-1-3 (lower 3s · hold 1s · raise 3s)"
  restSeconds: number;
  expectedDurationMin: number;

  // How to do it correctly
  commonMistakes: string[];
  compensations: string[]; // what the body does when fatigued/weak
  regression: string;
  progression: string;
  contraindications: string[];
  safetyWarnings: string;

  // Why (educational core — AI-replaceable in Phase 3)
  personalizedWhy: string;      // condition-specific, editable by user
  biomechanics?: string;
  engineeringExplanation?: string;
  scientificNotes?: string;
  expectedBenefit: 1 | 2 | 3 | 4 | 5;

  // Learning Mode pool (randomly shown pre-exercise)
  learningTips: string[];
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  safety: SafetyLevel;
  difficulty: Difficulty;
  equipment: Equipment[];
  muscles: string[];
  secondaryMuscles: string[];
  tags: ExerciseTag[];
  content: ExerciseContent;
  mediaIds: string[];        // MediaAsset ids (many-to-many)
  coverId?: string;
  animationId?: string;
  relatedExerciseIds: string[];
  collectionIds: string[];
  isCustom: boolean;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

export interface ExerciseNote {
  id: string;
  exerciseId: string;
  text: string;
  date: ISODateString;
}

export interface ExerciseCollection {
  id: string;
  name: string;
  description?: string;
  iconEmoji?: string;
  exerciseIds: string[];
  isDefault: boolean;
  createdAt: ISOTimestamp;
}

// ─── Exercise Difficulty Wizard ───────────────────────────────────────────────

export type DifficultyResponse = "easy" | "normal" | "hard" | "painful" | "impossible";

export interface ExerciseDifficultyCalibration {
  exerciseId: string;
  response: DifficultyResponse;
  recommendedLoad: string; // "Yellow Band", "Bodyweight", "Regression", etc.
  date: ISODateString;
}

// ─── Workout History ──────────────────────────────────────────────────────────

export interface SetLog {
  setNumber: number;
  weight?: number;      // kg
  bandColor?: string;   // "yellow" | "red" | "black" | etc.
  reps?: number;
  durationSec?: number; // for timed holds
  rpe?: number;         // 1–10
  pain?: number;        // 0–10
  completed: boolean;
  notes?: string;
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  sessionId: string;
  date: ISODateString;
  sets: SetLog[];
  personalRecord: boolean;
  overallPain: number;
  overallDifficulty: number;
  notes: string;
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  date: ISODateString;
  weight?: number;
  reps?: number;
  volume?: number; // weight × reps
}

// ─── Programs (Notion-style: Program → Week → Day → Block → Exercise) ────────

export type ProgramType   = "rehabilitation" | "strength" | "hypertrophy" | "weight-loss" | "custom";
export type ProgramStatus = "active" | "draft" | "archived" | "completed";
export type BlockType     = "warmup" | "strength" | "core" | "posture" | "cardio" | "cooldown" | "custom";

export interface ProgramExercise {
  id: string;          // unique within the program structure
  exerciseId: string;
  order: number;
  sets: number;
  reps?: string;       // "12-15", "AMRAP", etc.
  durationSec?: number;
  tempoOverride?: string;
  restSecondsOverride?: number;
  rpeTarget?: number;
  notes?: string;
}

export interface Block {
  id: string;
  type: BlockType;
  name?: string;       // custom label when type === "custom"
  exercises: ProgramExercise[];
  order: number;
}

export interface Day {
  id: string;
  name: string;        // "Monday", "Day A", "Rest", etc.
  blocks: Block[];
  notes?: string;
  isRestDay: boolean;
}

export interface Week {
  id: string;
  weekNumber: number;
  days: Day[];
  goals?: string;
  progressionNotes?: string;
}

export interface Program {
  id: string;
  name: string;
  type: ProgramType;
  status: ProgramStatus;
  description: string;
  phases: string[];
  currentPhase: string;
  currentWeek: number;
  totalWeeks: number;
  weeks: Week[];
  goals: string[];
  safetyNotes: string;
  completionCriteria: string;
  versionNumber: number;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

export interface ProgramVersion {
  id: string;
  programId: string;
  versionNumber: number;
  snapshot: Program;    // full deep-copy JSON
  changeDescription?: string;
  createdAt: ISOTimestamp;
}

// ─── Workout Session ──────────────────────────────────────────────────────────

export type SessionStatus = "in-progress" | "completed" | "abandoned";

export interface WorkoutSession {
  id: string;
  programId?: string;
  weekNumber?: number;
  dayName?: string;
  startedAt: ISOTimestamp;
  completedAt?: ISOTimestamp;
  durationMin?: number;
  status: SessionStatus;
  exerciseLogIds: string[];
  overallPain: number;
  notes: string;
  moodBefore?: number;
  moodAfter?: number;
}

// ─── Workout Mode State (Zustand) ─────────────────────────────────────────────

export interface WorkoutModeState {
  sessionId: string;
  programExercises: ProgramExercise[];
  currentIndex: number;
  completedExerciseIds: string[];
  currentSets: SetLog[];
  restTimerActive: boolean;
  restSecondsRemaining: number;
  currentRestDuration: number;
  learningTipShown: boolean;
}

// ─── Recovery ────────────────────────────────────────────────────────────────

export type ShoulderStatus = "stable" | "clicking" | "subluxation" | "guarded" | "painful";

export interface RecoveryWeights {
  pain:       number; // default 0.30 — higher priority for shoulder rehab
  sleep:      number; // default 0.20
  stability:  number; // default 0.20
  fatigue:    number; // default 0.15
  hydration:  number; // default 0.10
  nutrition:  number; // default 0.05
}

export const DEFAULT_RECOVERY_WEIGHTS: RecoveryWeights = {
  pain:      0.30,
  sleep:     0.20,
  stability: 0.20,
  fatigue:   0.15,
  hydration: 0.10,
  nutrition: 0.05,
};

export interface RecoveryEntry {
  id: string;
  date: ISODateString;
  // Raw slider inputs (0–10)
  pain: number;
  sleepQuality: number;
  fatigue: number;
  motivation: number;
  shoulderStability: number;
  stressLevel: number;
  // Binary checklist
  waterGoalMet: boolean;
  proteinGoalMet: boolean;
  morningWalk: boolean;
  workoutCompleted: boolean;
  // Computed
  score: number;           // 0–100, computed with user's RecoveryWeights
  shoulderStatus: ShoulderStatus;
  notes?: string;
}

// ─── Health — Pain ────────────────────────────────────────────────────────────

export type PainLocation =
  | "left-shoulder" | "right-shoulder" | "neck" | "upper-back"
  | "lower-back"    | "left-knee"      | "right-knee" | "other";

export type InstabilityType = "none" | "clicking" | "subluxation" | "dislocation";

export interface BodyMapPoint {
  region: string;
  x: number; // % of SVG viewport width
  y: number; // % of SVG viewport height
}

export interface PainEntry {
  id: string;
  date: ISODateString;
  pain: number; // 0–10
  locations: PainLocation[];
  instability: InstabilityType;
  trigger: string;
  notes: string;
  bodyMapPoints?: BodyMapPoint[];
}

// ─── Health — Nutrition ───────────────────────────────────────────────────────

export interface Meal {
  id: string;
  name: string;
  time: string; // "HH:mm"
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  notes?: string;
}

export interface NutritionEntry {
  id: string;
  date: ISODateString;
  meals: Meal[];
  waterMl: number;
  calorieTarget: number;
  proteinTargetG: number;
  carbTargetG: number;
  fatTargetG: number;
  supplements: string[];
}

// ─── Health — Medication ──────────────────────────────────────────────────────

export interface Medication {
  id: string;
  name: string;
  doseDescription: string;
  schedule: string;  // "Morning, Evening"
  purpose: string;
  startDate: ISODateString;
  endDate?: ISODateString;
  isActive: boolean;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  date: ISODateString;
  status: "taken" | "missed" | "skipped";
  time?: string;
  notes?: string;
}

// ─── Health — Measurements ────────────────────────────────────────────────────

export interface Measurement {
  id: string;
  date: ISODateString;
  weightKg?: number;
  waistCm?: number;
  chestCm?: number;
  hipCm?: number;
  neckCm?: number;
  leftArmCm?: number;
  rightArmCm?: number;
  leftThighCm?: number;
  rightThighCm?: number;
  bodyFatPct?: number;
  photoIds?: string[]; // MediaAsset ids (Blobs)
}

// ─── Goals & Milestones ───────────────────────────────────────────────────────

export type GoalType = "short-term" | "mid-term" | "long-term";
export type GoalStatus = "active" | "completed" | "paused";

export interface Goal {
  id: string;
  type: GoalType;
  title: string;
  description?: string;
  targetDate?: ISODateString;
  status: GoalStatus;
  progressPct: number;  // 0–100, manually updated
  createdAt: ISOTimestamp;
  completedAt?: ISOTimestamp;
}

export interface Milestone {
  id: string;
  programId?: string;
  weekNumber?: number;
  title: string;
  description?: string;
  targetDate?: ISODateString;
  achieved: boolean;
  achievedDate?: ISODateString;
  createdAt: ISOTimestamp;
}

// ─── Streaks ──────────────────────────────────────────────────────────────────

export type StreakDimension = "workout" | "walking" | "medication" | "protein" | "posture" | "recovery";

export interface StreakRecord {
  dimension: StreakDimension;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: ISODateString;
  history: ISODateString[];
}

// ─── Infographics ─────────────────────────────────────────────────────────────

export type InfographicCategory =
  | "anatomy" | "condition" | "posture" | "sleep"
  | "daily-life" | "gym-safety" | "mechanics" | "nutrition" | "recovery";

export interface Infographic {
  id: string;
  title: string;
  description: string;
  category: InfographicCategory;
  mediaId: string;           // SVG or PNG in MediaAsset
  relatedExerciseIds: string[];
  tags: string[];
}

// ─── Medical Records ──────────────────────────────────────────────────────────

export type MedicalEventType =
  | "seizure"     | "mri"        | "ct-scan"    | "x-ray"
  | "physiotherapy" | "surgery"   | "dislocation"| "medication-change"
  | "diagnosis"   | "emergency"  | "follow-up"  | "custom";

// Imaging sub-types for the imaging vault
export type ImagingType = "mri" | "ct-scan" | "x-ray" | "ultrasound";

export interface MedicalImage {
  id: string;
  imagingType: ImagingType;
  date: ISODateString;
  bodyPart: string;        // "Left Shoulder", "Cervical Spine"
  findings: string;        // Clinical notes
  mediaIds: string[];      // scanned images as MediaAsset Blobs
  provider?: string;
}

export interface MedicalEvent {
  id: string;
  date: ISODateString;
  type: MedicalEventType;
  title: string;
  provider?: string;
  location?: string;
  notes: string;
  mediaIds: string[];
  linkedImagingId?: string;
  isPrivate: boolean;
}

// ─── Posture ──────────────────────────────────────────────────────────────────

export interface PostureExercise {
  id: string;
  name: string;
  instructions: string;
  durationSec: number;
  mediaId?: string;
  breathingCue: string;
  order: number;
}

export interface PostureSession {
  id: string;
  date: ISODateString;
  completedExerciseIds: string[];
  durationSec: number;
  notes?: string;
}

// ─── Daily Checklist ──────────────────────────────────────────────────────────

export type ChecklistPeriod = "morning" | "evening";

export interface ChecklistItem {
  id: string;
  label: string;
  period: ChecklistPeriod;
  order: number;
  isDefault: boolean;
}

export interface DailyChecklist {
  id: string;
  date: ISODateString;
  completedItemIds: string[];
}

// ─── AI Hooks (Phase 3 architecture, stubs in Phase 1) ───────────────────────

export interface ProgressionRecommendation {
  exerciseId: string;
  suggestedWeightKg?: number;
  suggestedBandColor?: string;
  rationale: string;
  confidence: "rule-based" | "ai";
}

export interface WorkoutRecommendation {
  adjustments: string[];
  rationale: string;
}

export interface PainAnalysis {
  trend: "improving" | "stable" | "worsening";
  triggers: string[];
  recommendations: string[];
}
