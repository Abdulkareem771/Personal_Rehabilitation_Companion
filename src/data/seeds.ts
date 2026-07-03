// Stub seeds module — real seeds will be populated in Layer 7 (data seeding)
// This prevents build errors before the full data layer is written.
import { db } from "@/lib/db";
import { uid, nowISO } from "@/lib/utils";
import type { UserProfile } from "@/types";
import { DEFAULT_RECOVERY_WEIGHTS } from "@/types";

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
}

export async function seedExercises(): Promise<void> {
  // Exercises will be seeded in full in Layer 7
}

export async function seedPrograms(): Promise<void> {
  // Programs will be seeded in full in Layer 7
}

export async function seedCollections(): Promise<void> {
  const defaultCollections = [
    { id: uid(), name: "Favorites",          iconEmoji: "⭐", exerciseIds: [], isDefault: true, createdAt: nowISO() },
    { id: uid(), name: "Shoulder Stability", iconEmoji: "🔵", exerciseIds: [], isDefault: true, createdAt: nowISO() },
    { id: uid(), name: "Rotator Cuff",       iconEmoji: "🔄", exerciseIds: [], isDefault: true, createdAt: nowISO() },
    { id: uid(), name: "Posture",            iconEmoji: "🧍", exerciseIds: [], isDefault: true, createdAt: nowISO() },
    { id: uid(), name: "Core",               iconEmoji: "💪", exerciseIds: [], isDefault: true, createdAt: nowISO() },
    { id: uid(), name: "Warmup",             iconEmoji: "🔥", exerciseIds: [], isDefault: true, createdAt: nowISO() },
    { id: uid(), name: "Gym",                iconEmoji: "🏋️", exerciseIds: [], isDefault: true, createdAt: nowISO() },
  ];
  for (const c of defaultCollections) {
    await db.exerciseCollections.put(c);
  }
}
