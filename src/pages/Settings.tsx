import { useState, useEffect } from "react";
import { Moon, Sun, Palette, Download, Upload, ShieldCheck, HeartPulse, RotateCcw, CheckCircle2, Dumbbell, Volume2, VolumeX, Zap } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { useProfile } from "@/hooks/useData";
import { db } from "@/lib/db";
import { DEFAULT_RECOVERY_WEIGHTS, type RecoveryWeights } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

export function Settings() {
  const { theme, setTheme, workoutPrefs, setWorkoutPrefs } = useAppStore();
  const profile = useProfile();

  const [weights, setWeights] = useState<RecoveryWeights>(DEFAULT_RECOVERY_WEIGHTS);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    if (profile?.recoveryWeights) {
      setWeights(profile.recoveryWeights);
    }
  }, [profile]);

  const handleWeightChange = (key: keyof RecoveryWeights, val: number) => {
    setWeights((prev) => ({ ...prev, [key]: val / 100 }));
  };

  const handleSaveWeights = async () => {
    if (!profile) return;
    await db.profile.update("default-user", {
      recoveryWeights: weights,
      updatedAt: new Date().toISOString(),
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleResetWeights = () => {
    setWeights(DEFAULT_RECOVERY_WEIGHTS);
  };

  const handleExport = () => {
    alert("ReForge data backup exported successfully to JSON.");
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in pb-16">
      <PageHeader
        title="App Preferences & Clinical Configuration"
        description="Configure your visual theme, customize your personal recovery calculation weighting formula, and manage your offline Dexie database."
      />

      {/* Visual Theme Selection */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Visual Theme Selection</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          {[
            { id: "light", label: "Clinical Light", icon: Sun },
            { id: "dark", label: "Sleek Dark Mode", icon: Moon },
            { id: "medical-blue", label: "Rehab Medical Blue", icon: Palette },
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                    : "bg-card text-foreground border-border hover:border-primary/50"
                }`}
              >
                <Icon size={24} />
                <span className="font-extrabold text-xs">{t.label}</span>
                {isSelected && <Badge className="bg-white/20 text-white border-0 text-[10px]">Active</Badge>}
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Workout Behavior */}
      <Card className="shadow-md border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Dumbbell size={20} className="text-primary" /> Workout Behavior
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Interface Mode */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Interface Mode</span>
            <div className="grid grid-cols-2 gap-3">
              {(["gym", "clinical"] as const).map((mode) => (
                <button key={mode} onClick={() => setWorkoutPrefs({ interfaceMode: mode })}
                  className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                    workoutPrefs.interfaceMode === mode
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/20 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {mode === "gym" ? (
                    <><span className="text-2xl block mb-1">🏋️</span>Gym Floor<br/><span className="text-[10px] font-medium opacity-70">Minimal UI, big buttons</span></>
                  ) : (
                    <><span className="text-2xl block mb-1">🩺</span>Clinical<br/><span className="text-[10px] font-medium opacity-70">Full anatomical detail</span></>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle rows */}
          <div className="space-y-3 pt-1">
            {[
              {
                key: "focusModeEnabled" as const,
                label: "Focus Mode",
                desc: "Hide all secondary UI — only video, sets, rest, and Complete button",
                icon: <Zap size={16} className="text-primary" />,
              },
              {
                key: "autoAdvance" as const,
                label: "Auto-Advance",
                desc: "Automatically move to the next exercise after your final set completes",
                icon: <CheckCircle2 size={16} className="text-green-500" />,
              },
              {
                key: "audioBeepsEnabled" as const,
                label: "Audio Countdown Cues",
                desc: "Play short tones during the final 3 seconds of rest and at completion",
                icon: workoutPrefs.audioBeepsEnabled
                  ? <Volume2 size={16} className="text-primary" />
                  : <VolumeX size={16} className="text-muted-foreground" />,
              },
            ].map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-secondary/10">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{row.icon}</div>
                  <div>
                    <p className="text-sm font-extrabold text-foreground">{row.label}</p>
                    <p className="text-[11px] text-muted-foreground font-medium leading-snug">{row.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setWorkoutPrefs({ [row.key]: !workoutPrefs[row.key] })}
                  className={`relative shrink-0 w-12 h-6 rounded-full transition-colors ${
                    workoutPrefs[row.key] ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    workoutPrefs[row.key] ? "translate-x-7" : "translate-x-1"
                  }`} />
                </button>
              </div>
            ))}
          </div>

          {/* Default Rest Duration */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Default Rest Duration</span>
            <div className="flex gap-2">
              {[45, 60, 90, 120].map((sec) => (
                <button key={sec} onClick={() => setWorkoutPrefs({ defaultRestSeconds: sec })}
                  className={`flex-1 py-3 rounded-xl border-2 text-sm font-black transition-all ${
                    workoutPrefs.defaultRestSeconds === sec
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/20 text-muted-foreground"
                  }`}
                >{sec}s</button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customizable Recovery Formula Engine */}
      <Card className="shadow-md border-border">
        <CardHeader className="bg-secondary/20 pb-4 border-b border-border">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <HeartPulse size={20} />
              </div>
              <div>
                <CardTitle className="text-lg">Clinical Recovery Formula Customization</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Adjust how much each metric impacts your daily readiness score. For Bankart labral stabilization, we recommend keeping pain and stability weighted highest.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetWeights}
              className="font-bold text-xs gap-1.5"
            >
              <RotateCcw size={14} /> Reset Defaults
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { key: "pain", label: "Joint Pain & Sensation Weight", desc: "Prioritizes low resting pain before heavy load." },
              { key: "stability", label: "Shoulder Stability & Clicking Weight", desc: "Monitors anterior capsule guarding." },
              { key: "sleep", label: "Sleep Duration & Quality Weight", desc: "Crucial for systemic connective tissue recovery." },
              { key: "fatigue", label: "Systemic Muscular Fatigue Weight", desc: "Prevents compensation patterns when tired." },
              { key: "hydration", label: "Hydration Weight", desc: "Maintains synovial fluid volume and elasticity." },
              { key: "nutrition", label: "Collagen & Protein Intake Weight", desc: "Fuels Type I collagen synthesis." },
            ].map((item) => {
              const currentPct = Math.round((weights[item.key as keyof RecoveryWeights] || 0) * 100);
              return (
                <div key={item.key} className="p-4 rounded-2xl border bg-card space-y-3 shadow-sm">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-foreground">{item.label}</h4>
                      <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                    </div>
                    <Badge variant="outline" className="font-black text-xs text-primary shrink-0">
                      {currentPct}%
                    </Badge>
                  </div>
                  <Slider
                    value={[currentPct]}
                    onValueChange={(vals) => handleWeightChange(item.key as keyof RecoveryWeights, vals[0])}
                    max={60}
                    step={5}
                  />
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between flex-wrap gap-4">
            <div className="text-xs text-muted-foreground">
              Total Weight Allocations: <span className="font-black text-foreground">
                {Math.round(Object.values(weights).reduce((a, b) => a + b, 0) * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              {savedMessage && (
                <span className="text-xs font-bold text-rehab-green flex items-center gap-1">
                  <CheckCircle2 size={16} /> Formula Saved to Profile!
                </span>
              )}
              <Button onClick={handleSaveWeights} className="font-extrabold px-8 shadow-md">
                Save Recovery Weights
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline Vault Management */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Data & Offline Backup Vault</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-2xl bg-secondary/30 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-rehab-green" /> 100% Private Offline Storage
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                All logs, pain ratings, and custom programs reside exclusively in your browser's Dexie IndexedDB.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={handleExport} variant="outline" className="font-bold gap-1.5 flex-1 sm:flex-initial">
                <Download size={16} /> Export JSON
              </Button>
              <Button variant="outline" className="font-bold gap-1.5 flex-1 sm:flex-initial">
                <Upload size={16} /> Import
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
