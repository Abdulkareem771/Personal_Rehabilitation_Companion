// ─────────────────────────────────────────────────────────────────────────────
// Goals Repository
// ─────────────────────────────────────────────────────────────────────────────
import { db } from "@/lib/db";
import { uid, nowISO } from "@/lib/utils";
import type { Goal, Milestone, GoalStatus } from "@/types";

export const goalsRepository = {
  async getGoals(): Promise<Goal[]> {
    return db.goals.orderBy("createdAt").toArray();
  },

  async getActiveGoals(): Promise<Goal[]> {
    return db.goals.where("status").equals("active").toArray();
  },

  async upsertGoal(goal: Goal): Promise<void> {
    await db.goals.put(goal);
  },

  async createGoal(data: Omit<Goal, "id" | "createdAt">): Promise<Goal> {
    const goal: Goal = { id: uid(), createdAt: nowISO(), ...data };
    await db.goals.add(goal);
    return goal;
  },

  async updateProgress(id: string, progressPct: number): Promise<void> {
    await db.goals.update(id, { progressPct: Math.min(100, Math.max(0, progressPct)) });
  },

  async completeGoal(id: string): Promise<void> {
    await db.goals.update(id, {
      status: "completed" as GoalStatus,
      progressPct: 100,
      completedAt: nowISO(),
    });
  },

  async deleteGoal(id: string): Promise<void> {
    await db.goals.delete(id);
  },

  // ── Milestones ────────────────────────────────────────────────────────────

  async getMilestones(programId?: string): Promise<Milestone[]> {
    if (programId) {
      return db.milestones.where("programId").equals(programId).toArray();
    }
    return db.milestones.orderBy("createdAt").toArray();
  },

  async createMilestone(data: Omit<Milestone, "id" | "createdAt">): Promise<Milestone> {
    const milestone: Milestone = { id: uid(), createdAt: nowISO(), ...data };
    await db.milestones.add(milestone);
    return milestone;
  },

  async achieveMilestone(id: string): Promise<void> {
    await db.milestones.update(id, { achieved: true, achievedDate: nowISO().slice(0, 10) });
  },

  async deleteMilestone(id: string): Promise<void> {
    await db.milestones.delete(id);
  },
};
