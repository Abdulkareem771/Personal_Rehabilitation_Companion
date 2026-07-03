import { useState } from "react";
import { Activity, ShieldAlert, Utensils, Pill, Moon, HeartPulse, CheckCircle2, Plus, Ruler, Compass } from "lucide-react";
import { useMeasurements } from "@/hooks/useData";
import { db } from "@/lib/db";
import { uid, nowISO } from "@/lib/utils";
import { todayISO } from "@/utils/formatters";
import type { Measurement } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Progress as ProgressBar } from "@/components/ui/progress";

export function Health() {
  const measurements = useMeasurements();

  const [painRating, setPainRating] = useState<number[]>([1]);
  const [sleepHours, setSleepHours] = useState<number[]>([7.5]);
  const [fatigueLevel, setFatigueLevel] = useState<number[]>([2]);

  // ROM & Anthropometrics state
  const [abductionDeg, setAbductionDeg] = useState<number[]>([150]);
  const [externalRotDeg, setExternalRotDeg] = useState<number[]>([65]);
  const [internalRotDeg, setInternalRotDeg] = useState<number[]>([50]);
  const [weightKg, setWeightKg] = useState("74.5");
  const [savedRomMessage, setSavedRomMessage] = useState(false);

  const handleSaveMeasurement = async () => {
    const entry: Measurement = {
      id: uid(),
      date: todayISO(),
      weightKg: Number(weightKg) || undefined,
      shoulderAbductionDeg: abductionDeg[0],
      shoulderExternalRotationDeg: externalRotDeg[0],
      shoulderInternalRotationDeg: internalRotDeg[0],
    };
    await db.measurements.put(entry);
    setSavedRomMessage(true);
    setTimeout(() => setSavedRomMessage(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <PageHeader
        title="Unified Health, ROM & Recovery Hub"
        description="Monitor systemic recovery factors, log goniometric shoulder range of motion (ROM), track tissue-repair nutrition, and manage joint supplements."
      />

      <Tabs defaultValue="recovery" className="w-full">
        <TabsList className="grid grid-cols-5 w-full sm:max-w-2xl mx-auto mb-6">
          <TabsTrigger value="recovery" className="gap-1.5 text-xs"><HeartPulse size={14} /> Recovery</TabsTrigger>
          <TabsTrigger value="rom" className="gap-1.5 text-xs"><Compass size={14} /> ROM Log</TabsTrigger>
          <TabsTrigger value="pain" className="gap-1.5 text-xs"><ShieldAlert size={14} /> Pain Diary</TabsTrigger>
          <TabsTrigger value="nutrition" className="gap-1.5 text-xs"><Utensils size={14} /> Nutrition</TabsTrigger>
          <TabsTrigger value="medication" className="gap-1.5 text-xs"><Pill size={14} /> Supplements</TabsTrigger>
        </TabsList>

        {/* Tab 1: Recovery Status */}
        <TabsContent value="recovery" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1 bg-gradient-to-br from-primary/10 to-transparent border-primary/30 flex flex-col justify-center items-center p-6 text-center">
              <span className="text-xs font-black uppercase tracking-wider text-primary mb-2">
                Today's Readiness Score
              </span>
              <div className="text-6xl font-black text-foreground">84%</div>
              <Badge variant="safe" className="mt-2 text-xs">Optimal for Training</Badge>
              <p className="text-xs text-muted-foreground mt-4 font-medium leading-relaxed">
                Your low pain rating (1/10) and adequate sleep (7.5h) mean your joint capsule is primed for stabilization exercises today.
              </p>
            </Card>

            <Card className="md:col-span-2 space-y-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Daily Recovery Metrics Log</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="flex items-center gap-2"><Moon size={16} className="text-rehab-blue" /> Hours of Sleep</span>
                    <span className="font-black text-foreground">{sleepHours[0]} hours</span>
                  </div>
                  <Slider value={sleepHours} onValueChange={setSleepHours} max={12} step={0.5} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="flex items-center gap-2"><Activity size={16} className="text-rehab-amber" /> Systemic Fatigue (0-10)</span>
                    <span className="font-black text-foreground">{fatigueLevel[0]}/10</span>
                  </div>
                  <Slider value={fatigueLevel} onValueChange={setFatigueLevel} max={10} step={1} />
                </div>

                <Button className="w-full font-extrabold shadow-md">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Save Morning Check-In
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Goniometric ROM & Measurements */}
        <TabsContent value="rom" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-md border-border">
              <CardHeader className="bg-secondary/20 pb-4 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Compass size={20} className="text-primary" /> Shoulder Goniometric ROM Logger
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Log active range of motion (° degrees) to track capsule elasticity and subacromial clearance. Normal overhead abduction is ~180°.
                </p>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Active Abduction (Overhead Reach)</span>
                    <span className="font-black text-primary">{abductionDeg[0]}° / 180°</span>
                  </div>
                  <Slider value={abductionDeg} onValueChange={setAbductionDeg} min={45} max={180} step={5} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>External Rotation at 90° Abduction (ER)</span>
                    <span className="font-black text-primary">{externalRotDeg[0]}° / 90°</span>
                  </div>
                  <Slider value={externalRotDeg} onValueChange={setExternalRotDeg} min={15} max={90} step={5} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Internal Rotation Behind Back (IR)</span>
                    <span className="font-black text-primary">{internalRotDeg[0]}° / 70°</span>
                  </div>
                  <Slider value={internalRotDeg} onValueChange={setInternalRotDeg} min={10} max={70} step={5} />
                </div>

                <div className="pt-2 border-t flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Ruler size={16} className="text-muted-foreground" />
                    <span className="text-xs font-bold text-muted-foreground">Bodyweight (kg):</span>
                    <input
                      type="number"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      className="w-20 h-8 px-2 rounded-lg border bg-background font-mono font-bold text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {savedRomMessage && <span className="text-xs font-bold text-rehab-green">Saved!</span>}
                    <Button onClick={handleSaveMeasurement} size="sm" className="font-extrabold shadow-sm">
                      Save ROM Entry
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-border">
              <CardHeader className="bg-secondary/20 pb-4 border-b">
                <CardTitle className="text-lg">Clinical ROM Benchmarks & History</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Comparison of active ROM against uninjured contralateral shoulder norms.
                </p>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {[
                  { label: "Active Overhead Abduction", current: abductionDeg[0], target: 180, unit: "°" },
                  { label: "External Rotation (ER)", current: externalRotDeg[0], target: 90, unit: "°" },
                  { label: "Internal Rotation (IR)", current: internalRotDeg[0], target: 70, unit: "°" },
                ].map((item, i) => {
                  const pct = Math.min(100, Math.round((item.current / item.target) * 100));
                  return (
                    <div key={i} className="p-3.5 rounded-2xl border bg-secondary/15 space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-foreground">{item.label}</span>
                        <Badge variant={pct >= 85 ? "safe" : "outline"} className="font-black text-[10px]">
                          {item.current}{item.unit} ({pct}% of Norm)
                        </Badge>
                      </div>
                      <ProgressBar value={pct} className="h-2" />
                    </div>
                  );
                })}

                {measurements.length > 0 && (
                  <div className="pt-2">
                    <h5 className="text-[11px] font-extrabold uppercase text-muted-foreground mb-2">Past Recorded Entries ({measurements.length})</h5>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {measurements.map((m) => (
                        <div key={m.id} className="flex justify-between items-center p-2 rounded-xl bg-card border text-xs font-medium">
                          <span className="font-bold">{m.date}</span>
                          <span className="text-muted-foreground">
                            Abd: {m.shoulderAbductionDeg || "-"}° | ER: {m.shoulderExternalRotationDeg || "-"}° | Wt: {m.weightKg || "-"}kg
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Pain Log */}
        <TabsContent value="pain">
          <Card>
            <CardHeader>
              <CardTitle>Shoulder Joint Sensation & Pain Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Current Resting Discomfort (0 = Painless, 10 = Severe)</span>
                  <span className="font-black text-rehab-amber">{painRating[0]} / 10</span>
                </div>
                <Slider value={painRating} onValueChange={setPainRating} max={10} step={1} />
              </div>
              <p className="text-xs text-muted-foreground italic">
                Note: Sharp anterior joint capsule pain should never be pushed through during external rotations.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Nutrition */}
        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle>Tissue Repair Nutrition Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="p-4 rounded-xl border bg-secondary/30 flex justify-between items-center">
                <div>
                  <h4 className="font-bold">Daily Protein Target</h4>
                  <span className="text-xs text-muted-foreground">Crucial for connective tissue synthesis</span>
                </div>
                <Badge className="font-mono text-sm">160g / day</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Supplements */}
        <TabsContent value="medication">
          <Card>
            <CardHeader>
              <CardTitle>Prescribed Connective Tissue Supplements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Hydrolyzed Collagen Peptides", dose: "15g", timing: "45m pre-workout with Vitamin C" },
                { name: "Omega-3 Fish Oil (EPA/DHA)", dose: "2000mg", timing: "With breakfast meal" },
                { name: "Vitamin C (Ascorbic Acid)", dose: "500mg", timing: "Co-factor for collagen synthesis" },
              ].map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border bg-card flex justify-between items-center">
                  <div>
                    <h4 className="font-extrabold text-sm text-foreground">{s.name}</h4>
                    <span className="text-xs text-muted-foreground">{s.timing}</span>
                  </div>
                  <Badge variant="safe">{s.dose}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
