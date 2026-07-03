// ─────────────────────────────────────────────────────────────────────────────
// Recovery Repository — daily check-ins, streaks, checklists, posture sessions
// ─────────────────────────────────────────────────────────────────────────────
import { db } from "@/lib/db";
import { uid, nowISO, today } from "@/lib/utils";
import { calculateRecoveryScore } from "@/utils/recoveryScore";
import type {
  RecoveryEntry,
  DailyChecklist,
  PostureSession,
  StreakRecord,
  StreakDimension,
  RecoveryWeights,
  DEFAULT_RECOVERY_WEIGHTS,
} from "@/types";

// Silence the unused import — DEFAULT_RECOVERY_WEIGHTS is used in seeding but
// declared here for visibility. Actual runtime default loaded from profile.
void (null as typeof DEFAULT_RECOVERY_WEIGHTS | null);

export const recoveryRepository = {
  // ── Recovery Entries ──────────────────────────────────────────────────────

  async getTodayEntry(): Promise<RecoveryEntry | undefined> {
    return db.recoveryEntries.where("date").equals(today()).first();
  },

  async getEntries(limit = 30): Promise<RecoveryEntry[]> {
    return db.recoveryEntries.orderBy("date").reverse().limit(limit).toArray();
  },

  async saveEntry(
    data: Omit<RecoveryEntry, "id" | "score">,
    weights: RecoveryWeights
  ): Promise<RecoveryEntry> {
    const score = calculateRecoveryScore(data, weights);
    const existing = await this.getTodayEntry();

    const entry: RecoveryEntry = {
      ...data,
      id: existing?.id ?? uid(),
      score,
    };
    await db.recoveryEntries.put(entry);
    await this.updateStreak("recovery");
    return entry;
  },

  // ── Daily Checklist ───────────────────────────────────────────────────────

  async getTodayChecklist(): Promise<DailyChecklist> {
    const existing = await db.dailyChecklists.where("date").equals(today()).first();
    if (existing) return existing;
    const checklist: DailyChecklist = { id: uid(), date: today(), completedItemIds: [] };
    await db.dailyChecklists.add(checklist);
    return checklist;
  },

  async toggleChecklistItem(itemId: string): Promise<DailyChecklist> {
    const checklist = await this.getTodayChecklist();
    const isCompleted = checklist.completedItemIds.includes(itemId);
    const updated: DailyChecklist = {
      ...checklist,
      completedItemIds: isCompleted
        ? checklist.completedItemIds.filter((id) => id !== itemId)
        : [...checklist.completedItemIds, itemId],
    };
    await db.dailyChecklists.put(updated);
    return updated;
  },

  // ── Posture Sessions ──────────────────────────────────────────────────────

  async savePostureSession(
    completedExerciseIds: string[],
    durationSec: number,
    notes?: string
  ): Promise<PostureSession> {
    const session: PostureSession = {
      id: uid(),
      date: today(),
      completedExerciseIds,
      durationSec,
      notes,
    };
    await db.postureSessions.add(session);
    await this.updateStreak("posture");
    return session;
  },

  async hasPostureSessionToday(): Promise<boolean> {
    const count = await db.postureSessions.where("date").equals(today()).count();
    return count > 0;
  },

  // ── Streaks ───────────────────────────────────────────────────────────────

  async getStreak(dimension: StreakDimension): Promise<StreakRecord> {
    const existing = await db.streaks.get(dimension);
    if (existing) return existing;
    return {
      dimension,
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: "",
      history: [],
    };
  },

  async getAllStreaks(): Promise<StreakRecord[]> {
    return db.streaks.toArray();
  },

  async updateStreak(dimension: StreakDimension): Promise<StreakRecord> {
    const todayStr = today();
    const record = await this.getStreak(dimension);

    if (record.lastCompletedDate === todayStr) return record; // already updated today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const isConsecutive = record.lastCompletedDate === yesterdayStr;
    const newCurrent = isConsecutive ? record.currentStreak + 1 : 1;

    const updated: StreakRecord = {
      dimension,
      currentStreak: newCurrent,
      longestStreak: Math.max(record.longestStreak, newCurrent),
      lastCompletedDate: todayStr,
      history: [...record.history, todayStr].slice(-365), // keep 1 year
    };

    await db.streaks.put(updated);
    return updated;
  },
};
