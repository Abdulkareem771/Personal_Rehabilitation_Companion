import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2, ChevronRight, ChevronLeft, Play, Pause,
  HelpCircle, ShieldCheck, AlertTriangle, X,
  ExternalLink, List, Zap, Trophy, ChevronDown
} from "lucide-react";
import { useActiveProgram, useExercises } from "@/hooks/useData";
import { useWorkoutStore } from "@/store/workoutStore";
import { useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatTimer } from "@/utils/formatters";
import type { Exercise, ProgramExercise, Equipment } from "@/types";

const JOURNAL_PROMPTS = [
  "What felt better today than last week?",
  "Did anything make your shoulder feel unstable?",
  "Which exercise felt easiest today?",
  "Did you feel any compensation patterns?",
  "What are you most proud of from today's session?",
];

const EQUIPMENT_OPTIONS: { key: Equipment; label: string; emoji: string }[] = [
  { key: "bodyweight", label: "Bodyweight",      emoji: "🧍" },
  { key: "band",       label: "Resistance Band", emoji: "🟡" },
  { key: "dumbbell",   label: "Dumbbell",        emoji: "🏋️" },
  { key: "kettlebell", label: "Kettlebell",      emoji: "🔔" },
  { key: "cable",      label: "Cable / Pulley",  emoji: "🪝" },
  { key: "machine",    label: "Machine",         emoji: "🖥️" },
  { key: "barbell",    label: "Barbell",         emoji: "🏗️" },
  { key: "other",      label: "Other",           emoji: "⚙️" },
];

const RESUME_KEY = "reforge-session-resume";

function haptic(pattern: number | number[]) {
  try { navigator.vibrate?.(pattern); } catch {}
}

