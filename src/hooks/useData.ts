import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { useAppStore } from "@/store/appStore";
import type { Exercise, Program, ExerciseCollection, UserProfile, Goal, MediaAsset, ExerciseLog, Measurement, ProgramVersion, WeeklyReview } from "@/types";

export function useProfile(): UserProfile | undefined {


  return useLiveQuery(() => db.profile.get("default-user"), []);
}



export function useExercises(category?: string): Exercise[] {
  const exercises = useLiveQuery(async () => {
    if (category && category !== "all") {
      return await db.exercises.where("category").equals(category).toArray();
    }
    return await db.exercises.toArray();
  }, [category]);
  return exercises ?? [];
}

export function useExerciseById(id: string): Exercise | undefined {
  return useLiveQuery(() => db.exercises.get(id), [id]);
}

export function usePrograms(): Program[] {
  const programs = useLiveQuery(() => db.programs.toArray(), []);
  return programs ?? [];
}

export function useActiveProgram(): Program | undefined {
  const { activeProgramId } = useAppStore();
  return useLiveQuery(async () => {
    if (activeProgramId) {
      const p = await db.programs.get(activeProgramId);
      if (p) return p;
    }
    // Fallback to first active program
    const active = await db.programs.where("status").equals("active").first();
    return active;
  }, [activeProgramId]);
}

export function useCollections(): ExerciseCollection[] {
  const collections = useLiveQuery(() => db.exerciseCollections.toArray(), []);
  return collections ?? [];
}

export function useGoals(): Goal[] {
  const goals = useLiveQuery(() => db.goals.toArray(), []);
  return goals ?? [];
}

export function useMediaAssets(exerciseId?: string): MediaAsset[] {
  const media = useLiveQuery(async () => {
    const all = await db.mediaAssets.toArray();
    if (exerciseId) {
      return all.filter((m) => m.exerciseIds.includes(exerciseId));
    }
    return all;
  }, [exerciseId]);
  return media ?? [];
}

export function useExerciseLogs(exerciseId?: string): ExerciseLog[] {
  const logs = useLiveQuery(async () => {
    if (exerciseId) {
      return await db.exerciseLogs.where("exerciseId").equals(exerciseId).sortBy("date");
    }
    return await db.exerciseLogs.orderBy("date").toArray();
  }, [exerciseId]);
  return logs ?? [];
}

export function useMeasurements(): Measurement[] {
  const measurements = useLiveQuery(() => db.measurements.orderBy("date").reverse().toArray(), []);
  return measurements ?? [];
}

export function useProgramVersions(programId?: string): ProgramVersion[] {
  const versions = useLiveQuery(async () => {
    if (programId) {
      return await db.programVersions.where("programId").equals(programId).sortBy("versionNumber");
    }
    return await db.programVersions.orderBy("versionNumber").toArray();
  }, [programId]);
  return versions ?? [];
}

export function useWeeklyReviews(): WeeklyReview[] {
  const reviews = useLiveQuery(() => db.weeklyReviews.orderBy("weekNumber").reverse().toArray(), []);
  return reviews ?? [];
}





