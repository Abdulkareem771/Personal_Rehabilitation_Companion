// ─────────────────────────────────────────────────────────────────────────────
// History Repository — Workout sessions, exercise logs, personal records
// ─────────────────────────────────────────────────────────────────────────────
import { db } from "@/lib/db";
import { uid, nowISO, today } from "@/lib/utils";
import type { WorkoutSession, ExerciseLog, PersonalRecord, SessionStatus } from "@/types";

export const historyRepository = {
  // ── Sessions ──────────────────────────────────────────────────────────────

  async createSession(
    partial: Partial<WorkoutSession> & Pick<WorkoutSession, "programId">
  ): Promise<WorkoutSession> {
    const session: WorkoutSession = {
      id: uid(),
      status: "in-progress",
      startedAt: nowISO(),
      exerciseLogIds: [],
      overallPain: 0,
      notes: "",
      ...partial,
    };
    await db.workoutSessions.add(session);
    return session;
  },

  async updateSession(id: string, updates: Partial<WorkoutSession>): Promise<void> {
    await db.workoutSessions.update(id, updates);
  },

  async completeSession(id: string, overallPain: number, notes: string): Promise<void> {
    const session = await db.workoutSessions.get(id);
    if (!session) return;
    const durationMin = Math.round(
      (Date.now() - new Date(session.startedAt).getTime()) / 60000
    );
    await db.workoutSessions.update(id, {
      status: "completed" as SessionStatus,
      completedAt: nowISO(),
      durationMin,
      overallPain,
      notes,
    });
  },

  async getRecentSessions(limit = 30): Promise<WorkoutSession[]> {
    return db.workoutSessions
      .orderBy("startedAt")
      .reverse()
      .limit(limit)
      .toArray();
  },

  async getSessionsByDate(date: string): Promise<WorkoutSession[]> {
    return db.workoutSessions
      .filter((s) => s.startedAt.startsWith(date))
      .toArray();
  },

  async hasCompletedSessionToday(): Promise<boolean> {
    const sessions = await this.getSessionsByDate(today());
    return sessions.some((s) => s.status === "completed");
  },

  // ── Exercise Logs ─────────────────────────────────────────────────────────

  async logExercise(log: Omit<ExerciseLog, "id">): Promise<ExerciseLog> {
    const record: ExerciseLog = { id: uid(), ...log };
    await db.exerciseLogs.add(record);

    // Attach log id to parent session
    const session = await db.workoutSessions.get(log.sessionId);
    if (session) {
      await db.workoutSessions.update(log.sessionId, {
        exerciseLogIds: [...session.exerciseLogIds, record.id],
      });
    }

    // Check for personal record
    await this._checkPersonalRecord(record);

    return record;
  },

  async getLogsForExercise(exerciseId: string, limit = 20): Promise<ExerciseLog[]> {
    return db.exerciseLogs
      .where("exerciseId")
      .equals(exerciseId)
      .reverse()
      .limit(limit)
      .sortBy("date");
  },

  async getLogsForSession(sessionId: string): Promise<ExerciseLog[]> {
    return db.exerciseLogs.where("sessionId").equals(sessionId).toArray();
  },

  // ── Personal Records ──────────────────────────────────────────────────────

  async getPersonalRecord(exerciseId: string): Promise<PersonalRecord | undefined> {
    return db.personalRecords.where("exerciseId").equals(exerciseId).first();
  },

  async getAllPersonalRecords(): Promise<PersonalRecord[]> {
    return db.personalRecords.orderBy("date").reverse().toArray();
  },

  async _checkPersonalRecord(log: ExerciseLog): Promise<void> {
    const bestSet = log.sets.reduce<{ weight: number; reps: number; volume: number } | null>(
      (best, set) => {
        if (!set.completed || !set.reps) return best;
        const w = set.weight ?? 0;
        const volume = w * set.reps;
        if (!best || volume > best.volume) {
          return { weight: w, reps: set.reps, volume };
        }
        return best;
      },
      null
    );

    if (!bestSet) return;

    const existing = await this.getPersonalRecord(log.exerciseId);
    if (!existing || bestSet.volume > (existing.volume ?? 0)) {
      const pr: PersonalRecord = {
        id: uid(),
        exerciseId: log.exerciseId,
        date: log.date,
        weight: bestSet.weight,
        reps: bestSet.reps,
        volume: bestSet.volume,
      };
      await db.personalRecords.put(pr);
      // Mark the log as a PR
      await db.exerciseLogs.update(log.id, { personalRecord: true });
    }
  },
};
