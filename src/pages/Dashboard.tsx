import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, BookOpen, UserCheck, Activity, CheckCircle2, Circle, Flame, ShieldCheck, ArrowRight, Sparkles, Sliders, HelpCircle, AlertTriangle, Cpu, Calendar, History, MessageSquareQuote } from "lucide-react";
import { useProfile, useActiveProgram, useGoals, useWeeklyReviews } from "@/hooks/useData";

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
  const userName = profile?.name || "Abdulkareem";

  const [selectedReviewIdx, setSelectedReviewIdx] = useState(0);
  const currentReview = weeklyReviews[selectedReviewIdx] || weeklyReviews[0];
  const [showAskAIWhy, setShowAskAIWhy] = useState(false);

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
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-rehab-blue p-6 sm:p-8 md:p-10 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 grid gap-6 md:grid-cols-3 items-center">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <Badge className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border-0">
                <ShieldCheck size={14} className="mr-1.5" /> Phase 1 Rehab Active
              </Badge>
              <Badge className="bg-rehab-green text-white border-0 font-mono text-xs font-black">
                Recovery Score: 88%
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-none">
              {greeting(userName)}.
            </h1>

            <p className="text-white/85 text-sm sm:text-base max-w-xl font-medium leading-relaxed">
              Your recovery engine reports stable tissue adaptation. Today's session targets rotator cuff endurance and scapulohumeral coordination.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col justify-between gap-4 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold text-white/75 tracking-wider">Today's Streak</span>
              <Flame size={20} className="text-rehab-amber fill-rehab-amber" />
            </div>
            <div>
              <span className="text-3xl font-black text-white font-mono">14 Days</span>
              <p className="text-xs text-white/80 mt-0.5">Consistent daily compliance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 60/40 Asymmetric Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Col: Today's Workout + CDSS Recovery Engine */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Workout Card */}
          <Card className="border-2 border-primary/20 shadow-lg overflow-hidden bg-card">
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

          {/* CDSS Intelligent Recovery Engine Card */}
          <Card className="border-border shadow-md bg-gradient-to-br from-card via-card to-secondary/10">
            <CardHeader className="bg-secondary/30 pb-4 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                  <Cpu size={20} className="text-primary" /> Intelligent CDSS Recovery Engine
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-time multi-variable clinical decision support system with explainable confidence scoring.
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
                    <Sparkles size={16} className="text-primary shrink-0" /> CDSS Directive: {evaluation.primaryRecommendation.title}
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

              {/* Interactive Multi-Variable Simulation Sandbox */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                    <Sliders size={16} className="text-primary" /> Interactive Clinical Simulation Sandbox
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTrace(!showTrace)}
                    className="h-7 text-xs font-bold text-primary"
                  >
                    {showTrace ? "Hide Debug Rule Trace" : "Inspect Debug Trace"}
                  </Button>
                </div>

                {/* Preset Selector */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-bold text-muted-foreground self-center mr-1">Simulate Scenario:</span>
                  {simulationPresets.map((preset) => (
                    <Button
                      key={preset.id}
                      size="sm"
                      variant="outline"
                      onClick={() => handleApplyPreset(preset)}
                      className="text-xs h-7 font-bold bg-background hover:bg-primary/10 hover:border-primary/50"
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>

                {/* Variable Sliders Grid */}
                <div className="grid gap-5 sm:grid-cols-2 p-4 rounded-2xl border bg-secondary/15">
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

          {/* Automated Weekly Clinical Review Card */}
          {currentReview && (
            <Card className="shadow-md border-2 border-primary/25 bg-gradient-to-br from-card via-card to-primary/5">
              <CardHeader className="bg-secondary/30 pb-4 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                    <Calendar size={20} className="text-primary" /> Longitudinal Weekly Clinical Review
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Deterministic audit generated every Sunday summarizing compliance, ROM, and pain trends.
                  </p>
                </div>
                {weeklyReviews.length > 1 && (
                  <div className="flex items-center gap-1.5 bg-background px-2.5 py-1 rounded-xl border">
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
                <div className="p-4 rounded-2xl bg-card border shadow-sm space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Sparkles size={14} /> Week {currentReview.weekNumber} Recommendation
                    </span>
                    <Button
                      size="sm"
                      variant={showAskAIWhy ? "default" : "outline"}
                      onClick={() => setShowAskAIWhy(!showAskAIWhy)}
                      className="h-7 text-xs font-extrabold gap-1.5"
                    >
                      <MessageSquareQuote size={14} /> {showAskAIWhy ? "Hide Rationale" : "Ask AI Why?"}
                    </Button>
                  </div>
                  <p className="font-black text-base text-foreground leading-snug">
                    "{currentReview.directiveText}"
                  </p>

                  {showAskAIWhy && (
                    <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/30 text-xs text-foreground font-medium animate-fade-in space-y-1">
                      <div className="font-extrabold text-primary flex items-center gap-1">
                        <Cpu size={14} /> CDSS Physiological Rationale:
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
        <div className="space-y-8">
          <Card className="shadow-md border-border">
            <CardHeader className="bg-secondary/20 pb-4 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Daily Rehab Tasks</CardTitle>
                <Badge className="font-mono">{completedCount}/{checklist.length}</Badge>
              </div>
              <Progress value={checklistPct} className="h-1.5 mt-2" />
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    item.done
                      ? "bg-secondary/20 border-border text-muted-foreground"
                      : "bg-card border-border text-foreground hover:border-primary/50 shadow-sm"
                  }`}
                >
                  {item.done ? (
                    <CheckCircle2 size={18} className="text-rehab-green shrink-0 mt-0.5" />
                  ) : (
                    <Circle size={18} className="text-muted-foreground shrink-0 mt-0.5" />
                  )}
                  <span className={`text-xs font-bold leading-snug ${item.done ? "line-through" : ""}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-md border-border bg-gradient-to-br from-card to-secondary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen size={18} className="text-primary" /> Educational Deep Dive
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onClick={() => navigate("/knowledge")}
                className="p-4 rounded-2xl border border-border bg-card hover:border-primary/40 cursor-pointer transition-all shadow-sm group"
              >
                <h4 className="font-extrabold text-sm text-foreground group-hover:text-primary transition-colors">
                  Why 2:1 Scapular Rhythm Matters
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Learn how upward rotation prevents subacromial impingement during overhead lifting.
                </p>
                <div className="flex items-center gap-1 text-xs font-bold text-primary mt-3">
                  <span>Inspect Biomechanics</span>
                  <ArrowRight size={14} />
                </div>
              </div>

              <div
                onClick={() => navigate("/posture")}
                className="p-4 rounded-2xl border border-border bg-card hover:border-primary/40 cursor-pointer transition-all shadow-sm group"
              >
                <h4 className="font-extrabold text-sm text-foreground group-hover:text-primary transition-colors">
                  10-Min Scapular Armor Circuit
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Daily posture routine designed to open subacromial clearance by up to 18mm.
                </p>
                <div className="flex items-center gap-1 text-xs font-bold text-primary mt-3">
                  <span>Open Routine</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
