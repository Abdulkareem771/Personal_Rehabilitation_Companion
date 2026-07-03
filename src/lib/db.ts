import Dexie, { type Table } from "dexie";
import type {
  UserProfile,
  AppSettings,
  MediaAsset,
  Exercise,
  ExerciseNote,
  ExerciseCollection,
  ExerciseDifficultyCalibration,
  ExerciseLog,
  PersonalRecord,
  Program,
  ProgramVersion,
  WorkoutSession,
  RecoveryEntry,
  PainEntry,
  NutritionEntry,
  Medication,
  MedicationLog,
  Measurement,
  Goal,
  Milestone,
  StreakRecord,
  Infographic,
  MedicalEvent,
  MedicalImage,
  PostureSession,
  DailyChecklist,
  WeeklyReview,
} from "@/types";


// ─────────────────────────────────────────────────────────────────────────────
// ReForge Database — single Dexie instance
// All tables use `id` as the primary key (string / uuid).
// `syncedAt` is null until Phase 2 Supabase integration.
// ─────────────────────────────────────────────────────────────────────────────

class ReForgeDB extends Dexie {
  // ── Core ──────────────────────────────────────────────────────────────────
  profile!:           Table<UserProfile>;
  settings!:          Table<AppSettings>;

  // ── Media ─────────────────────────────────────────────────────────────────
  mediaAssets!:       Table<MediaAsset>;

  // ── Exercises ─────────────────────────────────────────────────────────────
  exercises!:          Table<Exercise>;
  exerciseNotes!:      Table<ExerciseNote>;
  exerciseCollections!:Table<ExerciseCollection>;
  difficultyCalibrations!: Table<ExerciseDifficultyCalibration>;

  // ── Programs ──────────────────────────────────────────────────────────────
  programs!:          Table<Program>;
  programVersions!:   Table<ProgramVersion>;

  // ── History ───────────────────────────────────────────────────────────────
  workoutSessions!:   Table<WorkoutSession>;
  exerciseLogs!:      Table<ExerciseLog>;
  personalRecords!:   Table<PersonalRecord>;

  // ── Recovery ──────────────────────────────────────────────────────────────
  recoveryEntries!:   Table<RecoveryEntry>;
  streaks!:           Table<StreakRecord>;
  dailyChecklists!:   Table<DailyChecklist>;
  postureSessions!:   Table<PostureSession>;

  // ── Health ────────────────────────────────────────────────────────────────
  painEntries!:       Table<PainEntry>;
  nutritionEntries!:  Table<NutritionEntry>;
  medications!:       Table<Medication>;
  medicationLogs!:    Table<MedicationLog>;
  measurements!:      Table<Measurement>;

  // ── Goals ─────────────────────────────────────────────────────────────────
  goals!:             Table<Goal>;
  milestones!:        Table<Milestone>;
  infographics!:      Table<Infographic>;

  // ── Medical ───────────────────────────────────────────────────────────────
  medicalEvents!:     Table<MedicalEvent>;
  medicalImages!:     Table<MedicalImage>;
  weeklyReviews!:     Table<WeeklyReview>;

  constructor() {
    super("ReForgeDB");

    this.version(1).stores({
      profile:               "id",
      settings:              "id",
      mediaAssets:           "id, type, *tags, *exerciseIds",
      exercises:             "id, category, safety, difficulty, *tags, *collectionIds",
      exerciseNotes:         "id, exerciseId, date",
      exerciseCollections:   "id, isDefault",
      difficultyCalibrations:"exerciseId",
      programs:              "id, status, type",
      programVersions:       "id, programId, versionNumber",
      workoutSessions:       "id, status, startedAt, programId",
      exerciseLogs:          "id, exerciseId, sessionId, date",
      personalRecords:       "id, exerciseId",
      recoveryEntries:       "id, date",
      streaks:               "dimension",
      dailyChecklists:       "id, date",
      postureSessions:       "id, date",
      painEntries:           "id, date",
      nutritionEntries:      "id, date",
      medications:           "id, isActive",
      medicationLogs:        "id, medicationId, date",
      measurements:          "id, date",
      goals:                 "id, type, status",
      milestones:            "id, programId",
      infographics:          "id, category, *tags",
      medicalEvents:         "id, date, type",
      medicalImages:         "id, imagingType, date",
    });

    this.version(2).stores({
      weeklyReviews:         "id, weekNumber, dateStr",
    });
  }
}


export const db = new ReForgeDB();

// ─────────────────────────────────────────────────────────────────────────────
// Seed helper — called once on first app launch
// ─────────────────────────────────────────────────────────────────────────────

export async function seedDefaultDataIfEmpty(): Promise<void> {
  const profileCount = await db.profile.count();
  const mediaCount = await db.mediaAssets.count();
  const reviewCount = await db.weeklyReviews.count();

  const { seedProfile, seedExercises, seedPrograms, seedCollections, seedMediaAssets, seedWeeklyReviews } =
    await import("@/data/seeds");

  if (profileCount === 0) {
    await db.transaction("rw", [db.profile, db.settings, db.exercises, db.programs, db.exerciseCollections, db.goals, db.mediaAssets, db.weeklyReviews], async () => {
      await seedProfile();
      await seedExercises();
      await seedPrograms();
      await seedCollections();
      await seedMediaAssets();
      await seedWeeklyReviews();
    });
  } else {
    // Unconditionally seed media assets to capture new additions
    await db.transaction("rw", [db.mediaAssets], async () => {
      await seedMediaAssets();
    });
    if (reviewCount === 0) {
      await db.transaction("rw", [db.weeklyReviews], async () => {
        await seedWeeklyReviews();
      });
    }
  }
}



