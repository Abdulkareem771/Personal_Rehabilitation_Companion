import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dumbbell, BookOpen, UserCheck, Activity, CheckCircle2, Circle, Flame,
  ShieldCheck, ArrowRight, Sparkles, Sliders, HelpCircle, AlertTriangle, Cpu,
  Calendar, History, MessageSquareQuote, Zap, LayoutDashboard, Sun, Trophy
} from "lucide-react";
import { useProfile, useActiveProgram, useGoals, useWeeklyReviews, useExercises } from "@/hooks/useData";
import { useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { greeting } from "@/utils/formatters";
import { evaluateClinicalContext } from "@/clinical/recommendationEngine";
import { simulationPresets, type SimulationPreset } from "@/clinical/simulations";
import type { ClinicalContext } from "@/clinical/types";

export function Dashboard() {
  const navigate = useNavigate();
  const profile = useProfile();
  const activeProgram = useActiveProgram();
  const goals = useGoals();
  const weeklyReviews = useWeeklyReviews();
  const allExercises = useExercises();
  const userName = profile?.name || "Abdulkareem";

  // Resolve today's exercises for visual preview
  const firstDay = activeProgram?.weeks[0]?.days[0];
  const todayExerciseItems = firstDay?.blocks.flatMap((b) => b.exercises) || [];
  const todayExercises = todayExerciseItems
    .map((item) => allExercises.find((ex) => ex.id === item.exerciseId))
    .filter(Boolean);

  // Streamlined UX tab state
  const [activeTab, setActiveTab] = useState<"daily" | "simulator" | "weekly">("daily");

  const [selectedReviewIdx, setSelectedReviewIdx] = useState(0);
  const currentReview = weeklyReviews[selectedReviewIdx] || weeklyReviews[0];
  const [showAskAIWhy, setShowAskAIWhy] = useState(false);

  // Morning Check-In state
  const today = new Date().toISOString().slice(0, 10);
  const checkInStorageKey = `reforge-checkin-${today}`;
  const [checkInDone, setCheckInDone] = useState(() => !!localStorage.getItem(checkInStorageKey));
  const [checkInPain,  setCheckInPain]  = useState<number | null>(null);
  const [checkInSleep, setCheckInSleep] = useState<number | null>(null);
  const [checkInEnergy,setCheckInEnergy]= useState<number | null>(null);

  const handleCheckInTap = (type: "pain" | "sleep" | "energy", val: number) => {
    if (type === "pain")   setCheckInPain(val);
    if (type === "sleep")  setCheckInSleep(val);
    if (type === "energy") setCheckInEnergy(val);
    const newPain   = type === "pain"   ? val : checkInPain;
    const newSleep  = type === "sleep"  ? val : checkInSleep;
    const newEnergy = type === "energy" ? val : checkInEnergy;
    if (newPain !== null && newSleep !== null && newEnergy !== null) {
      setTimeout(() => {
        localStorage.setItem(checkInStorageKey, JSON.stringify({ pain: newPain, sleep: newSleep, energy: newEnergy }));
        setCheckInDone(true);
      }, 1200);
    }
  };

  // Checklist state
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

  // Live CDSS Context simulation state
  const [simContext, setSimContext] = useState<ClinicalContext>({
    painLevel: 1,
    sleepHours: 8,
    fatigueLevel: 2,
    proteinGrams: 150,
    compliancePct: 90,
    shoulderAbductionDeg: 165,
    externalRotationDeg: 72,
    shoulderStatus: "stable",
    rolling7DayPainAvg: 1.4,
  });

  const [showTrace, setShowTrace] = useState(false);
  const evaluation = evaluateClinicalContext(simContext);

  const handleApplyPreset = (preset: SimulationPreset) => {
    setSimContext(preset.context);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-rehab-blue p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 grid gap-5 md:grid-cols-3 items-center">
          <div className="md:col-span-2 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border-0">
                <ShieldCheck size={14} className="mr-1.5" /> Phase 1 Rehab Active
              </Badge>
              <Badge className="bg-rehab-green text-white border-0 font-mono text-xs font-black">
                Recovery Score: 88%
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
              {greeting(userName)}.
            </h1>
            <p className="text-white/85 text-xs sm:text-sm max-w-xl font-medium leading-relaxed">
              Your recovery engine reports stable tissue adaptation. Today's session targets rotator cuff endurance and scapular rhythm.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col justify-between gap-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-extrabold text-white/75 tracking-wider">Daily Adherence</span>
              <Flame size={18} className="text-rehab-amber fill-rehab-amber" />
            </div>
            <div>
              <span className="text-2xl font-black text-white font-mono">14 Day Streak</span>
              <p className="text-[11px] text-white/80 mt-0.5">Consistent protocol compliance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Streamlined View Switcher Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-secondary/50 border border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab("daily")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all shrink-0 ${
            activeTab === "daily"
              ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          }`}
        >
          <Zap size={15} /> Daily Action Plan
        </button>
        <button
          onClick={() => setActiveTab("simulator")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all shrink-0 ${
            activeTab === "simulator"
              ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          }`}
        >
          <Sliders size={15} /> CDSS Clinical Simulator
        </button>
        <button
          onClick={() => setActiveTab("weekly")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all shrink-0 ${
            activeTab === "weekly"
              ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          }`}
        >
          <Calendar size={15} /> Weekly Audit Log ({weeklyReviews.length})
        </button>
      </div>

      {/* TAB 1: DAILY ACTION PLAN (Clean & Streamlined) */}
      {activeTab === "daily" && (
        <div className="grid gap-6 lg:grid-cols-3 animate-fade-in">
          <div className="lg:col-span-2 space-y-6">

            {/* Morning Check-In — Duolingo-style, only if not done today */}
            {!checkInDone && (
              <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 space-y-4 shadow-md">
                <div className="flex items-center gap-2">
                  <Sun size={18} className="text-primary" />
                  <span className="text-sm font-black text-foreground">Morning Check-In</span>
                  <span className="text-xs text-muted-foreground font-medium ml-auto">≈15 sec</span>
                </div>
                {/* Pain */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-muted-foreground w-20 shrink-0">Pain Today</span>
                  <div className="flex gap-1.5">
                    {(["😀","🙂","😐","☹️","😣"] as const).map((emoji, i) => (
                      <button key={i} onClick={() => handleCheckInTap("pain", i)}
                        className={`text-xl p-1 rounded-lg transition-all ${
                          checkInPain === i ? "scale-125 ring-2 ring-primary" : "opacity-60 hover:opacity-100 hover:scale-110"
                        }`}>{emoji}</button>
                    ))}
                  </div>
                </div>
                {/* Sleep */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-muted-foreground w-20 shrink-0">Sleep</span>
                  <div className="flex gap-1.5">
                    {[1,2,3,4,5].map((n) => (
                      <button key={n} onClick={() => handleCheckInTap("sleep", n)}
                        className={`text-lg transition-all ${
                          (checkInSleep ?? 0) >= n ? "text-amber-400 scale-110" : "text-muted-foreground/40 hover:text-amber-300"
                        }`}>⭐</button>
                    ))}
                  </div>
                </div>
                {/* Energy */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-muted-foreground w-20 shrink-0">Energy</span>
                  <div className="flex gap-1.5">
                    {[1,2,3,4,5].map((n) => (
                      <button key={n} onClick={() => handleCheckInTap("energy", n)}
                        className={`text-lg transition-all ${
                          (checkInEnergy ?? 0) >= n ? "text-primary scale-110" : "text-muted-foreground/40 hover:text-primary/50"
                        }`}>⚡</button>
                    ))}
                  </div>
                </div>
                {checkInPain !== null && checkInSleep !== null && checkInEnergy !== null && (
                  <div className="flex items-center gap-2 text-green-500 font-black text-sm animate-fade-in">
                    <CheckCircle2 size={16} /> Check-in saved!
                  </div>
                )}
              </div>
            )}

            {/* Today's Workout Card */}
            <Card className="border-2 border-primary/20 shadow-lg overflow-hidden bg-card">
              <CardHeader className="bg-secondary/40 border-b border-border pb-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-primary block mb-1">
                      Current Protocol
                    </span>
                    <CardTitle className="text-xl">
                      {activeProgram ? activeProgram.name : "Phase 1: Rotator Cuff Stabilization"}
                    </CardTitle>
                  </div>
                  <Badge variant="safe">Week 1 of 6</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-5 space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-muted-foreground">Protocol Completion</span>
                    <span className="text-foreground font-black">16%</span>
                  </div>
                  <Progress value={16} className="h-2" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase text-muted-foreground">Up Next Today</span>
                      <p className="font-bold text-base text-foreground mt-0.5">Day A: Rotator Cuff Focus</p>
                      <p className="text-xs text-muted-foreground">{todayExercises.length || 5} exercises · 18 mins · Band & Bodyweight</p>

                      {/* Visual Previews Row */}
                      {todayExercises.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-1.5">
                          {todayExercises.slice(0, 3).map((ex) => {
                            const imgPath = ex?.content.formGuideImage
                              ? `${import.meta.env.BASE_URL || "/"}${ex.content.formGuideImage}`
                              : null;
                            return (
                              <div key={ex?.id} className="h-14 rounded-lg bg-secondary overflow-hidden relative border border-border/60 group">
                                {imgPath ? (
                                  <img src={imgPath} alt={ex?.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-muted-foreground p-1 text-center">
                                    {ex?.name.slice(0, 12)}
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1">
                                  <span className="text-[9px] font-extrabold text-white leading-tight truncate">{ex?.name}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => navigate("/workout")}
                      className="w-full mt-2 font-bold shadow-sm"
                    >
                      Launch Visual Workout <ArrowRight size={14} className="ml-1.5" />
                    </Button>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/30 border border-border flex flex-col justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase text-muted-foreground">Clinical Directive</span>
                      <p className="font-bold text-xs text-foreground mt-1 leading-snug">
                        {evaluation.primaryRecommendation.actionDirective}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate("/programs")}
                      className="w-full font-bold text-xs"
                    >
                      Customize Schedule & Blocks
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Concise CDSS Directive Summary Banner */}
            <div className="p-4 rounded-2xl border-2 bg-primary/5 border-primary/25 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-black text-xs uppercase tracking-wider flex items-center gap-1.5 text-primary">
                  <Cpu size={15} /> Active Clinical Directive: {evaluation.primaryRecommendation.title}
                </span>
                <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[11px]">
                  Confidence: {evaluation.primaryRecommendation.confidencePct}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                <HelpCircle size={14} className="shrink-0 mt-0.5 text-primary" />
                <span><strong className="text-foreground">Physiological Basis:</strong> {evaluation.primaryRecommendation.trace.whyExplanation}</span>
              </p>
            </div>

            {/* Goals Tracker */}
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Clinical Milestones</span>
                  <Badge variant="outline">{goals.length} Active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {goals.map((g) => (
                  <div key={g.id} className="p-3 rounded-xl border border-border bg-secondary/20 space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-xs text-foreground">{g.title}</span>
                      <Badge className="text-[9px] uppercase font-bold">{g.type}</Badge>
                    </div>
                    <div className="flex items-center gap-3 pt-0.5">
                      <Progress value={g.progressPct} className="h-1.5 flex-1" />
                      <span className="text-[11px] font-extrabold text-foreground">{g.progressPct}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Col: Today's Checklist */}
          <div className="space-y-6">
            <Card className="shadow-md border-border">
              <CardHeader className="bg-secondary/20 pb-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Daily Rehab Checklist</CardTitle>
                  <Badge className="font-mono text-xs">{completedCount}/{checklist.length}</Badge>
                </div>
                <Progress value={checklistPct} className="h-1.5 mt-2" />
              </CardHeader>
              <CardContent className="pt-3 space-y-2.5">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      item.done
                        ? "bg-secondary/20 border-border text-muted-foreground"
                        : "bg-card border-border text-foreground hover:border-primary/50 shadow-sm"
                    }`}
                  >
                    {item.done ? (
                      <CheckCircle2 size={16} className="text-rehab-green shrink-0 mt-0.5" />
                    ) : (
                      <Circle size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <span className={`text-xs font-bold leading-snug ${item.done ? "line-through" : ""}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-md border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" /> Recommended Routine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div
                  onClick={() => navigate("/posture")}
                  className="p-3.5 rounded-xl border border-border bg-card hover:border-primary/40 cursor-pointer transition-all shadow-sm group"
                >
                  <h4 className="font-extrabold text-xs text-foreground group-hover:text-primary transition-colors">
                    10-Min Scapular Armor Circuit
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    Daily posture routine designed to open subacromial clearance by up to 18mm.
                  </p>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-primary mt-2">
                    <span>Launch Posture Session</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rehab Personal Records */}
            <Card className="shadow-md border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Trophy size={16} className="text-amber-500" /> Rehab Records
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Pain-Free Streak", value: "14 Days", icon: "🔥", color: "text-orange-500" },
                  { label: "Best Compliance",   value: "100%",    icon: "🎯", color: "text-green-500" },
                  { label: "Ext. Rotation ROM", value: "82°",     icon: "📐", color: "text-primary"   },
                ].map((pr) => (
                  <div key={pr.label} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 border border-border">
                    <span className="text-xl">{pr.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">{pr.label}</p>
                      <p className={`text-sm font-black ${pr.color}`}>{pr.value}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: CDSS CLINICAL SIMULATOR TAB */}
      {activeTab === "simulator" && (
        <Card className="border-border shadow-md bg-gradient-to-br from-card via-card to-secondary/10 animate-fade-in">
          <CardHeader className="bg-secondary/30 pb-4 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <Sliders size={20} className="text-primary" /> Multi-Variable CDSS Simulation Sandbox
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Test biological variables (*pain flare-ups, sleep deficits, ROM gains*) to preview clinical recommendation rules.
              </p>
            </div>
            <Badge variant={evaluation.primaryRecommendation.priority === "safety-override" ? "destructive" : "safe"}>
              Priority: {evaluation.primaryRecommendation.priority.toUpperCase()}
            </Badge>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Directive Banner */}
            <div className={`p-5 rounded-2xl border-2 space-y-3 ${
              evaluation.primaryRecommendation.priority === "safety-override"
                ? "bg-destructive/10 border-destructive/40 text-destructive"
                : "bg-primary/10 border-primary/30 text-foreground"
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={16} className="text-primary shrink-0" /> Simulated Directive: {evaluation.primaryRecommendation.title}
                </span>
                <Badge className="font-mono bg-primary text-primary-foreground font-black text-xs">
                  Confidence: {evaluation.primaryRecommendation.confidencePct}%
                </Badge>
              </div>
              <p className="font-extrabold text-sm sm:text-base leading-snug">
                {evaluation.primaryRecommendation.actionDirective}
              </p>
              <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground flex items-start gap-1.5">
                <HelpCircle size={14} className="shrink-0 mt-0.5 text-primary" />
                <span><strong className="text-foreground">Why?</strong> {evaluation.primaryRecommendation.trace.whyExplanation}</span>
              </div>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-foreground">Adjust Biological Simulation Parameters</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTrace(!showTrace)}
                  className="h-7 text-xs font-bold text-primary"
                >
                  {showTrace ? "Hide Rule Trace" : "Inspect Rule Execution Trace"}
                </Button>
              </div>

              {/* Preset Selector */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-bold text-muted-foreground self-center mr-1">Load Scenario:</span>
                {simulationPresets.map((preset) => (
                  <Button
                    key={preset.id}
                    size="sm"
                    variant="outline"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-xs h-7 font-bold bg-background hover:bg-primary/10"
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>

              {/* Variable Sliders Grid */}
              <div className="grid gap-5 sm:grid-cols-2 p-5 rounded-2xl border bg-secondary/15">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Simulated Pain Level:</span>
                    <span className="font-mono text-primary">{simContext.painLevel}/10</span>
                  </div>
                  <Slider
                    value={[simContext.painLevel]}
                    onValueChange={(val) => setSimContext({ ...simContext, painLevel: val[0] })}
                    max={10}
                    step={1}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Sleep Duration:</span>
                    <span className="font-mono text-primary">{simContext.sleepHours} Hours</span>
                  </div>
                  <Slider
                    value={[simContext.sleepHours]}
                    onValueChange={(val) => setSimContext({ ...simContext, sleepHours: val[0] })}
                    max={10}
                    step={0.5}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Workout Compliance:</span>
                    <span className="font-mono text-primary">{simContext.compliancePct}%</span>
                  </div>
                  <Slider
                    value={[simContext.compliancePct]}
                    onValueChange={(val) => setSimContext({ ...simContext, compliancePct: val[0] })}
                    max={100}
                    step={5}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>External Rotation ROM:</span>
                    <span className="font-mono text-primary">{simContext.externalRotationDeg}°</span>
                  </div>
                  <Slider
                    value={[simContext.externalRotationDeg || 70]}
                    onValueChange={(val) => setSimContext({ ...simContext, externalRotationDeg: val[0] })}
                    max={90}
                    step={1}
                  />
                </div>
              </div>

              {/* Debug Rule Trace Box */}
              {showTrace && (
                <div className="p-4 rounded-2xl bg-black/80 text-rehab-green font-mono text-[11px] space-y-1.5 overflow-x-auto shadow-inner border border-border">
                  <div className="text-white font-bold border-b border-white/20 pb-1 mb-2">
                    CDSS Rule Execution Trace (Total Rules Evaluated: {evaluation.allTriggered.length})
                  </div>
                  {evaluation.ruleTraceLog.map((logItem, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {logItem}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: WEEKLY AUDIT LOG TAB */}
      {activeTab === "weekly" && currentReview && (
        <Card className="shadow-md border-2 border-primary/25 bg-gradient-to-br from-card via-card to-primary/5 animate-fade-in">
          <CardHeader className="bg-secondary/30 pb-4 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <Calendar size={20} className="text-primary" /> Longitudinal Weekly Clinical Reviews
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Deterministic audit generated every Sunday summarizing compliance, ROM, and pain trends.
              </p>
            </div>
            {weeklyReviews.length > 1 && (
              <div className="flex items-center gap-1.5 bg-background px-2.5 py-1.5 rounded-xl border">
                <History size={14} className="text-muted-foreground" />
                <select
                  value={selectedReviewIdx}
                  onChange={(e) => {
                    setSelectedReviewIdx(Number(e.target.value));
                    setShowAskAIWhy(false);
                  }}
                  className="text-xs font-bold bg-transparent text-foreground focus:outline-none cursor-pointer"
                >
                  {weeklyReviews.map((rev, idx) => (
                    <option key={rev.id} value={idx}>
                      Week {rev.weekNumber} ({rev.dateStr})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            {/* KPIs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-secondary/25 border text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Workouts</span>
                <p className="font-mono font-black text-sm text-foreground">
                  {currentReview.workoutsCompleted}/{currentReview.targetWorkouts} Done
                </p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/25 border text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Resting Pain</span>
                <p className="font-mono font-black text-sm text-rehab-green">
                  {currentReview.avgPainLevel}/10 ({currentReview.painDeltaPct}%)
                </p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/25 border text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Abduction ROM</span>
                <p className="font-mono font-black text-sm text-foreground">
                  {currentReview.romAbductionDeg}° / 180°
                </p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/25 border text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Readiness</span>
                <p className="font-mono font-black text-sm text-primary">
                  {currentReview.recoveryScore}%
                </p>
              </div>
            </div>

            {/* Directive & Ask AI Why */}
            <div className="p-5 rounded-2xl bg-card border shadow-sm space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Sparkles size={14} /> Week {currentReview.weekNumber} Clinical Recommendation
                </span>
                <Button
                  size="sm"
                  variant={showAskAIWhy ? "default" : "outline"}
                  onClick={() => setShowAskAIWhy(!showAskAIWhy)}
                  className="h-8 text-xs font-extrabold gap-1.5"
                >
                  <MessageSquareQuote size={14} /> {showAskAIWhy ? "Hide Rationale" : "Inspect Physiological Rationale"}
                </Button>
              </div>
              <p className="font-black text-base text-foreground leading-snug">
                "{currentReview.directiveText}"
              </p>

              {showAskAIWhy && (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-xs text-foreground font-medium animate-fade-in space-y-1.5">
                  <div className="font-extrabold text-primary flex items-center gap-1">
                    <Cpu size={14} /> Physiological & Biomechanical Explanation:
                  </div>
                  <p className="leading-relaxed">
                    {currentReview.directiveReason}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
