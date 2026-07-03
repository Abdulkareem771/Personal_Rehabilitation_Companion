import { create } from "zustand";
import type { WorkoutModeState, SetLog, ProgramExercise } from "@/types";

interface WorkoutStore {
  // ── Active Session ───────────────────────────────────────────────────────
  sessionId: string | null;
  isInWorkoutMode: boolean;

  // ── Workout Mode State ───────────────────────────────────────────────────
  mode: WorkoutModeState | null;

  // ── Actions ──────────────────────────────────────────────────────────────
  startSession: (sessionId: string, exercises: ProgramExercise[]) => void;
  endSession: () => void;
  enterWorkoutMode: () => void;
  exitWorkoutMode: () => void;

  nextExercise: () => void;
  prevExercise: () => void;
  markExerciseDone: (exerciseId: string) => void;

  addSet: (set: SetLog) => void;
  updateSet: (index: number, set: Partial<SetLog>) => void;
  clearSets: () => void;

  startRestTimer: (seconds: number) => void;
  tickRest: () => void;
  cancelRest: () => void;

  setLearningTipShown: (shown: boolean) => void;
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  sessionId: null,
  isInWorkoutMode: false,
  mode: null,

  startSession: (sessionId, exercises) =>
    set({
      sessionId,
      mode: {
        sessionId,
        programExercises: exercises,
        currentIndex: 0,
        completedExerciseIds: [],
        currentSets: [],
        restTimerActive: false,
        restSecondsRemaining: 0,
        currentRestDuration: 0,
        learningTipShown: false,
      },
    }),

  endSession: () => set({ sessionId: null, isInWorkoutMode: false, mode: null }),

  enterWorkoutMode: () => set({ isInWorkoutMode: true }),
  exitWorkoutMode:  () => set({ isInWorkoutMode: false }),

  nextExercise: () =>
    set((state) => {
      if (!state.mode) return state;
      const next = Math.min(
        state.mode.currentIndex + 1,
        state.mode.programExercises.length - 1
      );
      return {
        mode: {
          ...state.mode,
          currentIndex: next,
          currentSets: [],
          restTimerActive: false,
          restSecondsRemaining: 0,
          learningTipShown: false,
        },
      };
    }),

  prevExercise: () =>
    set((state) => {
      if (!state.mode) return state;
      return {
        mode: {
          ...state.mode,
          currentIndex: Math.max(state.mode.currentIndex - 1, 0),
          currentSets: [],
        },
      };
    }),

  markExerciseDone: (exerciseId) =>
    set((state) => {
      if (!state.mode) return state;
      return {
        mode: {
          ...state.mode,
          completedExerciseIds: [...state.mode.completedExerciseIds, exerciseId],
        },
      };
    }),

  addSet: (setData) =>
    set((state) => {
      if (!state.mode) return state;
      return { mode: { ...state.mode, currentSets: [...state.mode.currentSets, setData] } };
    }),

  updateSet: (index, updates) =>
    set((state) => {
      if (!state.mode) return state;
      const sets = [...state.mode.currentSets];
      sets[index] = { ...sets[index], ...updates };
      return { mode: { ...state.mode, currentSets: sets } };
    }),

  clearSets: () =>
    set((state) => state.mode ? { mode: { ...state.mode, currentSets: [] } } : state),

  startRestTimer: (seconds) =>
    set((state) =>
      state.mode
        ? {
            mode: {
              ...state.mode,
              restTimerActive: true,
              restSecondsRemaining: seconds,
              currentRestDuration: seconds,
            },
          }
        : state
    ),

  tickRest: () =>
    set((state) => {
      if (!state.mode || !state.mode.restTimerActive) return state;
      const remaining = state.mode.restSecondsRemaining - 1;
      return {
        mode: {
          ...state.mode,
          restSecondsRemaining: remaining,
          restTimerActive: remaining > 0,
        },
      };
    }),

  cancelRest: () =>
    set((state) =>
      state.mode
        ? { mode: { ...state.mode, restTimerActive: false, restSecondsRemaining: 0 } }
        : state
    ),

  setLearningTipShown: (shown) =>
    set((state) =>
      state.mode ? { mode: { ...state.mode, learningTipShown: shown } } : state
    ),
}));

// ── Selector helpers (keep components free of derived logic) ────────────────

export const selectCurrentExercise = (state: WorkoutStore) =>
  state.mode?.programExercises[state.mode.currentIndex] ?? null;

export const selectIsLastExercise = (state: WorkoutStore) => {
  if (!state.mode) return false;
  return state.mode.currentIndex === state.mode.programExercises.length - 1;
};

export const selectProgress = (state: WorkoutStore) => {
  if (!state.mode) return 0;
  return state.mode.completedExerciseIds.length / state.mode.programExercises.length;
};
