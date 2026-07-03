import type { WorkoutExercise } from "../types";

export const todaysWorkout: WorkoutExercise[] = [
  { exerciseId: "external-rotation", sets: 3, reps: "12 each side", target: "slow control" },
  { exerciseId: "serratus-punch", sets: 3, reps: "12", target: "scapular motion" },
  { exerciseId: "leg-press", sets: 3, reps: "10", target: "RPE 6" },
  { exerciseId: "chest-supported-row", sets: 2, reps: "12", target: "pain <= 2/10" }
];

export const dailyChecklist = [
  "Medication",
  "Water",
  "Posture routine",
  "Walk",
  "Breakfast protein",
  "Warm-up",
  "Pain diary",
  "Sleep target"
];
