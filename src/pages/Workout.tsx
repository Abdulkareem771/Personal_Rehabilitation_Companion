import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2, ChevronRight, ChevronLeft, Play, Pause, RotateCcw,
  AlertCircle, HelpCircle, Dumbbell, Sparkles
} from "lucide-react";
import { useActiveProgram, useExercises } from "@/hooks/useData";
import { useWorkoutStore } from "@/store/workoutStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatTimer } from "@/utils/formatters";

export function Workout() {
  const navigate = useNavigate();
  const activeProg = useActiveProgram();
  const allExercises = useExercises();
  const store = useWorkoutStore();

  const [whyOpen, setWhyOpen] = useState(false);
  const [painLevel, setPainLevel] = useState<number>(0);
  const [repsInput, setRepsInput] = useState<number>(15);
  const [weightInput, setWeightInput] = useState<number>(0);

  // Auto-tick rest timer every second when active
  useEffect(() => {
    let interval: any;
    if (store.mode?.restTimerActive) {
      interval = setInterval(() => store.tickRest(), 1000);
    }
    return () => clearInterval(interval);
  }, [store.mode?.restTimerActive]);

  // If no session started, show clinical launcher
  if (!store.isInWorkoutMode || !store.mode) {
    const firstDay = activeProg?.weeks[0]?.days[0];
    const flatExercises = firstDay?.blocks.flatMap((b) => b.exercises) || [];

    const handleLaunch = () => {
      store.startSession(`session-${Date.now()}`, flatExercises);
      store.enterWorkoutMode();
    };

    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6 animate-fade-in">
        <Card className="border-border shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-rehab-blue p-8 text-white">
            <Badge className="bg-white/20 text-white border-0 mb-3">ReForge Clinical Mode</Badge>
            <h2 className="text-3xl font-black">Today's Prescribed Session</h2>
            <p className="text-white/80 text-sm mt-1">
              {activeProg?.name || "Phase 1 Stabilization"} · {firstDay?.name || "Day A Rotator Cuff Focus"}
            </p>
          </div>
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                Prescribed Exercises ({flatExercises.length})
              </span>
              <div className="space-y-2.5">
                {flatExercises.map((pe, idx) => {
                  const ex = allExercises.find((e) => e.id === pe.exerciseId);
                  return (
                    <div key={pe.id} className="p-3.5 rounded-xl border border-border bg-secondary/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="h-7 w-7 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-sm text-foreground">{ex?.name || pe.exerciseId}</p>
                          <span className="text-xs text-muted-foreground capitalize">{ex?.category} · {pe.sets} sets × {pe.reps}</span>
                        </div>
                      </div>
                      <Badge variant="outline">{ex?.safety}</Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rehab-teal/10 border border-rehab-teal/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-foreground block">Safety Reminder</span>
                <span className="text-xs text-muted-foreground">Stop immediately if pain exceeds 3/10 or clicking occurs.</span>
              </div>
            </div>

            <Button onClick={handleLaunch} size="lg" className="w-full py-6 text-lg font-black shadow-lg gap-2">
              <Play size={22} fill="currentColor" /> Launch Clinical Workout Mode
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active Workout Mode execution
  const currentPE = store.mode.programExercises[store.mode.currentIndex];
  const currentEx = allExercises.find((e) => e.id === currentPE?.exerciseId);
  const totalEx = store.mode.programExercises.length;
  const currIdx = store.mode.currentIndex + 1;
  const progressPct = Math.round((currIdx / totalEx) * 100);

  const handleLogSet = () => {
    store.addSet({
      setNumber: store.mode!.currentSets.length + 1,
      weight: weightInput,
      reps: repsInput,
      rpe: 6,
      pain: painLevel,
      completed: true,
    });
    // Start rest timer
    const restSecs = currentPE.restSecondsOverride || currentEx?.content?.restSeconds || 60;
    store.startRestTimer(restSecs);
  };


  const handleFinishExercise = () => {
    if (currentEx) store.markExerciseDone(currentEx.id);
    if (store.mode?.currentIndex === totalEx - 1) {
      // Session finished
      store.endSession();
      navigate("/");
    } else {
      store.nextExercise();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Bar: Progress & Exit */}
      <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => store.endSession()} className="font-bold text-muted-foreground">
            Exit
          </Button>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm font-extrabold text-foreground">
            Exercise {currIdx} of {totalEx}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-1 max-w-xs">
          <Progress value={progressPct} className="h-2 flex-1" />
          <span className="text-xs font-black text-primary shrink-0">{progressPct}%</span>
        </div>
      </div>

      {/* Main Exercise View */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left 2 Cols: Exercise Instructions & Logging */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border shadow-md">
            <CardHeader className="bg-secondary/20 pb-4 border-b border-border flex flex-row items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="capitalize">{currentEx?.category || "Rehab"}</Badge>
                  <Badge variant="safe">Prescribed: {currentPE.sets} × {currentPE.reps}</Badge>
                </div>
                <CardTitle className="text-2xl">{currentEx?.name || currentPE.exerciseId}</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWhyOpen(true)}
                className="shrink-0 font-bold border-primary text-primary hover:bg-primary/10 gap-1.5"
              >
                <HelpCircle size={16} /> Why This Exercise?
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Instructions */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Execution Checklist
                </span>
                <ol className="space-y-2 list-decimal list-inside text-sm text-foreground font-medium">
                  {(currentEx?.content?.instructions || ["Follow clinician cues."]).map((inst, idx) => (
                    <li key={idx} className="leading-relaxed pl-1">{inst}</li>
                  ))}
                </ol>
              </div>

              {/* Tempo & Breathing Box */}
              <div className="grid sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-secondary/30 border border-border">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-muted-foreground">Tempo Cue</span>
                  <p className="font-extrabold text-sm text-primary">
                    {currentPE.tempoOverride || currentEx?.content?.tempoCue || "Controlled 2-1-2"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-muted-foreground">Breathing</span>
                  <p className="font-bold text-xs text-foreground">
                    {currentEx?.content?.breathingCues || "Exhale on effort"}
                  </p>
                </div>
              </div>

              {/* Set Logging Form */}
              <div className="p-5 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-base text-foreground">
                    Log Set #{store.mode.currentSets.length + 1}
                  </span>
                  <Badge variant="outline">Target: {currentPE.reps} reps</Badge>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground block mb-1">Reps Done</label>
                    <input
                      type="number"
                      value={repsInput}
                      onChange={(e) => setRepsInput(Number(e.target.value))}
                      className="w-full h-11 px-3 rounded-xl border border-border bg-background text-foreground font-black text-center text-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground block mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={weightInput}
                      onChange={(e) => setWeightInput(Number(e.target.value))}
                      className="w-full h-11 px-3 rounded-xl border border-border bg-background text-foreground font-black text-center text-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground block mb-1">Pain (0-10)</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={painLevel}
                      onChange={(e) => setPainLevel(Number(e.target.value))}
                      className={`w-full h-11 px-3 rounded-xl border font-black text-center text-lg focus:ring-2 ${
                        painLevel > 3 ? "border-rehab-red bg-rehab-red/10 text-rehab-red" : "border-border bg-background text-foreground"
                      }`}
                    />
                  </div>
                </div>

                {painLevel > 3 && (
                  <div className="p-3 rounded-xl bg-rehab-red/10 border border-rehab-red/30 flex items-center gap-2 text-rehab-red text-xs font-bold">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>Warning: Pain exceeds safety threshold (3/10). Consider stopping this exercise.</span>
                  </div>
                )}

                <Button onClick={handleLogSet} className="w-full py-6 font-black text-base shadow-md gap-2">
                  <CheckCircle2 size={18} /> Record Set & Start Rest Timer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Rest Timer & Completed Sets */}
        <div className="space-y-6">
          {/* Rest Timer Card */}
          <Card className={`border-2 transition-all ${
            store.mode.restTimerActive ? "border-primary bg-primary/5 shadow-lg" : "border-border bg-card"
          }`}>
            <CardHeader className="pb-2 text-center">
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                Recovery Timer
              </span>
            </CardHeader>
            <CardContent className="text-center space-y-4 pb-6">
              <div className="text-4xl font-black font-mono tracking-tighter text-foreground">
                {formatTimer(store.mode.restSecondsRemaining)}
              </div>
              <div className="flex justify-center gap-2">
                {store.mode.restTimerActive ? (
                  <Button variant="outline" size="sm" onClick={() => store.cancelRest()} className="font-bold gap-1">
                    <Pause size={14} /> Skip Rest
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => store.startRestTimer(60)} className="font-bold gap-1">
                    <RotateCcw size={14} /> Start 60s
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Logged Sets History for Current Exercise */}
          <Card className="shadow-md">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-extrabold">Logged Sets Today</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              {store.mode.currentSets.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4 font-medium">No sets logged yet.</p>
              ) : (
                store.mode.currentSets.map((set, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border text-xs font-bold">
                    <span className="text-primary font-black">Set #{set.setNumber}</span>
                    <span>{set.reps} reps @ {set.weight} kg</span>
                    <Badge variant={(set.pain || 0) > 2 ? "danger" : "safe"} className="text-[10px]">
                      Pain: {set.pain || 0}/10
                    </Badge>
                  </div>

                ))
              )}
            </CardContent>
          </Card>

          {/* Next Exercise Navigation */}
          <div className="space-y-2">
            <Button
              onClick={handleFinishExercise}
              size="lg"
              className="w-full py-6 font-black text-base shadow-lg bg-rehab-teal text-white hover:bg-rehab-teal/90 gap-2"
            >
              {currIdx === totalEx ? "Complete Clinical Session 🎉" : "Next Exercise"}
              <ChevronRight size={18} />
            </Button>
            {currIdx > 1 && (
              <Button
                variant="ghost"
                onClick={() => store.prevExercise()}
                className="w-full font-bold text-xs text-muted-foreground"
              >
                <ChevronLeft size={14} className="mr-1" /> Back to Previous
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Personalized WHY Modal */}
      <Dialog open={whyOpen} onOpenChange={setWhyOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider mb-1">
              <Sparkles size={16} /> Personalized Medical Rationale
            </div>
            <DialogTitle className="text-2xl">{currentEx?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2">
              <span className="text-xs font-extrabold uppercase text-foreground">Clinical Purpose</span>
              <p className="text-sm text-foreground font-medium leading-relaxed">
                {currentEx?.content?.purpose || "Restores shoulder stability."}
              </p>
            </div>
            {currentEx?.content?.personalizedWhy && (
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 space-y-2">
                <span className="text-xs font-extrabold uppercase text-primary">Why You Need This (Bankart Lesion)</span>
                <p className="text-sm text-foreground font-semibold leading-relaxed">
                  {currentEx.content.personalizedWhy}
                </p>
              </div>
            )}
            {currentEx?.content?.engineeringExplanation && (
              <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-2">
                <span className="text-xs font-extrabold uppercase text-muted-foreground">Engineering Analogy</span>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">
                  "{currentEx.content.engineeringExplanation}"
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
