import { useNavigate } from "react-router-dom";
import { Dumbbell, BookOpen, UserCheck, Activity, CheckCircle2, Circle, Flame, ShieldCheck, ArrowRight } from "lucide-react";
import { useProfile, useActiveProgram, useGoals } from "@/hooks/useData";
import { useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { greeting } from "@/utils/formatters";
import React, { useState } from "react";

export function Dashboard() {
  const navigate = useNavigate();
  const profile = useProfile();
  const activeProgram = useActiveProgram();
  const goals = useGoals();
  const userName = profile?.name || "Abdulkareem";

  // Temporary local checklist state for today
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Take morning rehabilitation supplements", done: true },
    { id: 2, text: "Complete 10-minute posture routine", done: false },
    { id: 3, text: "Log morning shoulder pain & stability", done: true },
    { id: 4, text: "Complete Phase 1 Day A Workout", done: false },
    { id: 5, text: "Reach 2.5L daily hydration target", done: false },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(checklist.map(c => c.id === id ? { ...c, done: !c.done } : c));
  };

  const completedCount = checklist.filter(c => c.done).length;
  const checklistPct = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-rehab-blue p-6 sm:p-8 md:p-10 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 grid gap-6 md:grid-cols-3 items-center">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <Badge className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border-0">
                <ShieldCheck size={14} className="mr-1.5" /> Phase 1 Rehab Active
              </Badge>
              <span className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1">
                <Flame size={14} className="text-rehab-amber fill-rehab-amber" /> 4 Day Streak
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none">
              {greeting(userName)}!
            </h1>
            <p className="text-sm sm:text-base text-white/85 max-w-xl font-medium leading-relaxed">
              Your Bankart stabilization protocol is on track. Let's build solid posterior cuff tension and bulletproof scapular mechanics today.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                onClick={() => navigate("/workout")}
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-extrabold shadow-lg gap-2"
              >
                <Dumbbell size={18} /> Start Today's Workout
              </Button>
              <Button
                onClick={() => navigate("/posture")}
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 font-bold backdrop-blur-md"
              >
                <UserCheck size={18} className="mr-2" /> Posture Routine
              </Button>
            </div>
          </div>

          {/* Recovery Score Dial */}
          <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-inner">
            <span className="text-xs font-extrabold uppercase tracking-widest text-white/80 mb-2">
              Shoulder Readiness
            </span>
            <div className="relative flex items-center justify-center h-32 w-32 rounded-full border-8 border-white/20 border-t-rehab-green border-r-rehab-green shadow-lg">
              <div className="text-center">
                <span className="text-3xl font-black block">84%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rehab-green bg-white/90 px-2 py-0.5 rounded-full mt-1 inline-block shadow-sm">
                  Optimal
                </span>
              </div>
            </div>
            <span className="text-xs text-white/80 mt-3 text-center font-medium">
              Pain: 1/10 · Sleep: 7.5h
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Active Program & Daily Checklist */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Current Program Status */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-border shadow-md">
            <CardHeader className="bg-secondary/40 border-b border-border pb-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-primary block mb-1">
                    Current Clinical Protocol
                  </span>
                  <CardTitle className="text-xl">
                    {activeProgram ? activeProgram.name : "Phase 1: Rotator Cuff Stabilization"}
                  </CardTitle>
                </div>
                <Badge variant="safe">Week 1 of 6</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-muted-foreground">Protocol Completion</span>
                  <span className="text-foreground font-black">16%</span>
                </div>
                <Progress value={16} className="h-2.5" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-2">
                  <span className="text-xs font-extrabold uppercase text-muted-foreground">Up Next</span>
                  <p className="font-bold text-base text-foreground">Day A: Rotator Cuff Focus</p>
                  <p className="text-xs text-muted-foreground">5 exercises · 18 mins · Band & Bodyweight</p>
                  <Button
                    size="sm"
                    onClick={() => navigate("/workout")}
                    className="w-full mt-2 font-bold"
                  >
                    Launch Session <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-2">
                  <span className="text-xs font-extrabold uppercase text-muted-foreground">Clinical Focus</span>
                  <p className="font-bold text-sm text-foreground leading-snug">
                    Zero anterior subluxation or mechanical clicking during reaching.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate("/programs")}
                    className="w-full mt-2 font-bold"
                  >
                    View Full 6-Week Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals Tracker */}
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Clinical Milestones</span>
                <Badge variant="outline">{goals.length} Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((g) => (
                <div key={g.id} className="p-3.5 rounded-xl border border-border bg-secondary/20 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-sm text-foreground">{g.title}</span>
                    <Badge className="text-[10px] uppercase font-bold capitalize">{g.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{g.description}</p>
                  <div className="flex items-center gap-3 pt-1">
                    <Progress value={g.progressPct} className="h-2 flex-1" />
                    <span className="text-xs font-extrabold text-foreground">{g.progressPct}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Today's Rehab Checklist & Quick Access */}
        <div className="space-y-6">
          <Card className="shadow-md">
            <CardHeader className="pb-3 border-b border-border bg-secondary/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-extrabold">Today's Protocol</CardTitle>
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                  {completedCount}/{checklist.length} Done
                </span>
              </div>
              <Progress value={checklistPct} className="h-1.5 mt-2" />
            </CardHeader>
            <CardContent className="pt-4 space-y-2.5">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${
                    item.done
                      ? "bg-rehab-green/10 border-rehab-green/30 text-muted-foreground line-through"
                      : "bg-card border-border hover:border-primary/50 text-foreground"
                  }`}
                >
                  {item.done ? (
                    <CheckCircle2 size={18} className="text-rehab-green shrink-0 mt-0.5" />
                  ) : (
                    <Circle size={18} className="text-muted-foreground shrink-0 mt-0.5" />
                  )}
                  <span className="text-xs sm:text-sm font-semibold leading-snug">{item.text}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Quick Action Shortcuts */}
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-extrabold">Quick Vault Access</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2.5">
              <Button
                variant="outline"
                onClick={() => navigate("/knowledge")}
                className="h-auto py-3.5 flex flex-col items-center gap-2 border-border hover:border-primary/50"
              >
                <BookOpen size={20} className="text-primary" />
                <span className="text-xs font-bold">Knowledge Base</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/health")}
                className="h-auto py-3.5 flex flex-col items-center gap-2 border-border hover:border-primary/50"
              >
                <Activity size={20} className="text-rehab-blue" />
                <span className="text-xs font-bold">Recovery Log</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
