import { useState } from "react";
import { TrendingUp, Trophy, Flame, CheckCircle2, Plus, Target, Trash2, ArrowUpRight } from "lucide-react";
import { useGoals, useExerciseLogs } from "@/hooks/useData";
import { VolumePainChart } from "@/components/analytics/VolumePainChart";
import { db } from "@/lib/db";
import { uid, nowISO } from "@/lib/utils";
import type { Goal } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function Progress() {
  const goals = useGoals();
  const allLogs = useExerciseLogs();

  const [modalOpen, setModalOpen] = useState(false);

  // New goal form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<"short-term" | "mid-term" | "long-term">("short-term");

  const handleCreateGoal = async () => {
    if (!newTitle.trim()) return;
    const goal: Goal = {
      id: uid(),
      type: newType,
      title: newTitle.trim(),
      description: newDesc.trim() || "Prescribed clinical milestone target.",
      status: "active",
      progressPct: 0,
      createdAt: nowISO(),
    };
    await db.goals.put(goal);
    setNewTitle("");
    setNewDesc("");
    setModalOpen(false);
  };

  const handleUpdateProgress = async (id: string, currentPct: number, delta: number) => {
    const next = Math.max(0, Math.min(100, currentPct + delta));
    const status = next === 100 ? "completed" : "active";
    await db.goals.update(id, { progressPct: next, status });
  };

  const handleDeleteGoal = async (id: string) => {
    await db.goals.delete(id);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <PageHeader
        title="Rehabilitation Analytics & Clinical Milestones"
        description="Visual evidence of joint stabilization, pain reduction, and active milestone progression stored in Dexie DB."
      />

      {/* Analytics Grid */}
      <div className="grid gap-6 sm:grid-cols-3">
        <Card className="border-border shadow-sm">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-rehab-amber/10 text-rehab-amber flex items-center justify-center font-black">
              <Flame size={24} />
            </div>
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase">Current Streak</span>
              <p className="text-2xl font-black text-foreground">4 Days</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-rehab-green/10 text-rehab-green flex items-center justify-center font-black">
              <TrendingUp size={24} />
            </div>
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase">Pain Reduction</span>
              <p className="text-2xl font-black text-foreground">-75%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
              <Trophy size={24} />
            </div>
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase">Goals Achieved</span>
              <p className="text-2xl font-black text-foreground">
                {goals.filter((g) => g.status === "completed" || g.progressPct === 100).length} / {goals.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aggregate Volume vs Pain Trajectory */}

      <VolumePainChart
        data={allLogs.map((log) => {
          const vol = log.sets.reduce((acc, s) => acc + ((s.weight || 10) * (s.reps || 10)), 0);
          return {
            date: log.date,
            label: log.date.split("T")[0].slice(5),
            volume: vol,
            pain: log.overallPain || 0,
          };
        })}
        title="Aggregate Training Volume vs. Shoulder Discomfort"
        subtitle="Longitudinal correlation across all completed sets and sessions."
      />

      {/* Interactive Clinical Goals & Milestones */}
      <Card className="shadow-md border-border">

        <CardHeader className="bg-secondary/20 pb-4 border-b border-border flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target size={20} className="text-primary" /> Active Clinical Milestones & Goals ({goals.length})
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click the step buttons to update milestone completion percentages live in your local database.
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="font-extrabold gap-1.5 shadow-sm shrink-0">
            <Plus size={16} /> Add Clinical Goal
          </Button>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {goals.map((g) => {
            const isDone = g.status === "completed" || g.progressPct === 100;

            return (
              <div
                key={g.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  isDone
                    ? "bg-rehab-green/5 border-rehab-green/30"
                    : "bg-card border-border hover:border-primary/40 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isDone ? "safe" : "outline"}
                        className="text-[10px] uppercase tracking-wider font-extrabold"
                      >
                        {g.type}
                      </Badge>
                      {isDone && (
                        <span className="text-xs font-bold text-rehab-green flex items-center gap-1">
                          <CheckCircle2 size={14} /> Clinical Criterion Met
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-base text-foreground leading-snug">{g.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{g.description}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteGoal(g.id)}
                      className="text-muted-foreground hover:text-rehab-red h-8 w-8 p-0"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                {/* Progress bar & Quick step toggles */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="text-foreground font-black">{g.progressPct}%</span>
                  </div>
                  <ProgressBar value={g.progressPct} className="h-2" />
                  
                  <div className="flex justify-end gap-2 pt-1">
                    {!isDone ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateProgress(g.id, g.progressPct, 20)}
                          className="h-7 text-[11px] font-bold"
                        >
                          +20% Progress
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateProgress(g.id, g.progressPct, 100 - g.progressPct)}
                          className="h-7 text-[11px] font-bold bg-rehab-green hover:bg-rehab-green/90 text-white gap-1"
                        >
                          <CheckCircle2 size={12} /> Mark Achieved
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateProgress(g.id, 100, -20)}
                        className="h-7 text-[11px] font-bold text-muted-foreground"
                      >
                        Reopen Milestone
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {goals.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm font-bold">
              No active clinical milestones. Click "Add Clinical Goal" above to create one.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Goal Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl">Create Clinical Milestone</DialogTitle>
            <DialogDescription>
              Set a tangible stability or strength benchmark for your shoulder recovery protocol.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">Milestone Title</label>
              <input
                type="text"
                placeholder="e.g. Zero clicking during reaching overhead"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">Clinical Rationale / Description</label>
              <textarea
                placeholder="Specific criteria required to verify joint stabilization..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-xl border border-border bg-background text-sm font-medium focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1.5">Timeline Horizon</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "short-term", label: "Short Term" },
                  { id: "mid-term", label: "Mid Term" },
                  { id: "long-term", label: "Long Term" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setNewType(t.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      newType === t.id
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-secondary text-muted-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateGoal} className="font-extrabold px-6 shadow-md">Create Goal</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
