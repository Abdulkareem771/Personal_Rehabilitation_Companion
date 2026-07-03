import { useState } from "react";
import { Activity, ShieldAlert, Utensils, Pill, Moon, HeartPulse, CheckCircle2, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

export function Health() {
  const [painRating, setPainRating] = useState<number[]>([1]);
  const [sleepHours, setSleepHours] = useState<number[]>([7.5]);
  const [fatigueLevel, setFatigueLevel] = useState<number[]>([2]);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <PageHeader
        title="Unified Health & Recovery Hub"
        description="Monitor systemic recovery factors, log daily pain levels, track tissue-repair nutrition, and manage prescribed supplements in one central vault."
      />

      <Tabs defaultValue="recovery" className="w-full">
        <TabsList className="grid grid-cols-4 w-full sm:max-w-xl mx-auto mb-6">
          <TabsTrigger value="recovery" className="gap-1.5"><HeartPulse size={16} /> Recovery</TabsTrigger>
          <TabsTrigger value="pain" className="gap-1.5"><ShieldAlert size={16} /> Pain Log</TabsTrigger>
          <TabsTrigger value="nutrition" className="gap-1.5"><Utensils size={16} /> Nutrition</TabsTrigger>
          <TabsTrigger value="medication" className="gap-1.5"><Pill size={16} /> Supplements</TabsTrigger>
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

                <Button className="w-full font-extrabold shadow-sm">Save Recovery Entry</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Pain Diary */}
        <TabsContent value="pain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Glenohumeral Joint Pain & Sensation Diary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Current Resting Pain Intensity (0 = None, 10 = Severe)</span>
                  <Badge variant={painRating[0] > 3 ? "danger" : "safe"}>{painRating[0]} / 10</Badge>
                </div>
                <Slider value={painRating} onValueChange={setPainRating} max={10} step={1} />
              </div>

              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase text-muted-foreground">Recent Log History</span>
                <div className="p-4 rounded-2xl bg-secondary/30 border space-y-1">
                  <div className="flex justify-between text-xs font-bold text-foreground">
                    <span>Yesterday Evening</span>
                    <Badge variant="safe" className="text-[10px]">1 / 10 Pain</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">"Zero clicking during internal rotation stretches before bed."</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Nutrition */}
        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle>Tissue Repair Nutrition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-2xl bg-secondary/30 border flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Daily Collagen & Protein Target</h4>
                  <p className="text-xs text-muted-foreground">Goal: 140g protein · 15g Type I Collagen pre-rehab</p>
                </div>
                <Badge variant="safe">On Track</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Supplements */}
        <TabsContent value="medication">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Prescribed Rehabilitation Supplements</CardTitle>
              <Button size="sm" variant="outline" className="gap-1 font-bold"><Plus size={14} /> Add Supplement</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Hydrolyzed Collagen Peptides + Vitamin C", dose: "15g taken 45m before workout", active: true },
                { name: "Omega-3 Fish Oil (EPA/DHA)", dose: "2000mg daily with breakfast", active: true },
                { name: "Magnesium Glycinate", dose: "400mg before bed for muscle relaxation", active: true },
              ].map((s, i) => (
                <div key={i} className="p-4 rounded-2xl border bg-secondary/20 flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-foreground">{s.name}</h4>
                    <span className="text-xs text-muted-foreground">{s.dose}</span>
                  </div>
                  <CheckCircle2 size={20} className="text-rehab-green" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
