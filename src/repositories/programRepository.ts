// ─────────────────────────────────────────────────────────────────────────────
// Program Repository
// ─────────────────────────────────────────────────────────────────────────────
import { db } from "@/lib/db";
import { uid, nowISO } from "@/lib/utils";
import type { Program, ProgramVersion, ProgramStatus } from "@/types";

export const programRepository = {
  async getAll(): Promise<Program[]> {
    return db.programs.orderBy("updatedAt").reverse().toArray();
  },

  async getById(id: string): Promise<Program | undefined> {
    return db.programs.get(id);
  },

  async getActive(): Promise<Program | undefined> {
    return db.programs.where("status").equals("active").first();
  },

  async getByStatus(status: ProgramStatus): Promise<Program[]> {
    return db.programs.where("status").equals(status).toArray();
  },

  /** Save a version snapshot before committing changes. */
  async saveVersion(program: Program, description?: string): Promise<ProgramVersion> {
    const version: ProgramVersion = {
      id: uid(),
      programId: program.id,
      versionNumber: program.versionNumber,
      snapshot: structuredClone(program),
      changeDescription: description,
      createdAt: nowISO(),
    };
    await db.programVersions.add(version);
    return version;
  },

  async upsert(program: Program, saveVersionDescription?: string): Promise<void> {
    if (saveVersionDescription !== undefined) {
      const existing = await db.programs.get(program.id);
      if (existing) await this.saveVersion(existing, saveVersionDescription);
    }
    await db.programs.put({
      ...program,
      versionNumber: program.versionNumber + (saveVersionDescription !== undefined ? 1 : 0),
      updatedAt: nowISO(),
    });
  },

  async duplicate(programId: string): Promise<Program> {
    const original = await db.programs.get(programId);
    if (!original) throw new Error(`Program ${programId} not found`);
    const copy: Program = {
      ...structuredClone(original),
      id: uid(),
      name: `${original.name} (Copy)`,
      status: "draft",
      versionNumber: 1,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    await db.programs.add(copy);
    return copy;
  },

  async setActive(programId: string): Promise<void> {
    // Deactivate all others first
    const activePrograms = await db.programs.where("status").equals("active").toArray();
    await Promise.all(
      activePrograms.map((p) => db.programs.update(p.id, { status: "draft", updatedAt: nowISO() }))
    );
    await db.programs.update(programId, { status: "active", updatedAt: nowISO() });
  },

  async archive(programId: string): Promise<void> {
    await db.programs.update(programId, { status: "archived", updatedAt: nowISO() });
  },

  async delete(programId: string): Promise<void> {
    await db.transaction("rw", [db.programs, db.programVersions], async () => {
      await db.programs.delete(programId);
      await db.programVersions.where("programId").equals(programId).delete();
    });
  },

  // ── Versions ──────────────────────────────────────────────────────────────

  async getVersions(programId: string): Promise<ProgramVersion[]> {
    return db.programVersions
      .where("programId")
      .equals(programId)
      .reverse()
      .sortBy("versionNumber");
  },

  async restoreVersion(versionId: string): Promise<Program> {
    const version = await db.programVersions.get(versionId);
    if (!version) throw new Error(`Version ${versionId} not found`);
    const restored: Program = {
      ...version.snapshot,
      updatedAt: nowISO(),
    };
    await db.programs.put(restored);
    return restored;
  },
};
