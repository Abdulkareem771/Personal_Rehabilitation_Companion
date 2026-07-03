import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { useAppStore } from "@/store/appStore";
import type { Exercise, Program, ExerciseCollection, UserProfile, Goal } from "@/types";

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
