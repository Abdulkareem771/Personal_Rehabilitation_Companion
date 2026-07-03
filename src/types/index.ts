export type SafetyLevel = "green" | "yellow" | "red";

export type Exercise = {
  id: string;
  name: string;
  category: "mobility" | "stability" | "core" | "gym" | "posture";
  safety: SafetyLevel;
  purpose: string;
  muscles: string[];
  whyYouNeedIt: string;
  engineeringAnalogy: string;
  instructions: string[];
  mistakes: string[];
  progression: string;
  regression: string;
  warnings: string;
};

export type WorkoutExercise = {
  exerciseId: string;
  sets?: number;
  reps?: string;
  minutes?: number;
  target?: string;
};

export type DailyMetric = {
  date: string;
  water: number;
  protein: number;
  pain: number;
  stability: number;
  mood: number;
  sleep: number;
  weight: number;
};
