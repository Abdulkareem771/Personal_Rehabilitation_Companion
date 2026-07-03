import { db } from "@/lib/db";
import { uid, nowISO } from "@/lib/utils";
import type { UserProfile, Goal } from "@/types";
import { DEFAULT_RECOVERY_WEIGHTS } from "@/types";
import { defaultExercises } from "./exercises";
import { defaultPrograms } from "./defaultPrograms";
import { defaultMediaAssets } from "./mediaAssets";


export async function seedProfile(): Promise<void> {
  const profile: UserProfile = {
    id: "default-user",
    name: "Abdulkareem",
    conditions: ["Bankart lesion", "Recurrent anterior shoulder instability"],
    goals: ["Complete Phase 1 stabilization", "Return to full gym training"],
    injuryHistory: [],
    units: "metric",
    theme: "light",
    recoveryWeights: DEFAULT_RECOVERY_WEIGHTS,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };
  await db.profile.put(profile);

  // Also seed initial clinical goals
  const initialGoals: Goal[] = [
    {
      id: uid(),
      type: "short-term",
      title: "Zero Anterior Clicking During External Rotation",
      description: "Perform 15 clean reps of band external rotation with zero mechanical clicking or instability sensation.",
      status: "active",
      progressPct: 60,
      createdAt: nowISO(),
    },
    {
      id: uid(),
      type: "mid-term",
      title: "Complete Phase 1 Stabilization Program",
      description: "Execute all 6 weeks of protocol with pain rating consistently below 2/10.",
      status: "active",
      progressPct: 20,
      createdAt: nowISO(),
    },
    {
      id: uid(),
      type: "long-term",
      title: "Return to Overhead Dumbbell Shoulder Press",
      description: "Safely perform seated overhead dumbbell press at 18 kg without anterior subluxation guarding.",
      status: "active",
      progressPct: 10,
      createdAt: nowISO(),
    }
  ];
  for (const g of initialGoals) {
    await db.goals.put(g);
  }
}

export async function seedExercises(): Promise<void> {
  for (const ex of defaultExercises) {
    await db.exercises.put(ex);
  }
}

export async function seedPrograms(): Promise<void> {
  for (const prog of defaultPrograms) {
    await db.programs.put(prog);
  }
}

export async function seedCollections(): Promise<void> {
  const defaultCollections = [
    { id: uid(), name: "Favorites",          iconEmoji: "⭐", exerciseIds: ["band-external-rotation", "serratus-punch"], isDefault: true, createdAt: nowISO() },
    { id: uid(), name: "Shoulder Stability", iconEmoji: "🔵", exerciseIds: ["band-external-rotation", "serratus-punch", "wall-slide"], isDefault: true, createdAt: nowISO() },
    { id: uid(), name: "Rotator Cuff",       iconEmoji: "🔄", exerciseIds: ["band-external-rotation", "prone-yt"], isDefault: true, createdAt: nowISO() },
    { id: uid(), name: "Posture",            iconEmoji: "🧍", exerciseIds: ["face-pull", "band-pull-apart", "chin-tuck"], isDefault: true, createdAt: nowISO() },
    { id: uid(), name: "Core",               iconEmoji: "💪", exerciseIds: ["dead-bug"], isDefault: true, createdAt: nowISO() },
    { id: uid(), name: "Warmup",             iconEmoji: "🔥", exerciseIds: ["chin-tuck", "band-pull-apart"], isDefault: true, createdAt: nowISO() },
    { id: uid(), name: "Gym",                iconEmoji: "🏋️", exerciseIds: ["face-pull", "goblet-squat", "romanian-deadlift"], isDefault: true, createdAt: nowISO() },
  ];
  for (const c of defaultCollections) {
    await db.exerciseCollections.put(c);
  }
}

export async function seedMediaAssets(): Promise<void> {
  for (const media of defaultMediaAssets) {
    await db.mediaAssets.put(media);
  }
}


