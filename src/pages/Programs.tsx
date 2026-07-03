import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar, CheckCircle2, Play, ShieldAlert, Clock, Layers, History,
  GitBranch, FileDiff, Plus, Edit3, Trash2, Save, PlusCircle
} from "lucide-react";
import { usePrograms, useExercises, useProgramVersions } from "@/hooks/useData";
import { useAppStore } from "@/store/appStore";
import { db } from "@/lib/db";
import { uid, nowISO } from "@/lib/utils";
import type { ProgramVersion, Day, Block, ProgramExercise } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function Programs() {
  const navigate = useNavigate();
  const programs = usePrograms();
  const allExercises = useExercises();
  const { activeProgramId, setActiveProgramId } = useAppStore();

  const activeProg = programs.find((p) => p.id === activeProgramId) || programs[0];
  const [selectedProgId, setSelectedProgId] = useState<string>(activeProg?.id || "");
  const currentProgram = programs.find((p) => p.id === selectedProgId) || activeProg;

  const versions = useProgramVersions(currentProgram?.id);
  const [changeDescription, setChangeDescription] = useState("");
  const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);
  const [selectedDiffVersion, setSelectedDiffVersion] = useState<ProgramVersion | null>(null);

  // Day schedule edit state
  const [editDayModalOpen, setEditDayModalOpen] = useState(false);
  const [editWeekIdx, setEditWeekIdx] = useState<number>(0);
  const [editDayIdx, setEditDayIdx] = useState<number>(0);
  const [dayState, setDayState] = useState<Day | null>(null);
  const [selectedAddExerciseId, setSelectedAddExerciseId] = useState<string>(allExercises[0]?.id || "");

  const handleActivate = (id: string) => {
    setActiveProgramId(id);
  };

  const getExerciseName = (exId: string) => {
    return allExercises.find((e) => e.id === exId)?.name || exId;
  };

  const handleCreateSnapshot = async () => {
    if (!currentProgram) return;
    const nextVerNum = versions.length > 0
      ? Math.max(...versions.map((v) => v.versionNumber)) + 1
      : 1;

    const newVersion: ProgramVersion = {
      id: uid(),
      programId: currentProgram.id,
      versionNumber: nextVerNum,
      createdAt: nowISO(),
      changeDescription: changeDescription.trim() || `Snapshot v${nextVerNum}`,
      snapshot: JSON.parse(JSON.stringify(currentProgram)),
    };

    await db.programVersions.put(newVersion);
    setChangeDescription("");
    setSnapshotModalOpen(false);
  };

  const handleOpenEditDay = (wIdx: number, dIdx: number, day: Day) => {
    setEditWeekIdx(wIdx);
    setEditDayIdx(dIdx);
    setDayState(JSON.parse(JSON.stringify(day)));
    setEditDayModalOpen(true);
  };

  const handleSaveDaySchedule = async () => {
    if (!currentProgram || !dayState) return;
    const updatedWeeks = [...currentProgram.weeks];
    updatedWeeks[editWeekIdx].days[editDayIdx] = dayState;

    await db.programs.put({
      ...currentProgram,
      weeks: updatedWeeks,
      updatedAt: nowISO(),
    });

    setEditDayModalOpen(false);
  };

  const handleAddExerciseToBlock = (blockIdx: number) => {
    if (!dayState || !selectedAddExerciseId) return;
    const updatedBlocks = [...dayState.blocks];
    updatedBlocks[blockIdx].exercises.push({
      id: uid(),
      exerciseId: selectedAddExerciseId,
      order: updatedBlocks[blockIdx].exercises.length + 1,
      sets: 3,
      reps: "12",
    });
    setDayState({ ...dayState, blocks: updatedBlocks });
  };

  const handleDeleteExerciseFromBlock = (blockIdx: number, exIdx: number) => {
    if (!dayState) return;
    const updatedBlocks = [...dayState.blocks];
    updatedBlocks[blockIdx].exercises.splice(exIdx, 1);
    setDayState({ ...dayState, blocks: updatedBlocks });
  };

  const handleUpdateExSets = (blockIdx: number, exIdx: number, val: number) => {
    if (!dayState) return;
    const updatedBlocks = [...dayState.blocks];
    updatedBlocks[blockIdx].exercises[exIdx].sets = val;
    setDayState({ ...dayState, blocks: updatedBlocks });
  };

  const handleUpdateExReps = (blockIdx: number, exIdx: number, val: string) => {
    if (!dayState) return;
    const updatedBlocks = [...dayState.blocks];
    updatedBlocks[blockIdx].exercises[exIdx].reps = val;
    setDayState({ ...dayState, blocks: updatedBlocks });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <PageHeader
        title="Rehabilitation Protocol Architecture"
        description="Notion-style multi-week clinical program builder. Easily customize day schedules, adjust exercise sets & reps, and save historical version snapshots."
      />

      {/* Program Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-secondary/30 border border-border">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-sm text-foreground">Select Protocol:</span>
          <div className="flex gap-2">
            {programs.map((p) => (
              <Button
                key={p.id}
                variant={currentProgram?.id === p.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedProgId(p.id)}
                className="font-bold text-xs"
              >
                {p.name}
              </Button>
            ))}
          </div>
        </div>

        {currentProgram && (
          <div className="flex items-center gap-3">
            {currentProgram.id === activeProgramId ? (
              <Badge variant="safe" className="gap-1.5 py-1 px-3">
                <CheckCircle2 size={14} /> Active Protocol
              </Badge>
            ) : (
              <Button
                size="sm"
                onClick={() => handleActivate(currentProgram.id)}
                className="font-extrabold text-xs bg-rehab-green hover:bg-rehab-green/90 text-white"
              >
                Activate Protocol
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => setSnapshotModalOpen(true)}
              className="font-extrabold text-xs gap-1.5 border-primary/40 text-primary"
            >
              <GitBranch size={14} /> Create Snapshot
            </Button>
          </div>
        )}
      </div>

      {/* Program Details & Weeks */}
      {currentProgram ? (
        <div className="space-y-8">
          <Card className="border-border shadow-md bg-card">
            <CardHeader className="bg-secondary/20 pb-4 border-b border-border">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-foreground">{currentProgram.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{currentProgram.description}</p>
                </div>
                <Badge className="capitalize font-mono text-xs">{currentProgram.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary" /> {currentProgram.weeks.length} Weeks Duration</span>
              <span className="flex items-center gap-1.5"><Layers size={14} className="text-primary" /> Multi-Phase Progressive Overload</span>
              <span className="flex items-center gap-1.5"><History size={14} className="text-primary" /> {versions.length} Historical Snapshots Saved</span>
            </CardContent>
          </Card>

          {/* Historical Snapshots Section */}
          {versions.length > 0 && (
            <Card className="border-border shadow-sm bg-secondary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <History size={18} className="text-primary" /> Saved Version Snapshots (Diff Inspection)
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {versions.map((ver) => (
                  <Button
                    key={ver.id}
                    size="sm"
                    variant={selectedDiffVersion?.id === ver.id ? "default" : "outline"}
                    onClick={() => setSelectedDiffVersion(selectedDiffVersion?.id === ver.id ? null : ver)}
                    className="text-xs font-mono font-bold"
                  >
                    v{ver.versionNumber}: {ver.changeDescription || "Snapshot"}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Diff Viewer Card if a version is selected */}
          {selectedDiffVersion && (
            <Card className="border-primary/40 bg-primary/5 shadow-md animate-fade-in">
              <CardHeader className="pb-3 border-b border-primary/20 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <FileDiff size={18} className="text-primary" /> Comparing Current Protocol vs. Snapshot v{selectedDiffVersion.versionNumber} ({selectedDiffVersion.changeDescription || "Snapshot"})
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Created at: {new Date(selectedDiffVersion.createdAt).toLocaleString()}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setSelectedDiffVersion(null)} className="h-7 text-xs">Close Comparison</Button>
              </CardHeader>
              <CardContent className="pt-4 grid md:grid-cols-2 gap-6 text-xs font-mono">
                <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                  <span className="font-extrabold text-muted-foreground block border-b pb-1">Historical Snapshot v{selectedDiffVersion.versionNumber}</span>
                  <p className="text-foreground">Weeks Count: {selectedDiffVersion.snapshot.weeks.length}</p>
                  <p className="text-muted-foreground">Description: {selectedDiffVersion.snapshot.description}</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-primary/40 space-y-2">
                  <span className="font-extrabold text-primary block border-b pb-1">Current Active Protocol Structure</span>
                  <p className="text-foreground">Weeks Count: {currentProgram.weeks.length}</p>
                  <p className="text-muted-foreground">Description: {currentProgram.description}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weeks & Days Matrix */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-foreground tracking-tight">Protocol Schedule Matrix</h3>
            <div className="grid gap-6">
              {currentProgram.weeks.map((week, wIdx) => (
                <Card key={week.id} className="border-border shadow-sm">
                  <CardHeader className="bg-secondary/15 pb-3 border-b flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-extrabold text-foreground">
                        Week {week.weekNumber}
                      </CardTitle>
                    </div>
                    <Badge variant="outline" className="font-mono font-bold text-xs">
                      {week.days.length} Days / Week
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
                    {week.days.map((day, dIdx) => (
                      <div key={day.id} className="p-5 rounded-2xl border bg-card/60 space-y-4 shadow-sm relative group">
                        <div className="flex justify-between items-center border-b pb-3">
                          <div>
                            <h4 className="font-extrabold text-sm text-foreground">{day.name}</h4>
                            <span className="text-xs text-muted-foreground font-medium">{day.notes || (day.isRestDay ? "Rest & Recovery" : "Active Rehab Session")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {day.isRestDay ? (
                              <Badge variant="outline" className="gap-1">Rest Day</Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1"><Play size={10} /> Active</Badge>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleOpenEditDay(wIdx, dIdx, day)}
                              className="h-8 w-8 text-primary hover:bg-primary/10 rounded-lg shrink-0"
                              title="Edit Day Schedule & Exercises"
                            >
                              <Edit3 size={15} />
                            </Button>
                          </div>
                        </div>

                        {/* Blocks */}
                        <div className="space-y-3">
                          {day.blocks.map((block: Block) => (
                            <div key={block.id} className="p-3 rounded-xl bg-secondary/30 space-y-2">
                              <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-extrabold">
                                {block.type}
                              </Badge>
                              <h5 className="font-bold text-xs text-foreground">{block.name}</h5>
                              <ul className="space-y-1.5 pt-1">
                                {block.exercises.map((pe: ProgramExercise) => (
                                  <li key={pe.id} className="text-xs text-muted-foreground flex justify-between items-center">
                                    <span className="truncate font-medium pr-2">{getExerciseName(pe.exerciseId)}</span>
                                    <span className="font-bold text-foreground shrink-0 font-mono bg-card px-2 py-0.5 rounded border">{pe.sets}x{pe.reps || "12"}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground font-bold">No program selected.</p>
        </Card>
      )}

      {/* Create Version Snapshot Modal */}
      <Dialog open={snapshotModalOpen} onOpenChange={setSnapshotModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Protocol Version Snapshot</DialogTitle>
            <DialogDescription>
              Save an exact snapshot of this protocol before making changes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold block mb-1">Snapshot Note / Rationale</label>
              <input
                type="text"
                placeholder="e.g. Swapped wall slides for serratus punch"
                value={changeDescription}
                onChange={(e) => setChangeDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl border bg-card text-sm focus:outline-none focus:border-primary font-medium"
              />
            </div>
            <Button onClick={handleCreateSnapshot} className="w-full font-extrabold">
              Save Snapshot
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Interactive Day Schedule & Block Editor Modal */}
      <Dialog open={editDayModalOpen} onOpenChange={setEditDayModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 size={18} className="text-primary" /> Edit Day Schedule: {dayState?.name}
            </DialogTitle>
            <DialogDescription>
              Customize session type, notes, and specific exercise prescriptions for this day. Changes save instantly to IndexedDB.
            </DialogDescription>
          </DialogHeader>

          {dayState && (
            <div className="space-y-6 pt-2">
              {/* Day Basics */}
              <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-secondary/20 border">
                <div>
                  <label className="text-xs font-bold block mb-1">Day Name</label>
                  <input
                    type="text"
                    value={dayState.name}
                    onChange={(e) => setDayState({ ...dayState, name: e.target.value })}
                    className="w-full p-2 rounded-xl border bg-card text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Session Type</label>
                  <button
                    onClick={() => setDayState({ ...dayState, isRestDay: !dayState.isRestDay })}
                    className={`w-full p-2 rounded-xl border font-bold text-xs transition-all ${
                      dayState.isRestDay
                        ? "bg-secondary text-muted-foreground border-border"
                        : "bg-rehab-green/10 text-rehab-green border-rehab-green/30"
                    }`}
                  >
                    {dayState.isRestDay ? "💤 Rest & Recovery Day" : "⚡ Active Workout Session"}
                  </button>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold block mb-1">Day Focus / Notes</label>
                  <input
                    type="text"
                    value={dayState.notes || ""}
                    onChange={(e) => setDayState({ ...dayState, notes: e.target.value })}
                    placeholder="e.g. Focus on keeping scapula depressed"
                    className="w-full p-2 rounded-xl border bg-card text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Blocks Editor */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-sm text-foreground">Workout Blocks & Exercise Prescription</h4>
                {dayState.blocks.map((block: Block, bIdx: number) => (
                  <div key={block.id} className="p-4 rounded-2xl border bg-card space-y-3 shadow-sm">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="font-extrabold text-xs uppercase tracking-wider text-primary">
                        {block.type}: {block.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">{block.exercises.length} Exercises</span>
                    </div>

                    <div className="space-y-2">
                      {block.exercises.map((ex: ProgramExercise, eIdx: number) => (
                        <div key={ex.id} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-secondary/20 border">
                          <span className="font-bold text-xs text-foreground truncate max-w-[180px] sm:max-w-[240px]">
                            {getExerciseName(ex.exerciseId)}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-bold text-muted-foreground">Sets:</span>
                            <input
                              type="number"
                              value={ex.sets}
                              onChange={(e) => handleUpdateExSets(bIdx, eIdx, Number(e.target.value))}
                              className="w-12 p-1 text-center rounded border bg-background text-xs font-mono font-bold"
                            />
                            <span className="text-[10px] font-bold text-muted-foreground ml-1">Reps:</span>
                            <input
                              type="text"
                              value={ex.reps || ""}
                              onChange={(e) => handleUpdateExReps(bIdx, eIdx, e.target.value)}
                              className="w-14 p-1 text-center rounded border bg-background text-xs font-mono font-bold"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteExerciseFromBlock(bIdx, eIdx)}
                              className="h-7 w-7 text-destructive hover:bg-destructive/10 ml-1 rounded"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Exercise Bar */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <select
                        value={selectedAddExerciseId}
                        onChange={(e) => setSelectedAddExerciseId(e.target.value)}
                        className="flex-1 p-1.5 rounded-xl border bg-background text-xs font-semibold focus:outline-none"
                      >
                        {allExercises.map((ae) => (
                          <option key={ae.id} value={ae.id}>
                            + {ae.name} ({ae.category})
                          </option>
                        ))}
                      </select>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAddExerciseToBlock(bIdx)}
                        className="h-8 text-xs font-bold gap-1 shrink-0"
                      >
                        <PlusCircle size={14} /> Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setEditDayModalOpen(false)} className="font-bold">
                  Cancel
                </Button>
                <Button onClick={handleSaveDaySchedule} className="font-extrabold gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Save size={16} /> Save Day Schedule
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
