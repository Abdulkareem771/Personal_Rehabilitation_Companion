// ─────────────────────────────────────────────────────────────────────────────
// Exercise Repository
// All exercise-related DB operations in one place.
// ─────────────────────────────────────────────────────────────────────────────
import { db } from "@/lib/db";
import { uid, nowISO, today } from "@/lib/utils";
import type {
  Exercise,
  ExerciseNote,
  ExerciseCollection,
  ExerciseDifficultyCalibration,
  DifficultyResponse,
  ExerciseTag,
  SafetyLevel,
  ExerciseCategory,
} from "@/types";

// ── Exercises ─────────────────────────────────────────────────────────────────

export const exerciseRepository = {
  async getAll(): Promise<Exercise[]> {
    return db.exercises.orderBy("name").toArray();
  },

  async getById(id: string): Promise<Exercise | undefined> {
    return db.exercises.get(id);
  },

  async getByTag(tag: ExerciseTag): Promise<Exercise[]> {
    return db.exercises.where("tags").equals(tag).toArray();
  },

  async getBySafety(level: SafetyLevel): Promise<Exercise[]> {
    return db.exercises.where("safety").equals(level).toArray();
  },

  async getByCategory(category: ExerciseCategory): Promise<Exercise[]> {
    return db.exercises.where("category").equals(category).toArray();
  },

  async search(query: string): Promise<Exercise[]> {
    const q = query.toLowerCase();
    return db.exercises
      .filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.content.purpose.toLowerCase().includes(q) ||
          e.tags.some((t) => t.includes(q))
      )
      .toArray();
  },

  async getByCollection(collectionId: string): Promise<Exercise[]> {
    return db.exercises.where("collectionIds").equals(collectionId).toArray();
  },

  async upsert(exercise: Exercise): Promise<void> {
    await db.exercises.put({ ...exercise, updatedAt: nowISO() });
  },

  async updatePersonalizedWhy(id: string, text: string): Promise<void> {
    const ex = await db.exercises.get(id);
    if (!ex) return;
    ex.content.personalizedWhy = text;
    ex.updatedAt = nowISO();
    await db.exercises.put(ex);
  },

  async delete(id: string): Promise<void> {
    await db.exercises.delete(id);
  },

  // ── Notes ────────────────────────────────────────────────────────────────

  async getNotes(exerciseId: string): Promise<ExerciseNote[]> {
    return db.exerciseNotes
      .where("exerciseId")
      .equals(exerciseId)
      .reverse()
      .sortBy("date");
  },

  async addNote(exerciseId: string, text: string): Promise<ExerciseNote> {
    const note: ExerciseNote = {
      id: uid(),
      exerciseId,
      text,
      date: today(),
    };
    await db.exerciseNotes.add(note);
    return note;
  },

  async deleteNote(noteId: string): Promise<void> {
    await db.exerciseNotes.delete(noteId);
  },

  // ── Collections ──────────────────────────────────────────────────────────

  async getCollections(): Promise<ExerciseCollection[]> {
    return db.exerciseCollections.orderBy("name").toArray();
  },

  async getCollection(id: string): Promise<ExerciseCollection | undefined> {
    return db.exerciseCollections.get(id);
  },

  async upsertCollection(collection: ExerciseCollection): Promise<void> {
    await db.exerciseCollections.put(collection);
  },

  async addExerciseToCollection(collectionId: string, exerciseId: string): Promise<void> {
    const [col, ex] = await Promise.all([
      db.exerciseCollections.get(collectionId),
      db.exercises.get(exerciseId),
    ]);
    if (!col || !ex) return;
    if (!col.exerciseIds.includes(exerciseId)) {
      col.exerciseIds.push(exerciseId);
      await db.exerciseCollections.put(col);
    }
    if (!ex.collectionIds.includes(collectionId)) {
      ex.collectionIds.push(collectionId);
      await db.exercises.put(ex);
    }
  },

  async removeExerciseFromCollection(collectionId: string, exerciseId: string): Promise<void> {
    const [col, ex] = await Promise.all([
      db.exerciseCollections.get(collectionId),
      db.exercises.get(exerciseId),
    ]);
    if (col) {
      col.exerciseIds = col.exerciseIds.filter((id) => id !== exerciseId);
      await db.exerciseCollections.put(col);
    }
    if (ex) {
      ex.collectionIds = ex.collectionIds.filter((id) => id !== collectionId);
      await db.exercises.put(ex);
    }
  },

  // ── Difficulty Calibration ────────────────────────────────────────────────

  async getCalibration(exerciseId: string): Promise<ExerciseDifficultyCalibration | undefined> {
    return db.difficultyCalibrations.get(exerciseId);
  },

  async saveCalibration(
    exerciseId: string,
    response: DifficultyResponse,
    recommendedLoad: string
  ): Promise<void> {
    const calibration: ExerciseDifficultyCalibration = {
      exerciseId,
      response,
      recommendedLoad,
      date: today(),
    };
    await db.difficultyCalibrations.put(calibration);
  },
};