function playBeep(frequency: number, duration: number, vol = 0.4) {
  try {
    const ctx  = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

function ExerciseMedia({ ex, className }: { ex?: Exercise; className?: string }) {
  const base   = import.meta.env.BASE_URL || "/";
  const loop   = ex?.content?.media?.loop;
  const poster = ex?.content?.media?.poster || ex?.content?.formGuideImage;
  const posterUrl = poster ? `${base}${poster}`.replace(/\/+/g, "/") : undefined;

  if (loop?.webm || loop?.mp4) {
    return (
      <video autoPlay loop muted playsInline poster={posterUrl}
        className={className ?? "w-full h-full object-cover"}>
        {loop.webm && <source src={`${base}${loop.webm}`.replace(/\/+/g, "/")} type="video/webm" />}
        {loop.mp4  && <source src={`${base}${loop.mp4}`.replace(/\/+/g, "/")}  type="video/mp4"  />}
      </video>
    );
  }
  if (posterUrl) {
    return <img src={posterUrl} alt={ex?.name} className={className ?? "w-full h-full object-cover"} />;
  }
  return (
    <div className={`${className ?? "w-full h-full"} bg-gradient-to-br from-primary/20 via-secondary to-background flex items-center justify-center`}>
      <span className="text-4xl">🏋️</span>
    </div>
  );
}

function FinishScreen({ onDone }: { onDone: () => void }) {
  const [journalText, setJournalText] = useState("");
  const [saved, setSaved] = useState(false);
  const prompt = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];

  useEffect(() => { haptic([100, 50, 100, 50, 300]); }, []);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="space-y-6 max-w-md w-full">
        <div className="text-4xl animate-bounce">⭐⭐⭐⭐⭐</div>
        <h1 className="text-3xl font-black text-foreground">Great Session!</h1>
        <div className="grid grid-cols-3 gap-3">
          {([
            { label: "Recovery",   value: "88%",  color: "text-green-500" },
            { label: "Pain",       value: "1/10", color: "text-primary"   },
            { label: "Compliance", value: "100%", color: "text-blue-500"  },
          ] as const).map((s) => (
            <div key={s.label} className="bg-secondary/40 rounded-2xl p-4 border border-border">
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] font-extrabold uppercase text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 text-orange-500 font-black text-sm">
          <Trophy size={18} /> 14-Day Pain-Free Streak
        </div>
        {!saved ? (
          <div className="space-y-3 text-left bg-secondary/20 rounded-2xl p-5 border border-border">
            <p className="text-xs font-black uppercase tracking-wider text-primary">Reflective Note</p>
            <p className="text-sm font-bold text-foreground italic">&ldquo;{prompt}&rdquo;</p>
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Optional — tap to type, or skip..."
              rows={3}
              className="w-full bg-background border border-border rounded-xl p-3 text-sm font-medium text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 font-bold" onClick={onDone}>Skip</Button>
              <Button className="flex-1 font-bold" onClick={() => setSaved(true)}>Save Note</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-green-500 font-black text-lg animate-fade-in">
            <CheckCircle2 size={22} /> Saved!
          </div>
        )}
      </div>
    </div>
  );
}

function NeedHelpSheet({ ex, restRem, onClose }: { ex?: Exercise; restRem: number; onClose: () => void }) {
  const tutorial = ex?.content?.media?.tutorials?.[0];
  const isResting = restRem > 0;

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end bg-black/50" onClick={onClose}>
      {/* Floating rest timer — always visible above the sheet */}
      {isResting && (
        <div className="absolute top-4 right-4 z-50 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-black shadow-lg tabular-nums pointer-events-none">
          ⏱ {formatTimer(restRem)}
        </div>
      )}
      <div
        className="bg-card border-t border-border rounded-t-3xl p-6 space-y-5 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-border mx-auto" />
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">Need Help?</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>
        {ex?.content?.commonMistakes?.[0] && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">Most Common Mistake</p>
              <p className="text-sm font-bold mt-0.5">{ex.content.commonMistakes[0]}</p>
            </div>
          </div>
        )}
        {ex?.content?.instructions && (
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">Technique</p>
            <ol className="space-y-1.5 list-decimal list-inside text-sm font-medium">
              {ex.content.instructions.map((inst, i) => (
                <li key={i} className="leading-relaxed pl-1">{inst}</li>
              ))}
            </ol>
          </div>
        )}
        {ex?.content?.regression && (
          <div className="p-3.5 rounded-xl bg-secondary/40 border border-border">
            <p className="text-[10px] font-black uppercase text-muted-foreground">Too Hard? Try This Instead</p>
            <p className="text-sm font-bold mt-0.5">{ex.content.regression}</p>
          </div>
        )}
        {tutorial && (
          <button
            onClick={() => window.open(tutorial.url, "_blank")}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm transition-colors"
          >
            <Play size={16} fill="currentColor" /> Watch Coaching Video
            <ExternalLink size={14} className="opacity-70" />
          </button>
        )}
        {ex?.content?.personalizedWhy && (
          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-[10px] font-black uppercase text-primary">Why This Exercise</p>
            <p className="text-xs font-medium mt-1 leading-relaxed">{ex.content.personalizedWhy}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function QueueDrawer({ exercises, allExercises, currentIndex, onClose }: {
  exercises: ProgramExercise[];
  allExercises: Exercise[];
  currentIndex: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end bg-black/50" onClick={onClose}>
      <div
        className="bg-card border-t border-border rounded-t-3xl p-5 space-y-2 max-h-[60vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-border mx-auto mb-3" />
        <h2 className="text-base font-black mb-2">Up Next</h2>
        {exercises.map((pe, idx) => {
          const ex   = allExercises.find((e) => e.id === pe.exerciseId);
          const base = import.meta.env.BASE_URL || "/";
          const img  = ex?.content?.formGuideImage ? `${base}${ex.content.formGuideImage}`.replace(/\/+/g, "/") : null;
          const state = idx < currentIndex ? "done" : idx === currentIndex ? "now" : "upcoming";
          return (
            <div key={pe.id} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              state === "now"  ? "bg-primary/10 border border-primary/30" :
              state === "done" ? "opacity-40" : "bg-secondary/20"
            }`}>
              {img ? (
                <img src={img} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 text-xl">🏋️</div>
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-extrabold truncate ${state === "now" ? "text-primary" : ""}`}>
                  {ex?.name ?? pe.exerciseId}
                </p>
                <p className="text-[10px] text-muted-foreground font-medium">{pe.sets} sets · {pe.reps ?? "15"} reps</p>
              </div>
              {state === "done" && <CheckCircle2 size={16} className="text-green-500 shrink-0" />}
              {state === "now"  && <Badge className="text-[9px] font-black bg-primary text-primary-foreground shrink-0">NOW PLAYING</Badge>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EquipmentSelector({ selected, onChange }: { selected: Equipment[]; onChange: (eq: Equipment[]) => void }) {
  const toggle = (key: Equipment) =>
    onChange(selected.includes(key) ? selected.filter((e) => e !== key) : [...selected, key]);
  return (
    <div className="grid grid-cols-2 gap-2">
      {EQUIPMENT_OPTIONS.map(({ key, label, emoji }) => {
        const active = selected.includes(key);
        return (
          <button key={key} onClick={() => toggle(key)}
            className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-sm font-bold transition-all ${
              active
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-secondary/20 text-muted-foreground hover:border-primary/40"
            }`}>
            <span className="text-xl">{emoji}</span>
            <span>{label}</span>
            {active && <CheckCircle2 size={14} className="ml-auto text-primary" />}
          </button>
        );
      })}
    </div>
  );
}

function ConfidenceModal({ exName, onSelect }: {
  exName: string;
  onSelect: (confidence: number) => void;
}) {
  const options = [
    { emoji: "😀", label: "Easy",    val: 1, color: "border-green-500 bg-green-500/10" },
    { emoji: "🙂", label: "Good",    val: 2, color: "border-blue-500 bg-blue-500/10"   },
    { emoji: "😐", label: "Hard",    val: 3, color: "border-amber-500 bg-amber-500/10" },
    { emoji: "😣", label: "Painful", val: 4, color: "border-red-500 bg-red-500/10"     },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 animate-fade-in">
      <div className="bg-card border-t border-border rounded-t-3xl p-6 w-full max-w-lg space-y-4">
        <div className="w-10 h-1 rounded-full bg-border mx-auto" />
        <p className="text-xs font-black uppercase tracking-wider text-muted-foreground text-center">
          How did that feel?
        </p>
        <p className="text-base font-extrabold text-foreground text-center">{exName}</p>
        <div className="grid grid-cols-4 gap-2">
          {options.map((o) => (
            <button key={o.val} onClick={() => { haptic(40); onSelect(o.val); }}
              className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all hover:scale-105 ${o.color}`}>
              <span className="text-3xl">{o.emoji}</span>
              <span className="text-[10px] font-black">{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Workout() {
  const navigate     = useNavigate();
  const activeProg   = useActiveProgram();
  const allExercises = useExercises();
  const store        = useWorkoutStore();
  const { workoutPrefs, setWorkoutPrefs } = useAppStore();

  const [screen,    setScreen]    = useState<"equipment" | "preview" | "active" | "finished">(store.isInWorkoutMode ? "active" : "equipment");
  const [helpOpen,  setHelpOpen]  = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [paused,    setPaused]    = useState(false);
  const [completionBanner, setCompletionBanner] = useState<string | null>(null);
  const [showConfidence,   setShowConfidence]   = useState(false);
  const [painLevel,        setPainLevel]        = useState(0);
  const [repsInput,        setRepsInput]        = useState(15);
  const [dismissedReminders, setDismissedReminders] = useState<Record<string, boolean>>({});
  const [localEquipment,   setLocalEquipment]   = useState<Equipment[]>(workoutPrefs.availableEquipment);
  const [resumeData,       setResumeData]       = useState<null | { exerciseIndex: number; sessionId: string }>(null);

  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RESUME_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (Date.now() - data.timestamp < 86_400_000) {
          setResumeData(data);
        } else {
          localStorage.removeItem(RESUME_KEY);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (store.isInWorkoutMode && store.mode) {
      localStorage.setItem(RESUME_KEY, JSON.stringify({
        exerciseIndex: store.mode.currentIndex,
        sessionId: store.mode.sessionId,
        timestamp: Date.now(),
      }));
    }
    if (!store.isInWorkoutMode) {
      localStorage.removeItem(RESUME_KEY);
    }
  }, [store.isInWorkoutMode, store.mode?.currentIndex]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (store.mode?.restTimerActive && !paused) {
      interval = setInterval(() => {
        const rem = store.mode?.restSecondsRemaining ?? 0;
        if (workoutPrefs.audioBeepsEnabled && rem <= 3 && rem > 0) playBeep(440, 0.15);
        if (rem <= 1) {
          if (workoutPrefs.audioBeepsEnabled) playBeep(880, 0.4);
          haptic([30, 30, 80]);
        }
        store.tickRest();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [store.mode?.restTimerActive, store.mode?.restSecondsRemaining, workoutPrefs.audioBeepsEnabled, paused]);

  const firstDay   = activeProg?.weeks[0]?.days[0];
  const allPE      = firstDay?.blocks.flatMap((b) => b.exercises) || [];

  const filteredPE = allPE.filter((pe) => {
    const ex = allExercises.find((e) => e.id === pe.exerciseId);
    if (!ex || ex.equipment.length === 0) return true;
    return ex.equipment.some((eq) => localEquipment.includes(eq));
  });

  const estimatedMin = Math.round(
    filteredPE.reduce((acc, pe) => {
      const ex  = allExercises.find((e) => e.id === pe.exerciseId);
      const rest = ex?.content?.restSeconds ?? 60;
      const dur  = ex?.content?.expectedDurationMin ?? 3;
      return acc + dur + (rest * pe.sets) / 60;
    }, 0)
  );

  const mode        = store.mode;
  const currIdx     = mode?.currentIndex ?? 0;
  const totalEx     = mode?.programExercises.length ?? 0;
  const currentPE   = mode?.programExercises[currIdx];
  const currentEx   = allExercises.find((e) => e.id === currentPE?.exerciseId);
  const nextPE      = mode?.programExercises[currIdx + 1];
  const nextEx      = allExercises.find((e) => e.id === nextPE?.exerciseId);
  const sessionPct  = totalEx > 0 ? Math.round((currIdx / totalEx) * 100) : 0;
  const setsTarget  = currentPE?.sets ?? 3;
  const setsLogged  = mode?.currentSets.length ?? 0;
  const setPct      = setsTarget > 0 ? Math.round((setsLogged / setsTarget) * 100) : 0;
  const restActive  = mode?.restTimerActive ?? false;
  const restRem     = mode?.restSecondsRemaining ?? 0;
  const isResting   = restActive && restRem > 0;
  const focusMode   = workoutPrefs.focusModeEnabled;

  const handleLaunch = useCallback(() => {
    setWorkoutPrefs({ availableEquipment: localEquipment });
    store.startSession(`session-${Date.now()}`, filteredPE);
    store.enterWorkoutMode();
    setScreen("active");
    haptic(50);
  }, [filteredPE, localEquipment, setWorkoutPrefs]);

  const handleCompleteSet = useCallback(() => {
    haptic([30, 20, 60]);
    store.addSet({ setNumber: setsLogged + 1, reps: repsInput, pain: painLevel, completed: true });
    const rest = currentPE?.restSecondsOverride ?? currentEx?.content?.restSeconds ?? workoutPrefs.defaultRestSeconds;
    store.startRestTimer(rest);

    const isLastSet = setsLogged + 1 >= setsTarget;
    if (isLastSet) {
      setShowConfidence(true);
    }
  }, [setsLogged, setsTarget, repsInput, painLevel, currentPE, currentEx, workoutPrefs]);

  const handleConfidenceSelect = useCallback((confidence: number) => {
    setShowConfidence(false);
    const banner = `✅ ${currentEx?.name ?? "Exercise"} — Complete!`;
    setCompletionBanner(banner);
    setTimeout(() => {
      setCompletionBanner(null);
      if (currIdx + 1 >= totalEx) {
        localStorage.removeItem(RESUME_KEY);
        setScreen("finished");
        store.endSession();
        haptic([100, 50, 100, 50, 300]);
      } else if (workoutPrefs.autoAdvance) {
        store.nextExercise();
        haptic(40);
      }
    }, 1800);
  }, [currIdx, totalEx, currentEx, workoutPrefs]);

  const handlePauseToggle = useCallback(() => {
    setPaused((p) => {
      haptic(p ? [20, 20] : 80);
      return !p;
    });
  }, []);

  const handleSwipe = useCallback((deltaX: number) => {
    if (Math.abs(deltaX) < 60) return;
    if (deltaX < 0 && currIdx < totalEx - 1) { store.nextExercise(); haptic(30); }
    if (deltaX > 0 && currIdx > 0)           { store.prevExercise(); haptic(30); }
  }, [currIdx, totalEx]);

  if (resumeData && !store.isInWorkoutMode && screen === "equipment") {
    return (
      <div className="max-w-lg mx-auto py-8 px-4 space-y-6 animate-fade-in pb-24">
        <div className="p-6 rounded-2xl border-2 border-primary/40 bg-primary/5 space-y-4 shadow-lg">
          <p className="text-xs font-black uppercase tracking-wider text-primary">Continue Session?</p>
          <p className="text-base font-extrabold text-foreground">
            You were on exercise {resumeData.exerciseIndex + 1} of {allPE.length}
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            Your last session was saved. Pick up exactly where you left off.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setResumeData(null);
                localStorage.removeItem(RESUME_KEY);
              }}
              variant="outline" className="flex-1 font-bold">
              Discard
            </Button>
            <Button
              onClick={() => {
                setResumeData(null);
                setWorkoutPrefs({ availableEquipment: localEquipment });
                store.startSession(`session-${Date.now()}`, filteredPE);
                store.enterWorkoutMode();
                for (let i = 0; i < resumeData.exerciseIndex; i++) store.nextExercise();
                setScreen("active");
                haptic(50);
              }}
              className="flex-1 font-bold gap-1.5">
              <Zap size={16} /> Resume
            </Button>
          </div>
        </div>
        <Button variant="ghost" onClick={() => setResumeData(null)} className="w-full text-muted-foreground font-bold">
          Start Fresh Instead
        </Button>
      </div>
    );
  }

  if (screen === "equipment") {
    return (
      <div className="max-w-lg mx-auto py-6 px-4 space-y-6 animate-fade-in pb-24">
        <div>
          <h1 className="text-2xl font-black text-foreground">Today&apos;s Workout</h1>
          <p className="text-sm text-muted-foreground font-medium mt-0.5">
            ≈{estimatedMin} min · {allPE.length} exercises · {allPE.reduce((a, p) => a + p.sets, 0)} sets
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">Available Equipment Today</p>
          <EquipmentSelector selected={localEquipment} onChange={setLocalEquipment} />
        </div>
        <p className="text-xs text-muted-foreground font-medium text-center">
          {filteredPE.length} of {allPE.length} exercises match your equipment
        </p>
        <Button onClick={() => setScreen("preview")} className="w-full py-7 text-lg font-black rounded-2xl shadow-lg gap-2" disabled={filteredPE.length === 0}>
          <Play size={20} fill="currentColor" /> Preview Workout
        </Button>
      </div>
    );
  }

  if (screen === "preview") {
    return (
      <div className="max-w-lg mx-auto py-6 px-4 space-y-4 animate-fade-in pb-24">
        <div>
          <h1 className="text-2xl font-black text-foreground">Today&apos;s Workout</h1>
          <p className="text-sm text-muted-foreground font-medium">≈{estimatedMin} min · {filteredPE.length} exercises</p>
        </div>
        <div className="space-y-2">
          {filteredPE.map((pe, idx) => {
            const ex  = allExercises.find((e) => e.id === pe.exerciseId);
            const base = import.meta.env.BASE_URL || "/";
            const img  = ex?.content?.formGuideImage ? `${base}${ex.content.formGuideImage}`.replace(/\/+/g, "/") : null;
            return (
              <div key={pe.id} className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/20 border border-border">
                <span className="text-xs font-black text-muted-foreground w-5 text-center">{idx + 1}</span>
                {img ? (
                  <img src={img} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0 text-xl">🏋️</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold truncate">{ex?.name ?? pe.exerciseId}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{pe.sets} sets · {pe.reps ?? "15"} reps</p>
                </div>
                <Badge variant={ex?.safety === "green" ? "safe" : "caution"} className="text-[9px] font-black shrink-0">
                  {ex?.safety === "green" ? "✅" : "⚠️"}
                </Badge>
              </div>
            );
          })}
        </div>
        <Button onClick={handleLaunch} className="w-full py-7 text-lg font-black rounded-2xl shadow-lg gap-2 mt-4">
          <Zap size={20} /> Start Session
        </Button>
        <Button variant="ghost" onClick={() => setScreen("equipment")} className="w-full font-bold text-muted-foreground">
          ← Change Equipment
        </Button>
      </div>
    );
  }

  if (screen === "finished") {
    return <FinishScreen onDone={() => navigate("/")} />;
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col overflow-hidden">
      {helpOpen && <NeedHelpSheet ex={currentEx} restRem={restRem} onClose={() => setHelpOpen(false)} />}
      {queueOpen && mode && (
        <QueueDrawer exercises={mode.programExercises} allExercises={allExercises} currentIndex={currIdx} onClose={() => setQueueOpen(false)} />
      )}
      {showConfidence && (
        <ConfidenceModal exName={currentEx?.name ?? "Exercise"} onSelect={handleConfidenceSelect} />
      )}

      {completionBanner && (
        <div className="absolute top-0 inset-x-0 z-50 bg-green-500 text-white text-center py-4 font-black text-sm animate-fade-in shadow-lg">
          {completionBanner}
        </div>
      )}

      {paused && (
        <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center gap-6">
          <p className="text-white font-black text-2xl">Session Paused</p>
          <p className="text-white/60 text-sm font-medium">Exercise {currIdx + 1} of {totalEx}</p>
          <Button onClick={handlePauseToggle} className="px-10 py-5 text-base font-black rounded-2xl gap-2">
            <Play size={20} fill="currentColor" /> Resume
          </Button>
          <button onClick={() => { store.exitWorkoutMode(); navigate("/"); }}
            className="text-white/50 text-sm font-bold hover:text-white/80 transition-colors">
            End Session
          </button>
        </div>
      )}

      {!focusMode && (
        <div className="px-4 pt-3 pb-2 shrink-0 bg-background/95 backdrop-blur-sm space-y-1.5">
          <div className="flex items-center gap-2">
            <button onClick={handlePauseToggle} className="p-1.5 rounded-full hover:bg-secondary transition-colors shrink-0">
              <Pause size={16} className="text-muted-foreground" />
            </button>
            <div className="flex-1 space-y-0.5">
              <div className="flex justify-between text-[10px] font-black text-muted-foreground">
                <span>Session</span>
                <span>{currIdx + 1} / {totalEx}</span>
              </div>
              <Progress value={sessionPct} className="h-1.5" />
            </div>
            <button onClick={() => setQueueOpen(true)} className="p-1.5 rounded-full hover:bg-secondary transition-colors shrink-0">
              <List size={16} className="text-muted-foreground" />
            </button>
          </div>
          <div className="flex items-center gap-2 pl-9 pr-9">
            <div className="flex-1 space-y-0.5">
              <div className="flex justify-between text-[10px] font-black text-muted-foreground">
                <span>Set</span>
                <span>{Math.min(setsLogged + 1, setsTarget)} / {setsTarget}</span>
              </div>
              <Progress value={setPct} className="h-1.5 [&>div]:bg-primary/50" />
            </div>
          </div>
        </div>
      )}

      <div
        className="relative flex-shrink-0 bg-black overflow-hidden"
        style={{ height: focusMode ? "55dvh" : "42dvh" }}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchStartX.current !== null) {
            handleSwipe(touchStartX.current - e.changedTouches[0].clientX);
            touchStartX.current = null;
          }
        }}
        onContextMenu={(e) => { e.preventDefault(); setHelpOpen(true); }}
      >
        {isResting && nextEx && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 gap-3">
            <p className="text-xs font-black uppercase tracking-widest text-primary">Up Next</p>
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/40">
              <ExerciseMedia ex={nextEx} className="w-full h-full object-cover" />
            </div>
            <p className="text-base font-black text-white text-center px-4">{nextEx.name}</p>
            <p className="text-4xl font-black text-primary tabular-nums">{formatTimer(restRem)}</p>
            <button onClick={() => store.cancelRest()}
              className="text-xs font-bold text-white/50 hover:text-white transition-colors border border-white/20 px-4 py-1.5 rounded-full">
              Skip Rest →
            </button>
          </div>
        )}

        <ExerciseMedia ex={currentEx} className="w-full h-full object-cover" />

        {isResting && !nextEx && (
          <div className="absolute top-3 right-3 z-20 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-black shadow-lg tabular-nums">
            ⏱ {formatTimer(restRem)}
          </div>
        )}

        {currIdx > 0 && (
          <button onClick={() => store.prevExercise()} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur-sm">
            <ChevronLeft size={20} className="text-white" />
          </button>
        )}
        {currIdx < totalEx - 1 && (
          <button onClick={() => store.nextExercise()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur-sm">
            <ChevronRight size={20} className="text-white" />
          </button>
        )}

        <div className="absolute top-2 left-2">
          <Badge variant={currentEx?.safety === "green" ? "safe" : "caution"} className="text-[9px] font-black shadow-sm">
            <ShieldCheck size={10} className="mr-1" />
            {currentEx?.safety === "green" ? "⭐⭐ Safe" : "⚠️ Caution"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col flex-1 px-4 pt-3 pb-4 gap-2 overflow-hidden">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-primary">Now Playing</p>
          <h1 className="text-xl font-black leading-tight line-clamp-1">{currentEx?.name ?? currentPE?.exerciseId}</h1>
          <p className="text-sm font-bold text-muted-foreground mt-0.5">{currentPE?.reps ?? "15"} reps · {currentEx?.category}</p>
        </div>

        {currentEx?.content?.rememberCue && !dismissedReminders[currentEx.id] && (
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs font-bold flex-1 leading-snug">{currentEx.content.rememberCue}</p>
            <button onClick={() => setDismissedReminders((p) => ({ ...p, [currentEx.id]: true }))}>
              <X size={11} className="text-muted-foreground" />
            </button>
          </div>
        )}

        {!focusMode && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-muted-foreground shrink-0">Pain</span>
            <div className="flex gap-1">
              {[0,1,2,3,4,5,6,7,8,9,10].map((n) => (
                <button key={n} onClick={() => { setPainLevel(n); haptic(20); }}
                  className={`w-6 h-6 rounded-full text-[9px] font-black transition-colors ${
                    painLevel === n
                      ? n <= 3 ? "bg-green-500 text-white" : n <= 6 ? "bg-amber-500 text-white" : "bg-red-500 text-white"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >{n}</button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1" />

        <Button
          onClick={handleCompleteSet}
          disabled={isResting || setsLogged >= setsTarget}
          className="w-full py-6 text-base font-black rounded-2xl shadow-lg gap-2 disabled:opacity-40"
        >
          <CheckCircle2 size={20} /> Complete Set
        </Button>

        {!focusMode && (
          <div className="flex gap-2">
            <button onClick={() => { setHelpOpen(true); haptic(20); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors text-xs font-black text-muted-foreground">
              <HelpCircle size={14} /> Need Help?
            </button>
            <button onClick={() => { setQueueOpen(true); haptic(20); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors text-xs font-black text-muted-foreground">
              <ChevronDown size={14} /> Queue
            </button>
          </div>
        )}

        <button
          onClick={() => setWorkoutPrefs({ focusModeEnabled: !focusMode })}
          className="text-center text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          {focusMode ? "⊕ Exit Focus Mode" : "◎ Enter Focus Mode"}
        </button>
      </div>
    </div>
  );
}
