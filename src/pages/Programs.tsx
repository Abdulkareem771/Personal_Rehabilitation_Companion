import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, CheckCircle2, Play, ShieldAlert, Clock, Layers, History, GitBranch, FileDiff, Plus } from "lucide-react";
import { usePrograms, useExercises, useProgramVersions } from "@/hooks/useData";
import { useAppStore } from "@/store/appStore";
import { db } from "@/lib/db";
import { uid, nowISO } from "@/lib/utils";
import type { ProgramVersion } from "@/types";
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
  const [changeNote, setChangeNote] = useState("");
  const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);
  const [selectedDiffVersion, setSelectedDiffVersion] = useState<ProgramVersion | null>(null);

  const handleActivate = (id: string) => {
    setActiveProgramId(id);
  };

  const getExerciseName = (exId: string) => {
    return allExercises.find((e) => e.id === exId)?.name || exId;
  };

  const handleCreateSnapshot = async () => {
    if (!currentProgram) return;
    const nextVerNum = versions.length > 0
      ? Math.max(...versions.map(v => v.versionNumber)) + 1
      : (currentProgram.versionNumber || 1) + 1;

    const snapshotRecord: ProgramVersion = {
      id: uid(),
      programId: currentProgram.id,
      versionNumber: nextVerNum,
      snapshot: JSON.parse(JSON.stringify(currentProgram)),
      changeDescription: changeNote.trim() || `Protocol snapshot v${nextVerNum} created during rehab progression.`,
      createdAt: nowISO(),
    };

    await db.programVersions.put(snapshotRecord);
    await db.programs.update(currentProgram.id, { versionNumber: nextVerNum });
    setChangeNote("");
    setSnapshotModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <PageHeader
        title="Clinical & Gym Programs"
        description="Structured multi-phase protocols designed to take you from post-acute stabilization back to heavy overhead strength."
      />

      {/* Program Selector Pills */}
      <div className="flex flex-wrap gap-3 pb-2">
        {programs.map((p) => {
          const isSelected = p.id === (currentProgram?.id || "");
          const isActive = p.id === activeProg?.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedProgId(p.id)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-sm transition-all border ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                  : "bg-card text-foreground border-border hover:border-primary/50"
              }`}
            >
              <Calendar size={18} />
              <span>{p.name}</span>
              {isActive && (
                <Badge className="bg-rehab-green text-white border-0 text-[10px] uppercase font-black ml-1">
                  Active
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {currentProgram ? (
        <div className="space-y-8">
          {/* Program Overview Header */}
          <Card className="border-border shadow-md overflow-hidden bg-secondary/10">
            <div className="p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <Badge variant="outline" className="text-xs uppercase font-extrabold text-primary border-primary/30">
                    {currentProgram.type}
                  </Badge>
                  <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                    <Clock size={14} /> {currentProgram.totalWeeks} Weeks Protocol
                  </span>
                  <Badge className="bg-primary/20 text-primary border-0 text-xs font-mono">
                    v{currentProgram.versionNumber || 1}
                  </Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground">{currentProgram.name}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  {currentProgram.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button
                  onClick={() => setSnapshotModalOpen(true)}
                  variant="outline"
                  className="font-extrabold gap-1.5 border-primary/40 text-primary hover:bg-primary/10 shadow-sm"
                >
                  <GitBranch size={16} /> Create Version Snapshot
                </Button>
                {currentProgram.id !== activeProg?.id ? (
                  <Button
                    onClick={() => handleActivate(currentProgram.id)}
                    className="font-extrabold gap-2 shadow-md bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <CheckCircle2 size={18} /> Set as Active Program
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate("/workout")}
                    className="font-extrabold gap-2 shadow-md bg-rehab-green hover:bg-rehab-green/90 text-white"
                  >
                    <Play size={18} fill="currentColor" /> Launch Next Workout
                  </Button>
                )}
              </div>
            </div>

            {/* Safety Banner */}
            <div className="bg-rehab-amber/10 border-t border-rehab-amber/20 px-6 py-3 flex items-center gap-3 text-xs font-bold text-rehab-amber">
              <ShieldAlert size={18} className="shrink-0" />
              <span>Safety Note: {currentProgram.safetyNotes}</span>
            </div>
          </Card>

          {/* Program Version Snapshots & Diffing Engine */}
          <Card className="shadow-md border-border">
            <CardHeader className="bg-secondary/20 pb-4 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History size={20} className="text-primary" /> Immutable Protocol Version History ({versions.length})
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Click any past snapshot to view structural diffs against the current live protocol configuration.
                </p>
              </div>
              <Button onClick={() => setSnapshotModalOpen(true)} size="sm" className="font-extrabold gap-1">
                <Plus size={14} /> Snapshot v{(versions.length > 0 ? Math.max(...versions.map(v => v.versionNumber)) : (currentProgram.versionNumber || 1)) + 1}
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {versions.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {versions.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => setSelectedDiffVersion(selectedDiffVersion?.id === v.id ? null : v)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                        selectedDiffVersion?.id === v.id
                          ? "bg-primary/10 border-primary shadow-sm"
                          : "bg-card border-border hover:border-primary/40 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Badge className="font-mono font-bold">Snapshot v{v.versionNumber}</Badge>
                        <span className="text-[11px] font-mono text-muted-foreground">{v.createdAt.split("T")[0]}</span>
                      </div>
                      <p className="text-xs font-semibold text-foreground leading-relaxed">
                        {v.changeDescription}
                      </p>
                      <div className="text-[11px] font-bold text-primary flex items-center gap-1 pt-1">
                        <FileDiff size={14} /> {selectedDiffVersion?.id === v.id ? "Close Diff Inspection" : "Inspect Protocol Diff"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border rounded-2xl bg-secondary/10 space-y-2">
                  <GitBranch size={28} className="mx-auto text-muted-foreground" />
                  <p className="text-sm font-bold text-foreground">No Version Snapshots Saved Yet</p>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Create a snapshot when you progress resistance bands or volume so you can inspect historical phase changes.
                  </p>
                </div>
              )}

              {/* Diff Viewer Box */}
              {selectedDiffVersion && (
                <div className="p-5 rounded-3xl border-2 border-primary/30 bg-secondary/15 space-y-4 animate-fade-in mt-4">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <h4 className="font-black text-sm text-foreground flex items-center gap-2">
                      <FileDiff size={18} className="text-primary" /> Diff Comparison: v{selectedDiffVersion.versionNumber} vs Live v{currentProgram.versionNumber || 1}
                    </h4>
                    <Button onClick={() => setSelectedDiffVersion(null)} variant="ghost" size="sm" className="h-7 text-xs font-bold">
                      Close Diff
                    </Button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs font-medium">
                    <div className="p-3.5 rounded-2xl bg-background border space-y-1.5">
                      <span className="text-[10px] uppercase font-extrabold text-muted-foreground">Snapshot v{selectedDiffVersion.versionNumber} Structure</span>
                      <p className="font-bold text-foreground">{selectedDiffVersion.snapshot.name}</p>
                      <p className="text-muted-foreground">Weeks: {selectedDiffVersion.snapshot.totalWeeks} | Phase: {selectedDiffVersion.snapshot.currentPhase}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 space-y-1.5">
                      <span className="text-[10px] uppercase font-extrabold text-primary">Current Live v{currentProgram.versionNumber || 1} Structure</span>
                      <p className="font-bold text-foreground">{currentProgram.name}</p>
                      <p className="text-muted-foreground">Weeks: {currentProgram.totalWeeks} | Phase: {currentProgram.currentPhase}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notion-Style Weeks Breakdown */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-foreground flex items-center gap-2">
              <Layers size={22} className="text-primary" /> Protocol Schedule & Weekly Progression
            </h3>

            <div className="grid gap-6">
              {currentProgram.weeks.map((week) => (
                <Card key={week.weekNumber} className="border-border shadow-sm overflow-hidden">
                  <CardHeader className="bg-secondary/20 pb-4 border-b border-border flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>Week {week.weekNumber}{week.goals ? `: ${week.goals}` : ""}</span>
                      </CardTitle>
                    </div>
                    <Badge variant="outline" className="font-mono font-bold text-xs">
                      {week.days.length} Days / Week
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
                    {week.days.map((day) => (
                      <div key={day.id} className="p-5 rounded-2xl border bg-card/60 space-y-4 shadow-sm">
                        <div className="flex justify-between items-center border-b pb-3">
                          <div>
                            <h4 className="font-extrabold text-sm text-foreground">{day.name}</h4>
                            <span className="text-xs text-muted-foreground font-medium">{day.notes || (day.isRestDay ? "Rest & Recovery" : "Active Rehab Session")}</span>
                          </div>
                          {day.isRestDay ? (
                            <Badge variant="outline" className="gap-1">Rest Day</Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1"><Play size={10} /> Active</Badge>
                          )}
                        </div>


                        {/* Blocks */}
                        <div className="space-y-3">
                          {day.blocks.map((block) => (
                            <div key={block.id} className="p-3 rounded-xl bg-secondary/30 space-y-2">
                              <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-extrabold">
                                {block.type}
                              </Badge>
                              <h5 className="font-bold text-xs text-foreground">{block.name}</h5>
                              <ul className="space-y-1 pt-1">
                                {block.exercises.map((pe) => (
                                  <li key={pe.id} className="text-xs text-muted-foreground flex justify-between">
                                    <span className="truncate font-medium pr-2">{getExerciseName(pe.exerciseId)}</span>
                                    <span className="font-bold text-foreground shrink-0">{pe.sets}x{pe.reps}</span>
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
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="text-primary" size={20} /> Snapshot Protocol Version
            </DialogTitle>
            <DialogDescription>
              Create an immutable snapshot of {currentProgram?.name} before altering exercises or sets.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase text-muted-foreground">Change Description / Clinical Rationale</label>
              <textarea
                value={changeNote}
                onChange={(e) => setChangeNote(e.target.value)}
                placeholder="e.g. Phase 2 progression: increased isometric hold duration to 45s and introduced red resistance band."
                className="w-full h-24 p-3 rounded-xl border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setSnapshotModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateSnapshot} className="font-extrabold gap-1.5 shadow-md">
                <GitBranch size={16} /> Save Snapshot
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
