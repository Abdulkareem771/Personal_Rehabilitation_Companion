import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, ShieldCheck, Sparkles, Wrench, AlertTriangle, Lightbulb, Image as ImageIcon } from "lucide-react";
import { useExerciseById, useMediaAssets, useExerciseLogs } from "@/hooks/useData";
import { useWorkoutStore } from "@/store/workoutStore";
import { VolumePainChart, type ChartDataPoint } from "@/components/analytics/VolumePainChart";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const exercise = useExerciseById(id || "");
  const mediaAssets = useMediaAssets(id || "");
  const logs = useExerciseLogs(id || "");
  const store = useWorkoutStore();



  if (!exercise) {
    return (
      <Card className="p-12 text-center space-y-4">
        <p className="font-bold text-muted-foreground">Exercise not found.</p>
        <Button onClick={() => navigate("/knowledge")}>Back to Library</Button>
      </Card>
    );
  }

  const handleLaunchSingle = () => {
    store.startSession(`quick-${Date.now()}`, [
      { id: `pe-${Date.now()}`, exerciseId: exercise.id, order: 1, sets: 3, reps: "15" }
    ]);
    store.enterWorkoutMode();
    navigate("/workout");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Back button & Header */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="font-bold gap-1.5">
          <ArrowLeft size={16} /> Back
        </Button>
        <div className="flex items-center gap-2">
          <Badge className="capitalize">{exercise.category}</Badge>
          <Badge variant={exercise.safety === "green" ? "safe" : "caution"}>
            <ShieldCheck size={14} className="mr-1" /> {exercise.safety} Safety
          </Badge>
        </div>
      </div>

      {/* Main Title Card */}
      <Card className="border-border overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-primary to-rehab-blue p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-white/80">Biomechanical Breakdown</span>
            <h1 className="text-2xl sm:text-3xl font-black">{exercise.name}</h1>
            <p className="text-white/85 text-sm max-w-xl font-medium">{exercise.content.purpose}</p>
          </div>
          <Button onClick={handleLaunchSingle} size="lg" className="bg-white text-primary hover:bg-white/90 font-black shadow-md shrink-0 gap-2">
            <Play size={18} fill="currentColor" /> Quick Start Session
          </Button>
        </div>
      </Card>

      {/* 4-Tab Navigation: Quick Start | Learn | History | Notes */}
      <Tabs defaultValue="learn" className="w-full">
        <TabsList className="grid grid-cols-4 w-full sm:max-w-md mx-auto mb-6">
          <TabsTrigger value="quick">Quick Start</TabsTrigger>
          <TabsTrigger value="learn">Learn & Why</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Tab 1: Quick Start */}
        <TabsContent value="quick">
          <Card>
            <CardHeader>
              <CardTitle>Execution Quick Sheet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-secondary/30 border space-y-1">
                  <span className="text-xs font-extrabold uppercase text-muted-foreground">Target Tempo</span>
                  <p className="font-black text-lg text-primary">{exercise.content.tempoCue || "2-1-2"}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30 border space-y-1">
                  <span className="text-xs font-extrabold uppercase text-muted-foreground">Rest Interval</span>
                  <p className="font-black text-lg text-foreground">{exercise.content.restSeconds} seconds</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30 border space-y-1">
                  <span className="text-xs font-extrabold uppercase text-muted-foreground">Expected Duration</span>
                  <p className="font-black text-lg text-foreground">{exercise.content.expectedDurationMin} mins</p>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Step-by-Step Checklist</span>
                <ol className="space-y-2 list-decimal list-inside text-sm font-semibold">
                  {exercise.content.instructions.map((inst, i) => (
                    <li key={i} className="leading-relaxed pl-1">{inst}</li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Learn & Why (Deep Biomechanical & Medical Rationale) */}
        <TabsContent value="learn" className="space-y-6">
          {/* Personalized WHY */}
          {exercise.content.personalizedWhy && (
            <Card className="border-primary/40 bg-primary/5 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-primary flex items-center gap-2">
                  <Sparkles size={18} /> Why You Need This (Bankart Lesion Protocol)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base font-semibold leading-relaxed text-foreground">
                  {exercise.content.personalizedWhy}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Engineering Analogy */}
          {exercise.content.engineeringExplanation && (
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench size={18} className="text-rehab-blue" /> Biomechanical & Engineering Analogy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                  "{exercise.content.engineeringExplanation}"
                </p>
              </CardContent>
            </Card>
          )}

          {/* Common Mistakes & Learning Tips */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="shadow-md border-rehab-amber/30">
              <CardHeader className="pb-3 bg-rehab-amber/5">
                <CardTitle className="text-base text-rehab-amber flex items-center gap-2">
                  <AlertTriangle size={18} /> Common Pitfalls to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                {exercise.content.commonMistakes?.map((err, i) => (
                  <div key={i} className="text-xs font-semibold text-foreground flex items-start gap-2">
                    <span className="text-rehab-amber font-bold">✕</span>
                    <span>{err}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-md border-rehab-green/30">
              <CardHeader className="pb-3 bg-rehab-green/5">
                <CardTitle className="text-base text-rehab-green flex items-center gap-2">
                  <Lightbulb size={18} /> Pro Learning Cues
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                {exercise.content.learningTips?.map((tip, i) => (
                  <div key={i} className="text-xs font-semibold text-foreground flex items-start gap-2">
                    <span className="text-rehab-green font-bold">✓</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Infographics & Biomechanical Diagrams */}
          {mediaAssets.length > 0 && (
            <Card className="shadow-md border-border">
              <CardHeader className="pb-3 bg-secondary/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ImageIcon size={18} className="text-primary" /> Clinical Biomechanics &amp; Infographics ({mediaAssets.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid sm:grid-cols-2 gap-6">
                {mediaAssets.map((m) => {
                  const base = import.meta.env.BASE_URL || "/";
                  const imageUrl = `${base}${m.filename}`.replace(/\/+/g, "/");
                  return (
                    <div key={m.id} className="p-4 rounded-2xl border bg-card space-y-4 shadow-sm flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px] uppercase font-extrabold text-primary">
                            {m.type}
                          </Badge>
                          <span className="text-[10px] font-mono text-muted-foreground">{m.filename}</span>
                        </div>
                        <p className="text-xs font-semibold text-foreground leading-relaxed">
                          {m.caption}
                        </p>
                      </div>

                      {/* Image Viewer Container */}
                      <div className="aspect-[4/3] w-full rounded-xl bg-secondary/35 border flex items-center justify-center overflow-hidden p-2">
                        <img
                          src={imageUrl}
                          alt={m.caption}
                          className="max-h-full object-contain hover:scale-105 transition-all duration-300"
                          onError={(e) => {
                            // Fallback to absolute local root if Base URL fails
                            e.currentTarget.src = `/${m.filename}`;
                          }}
                        />
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1 border-t border-border/50">
                        {m.tags.map((t) => (
                          <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

        </TabsContent>


        {/* Tab 3: History */}
        <TabsContent value="history" className="space-y-6">
          <VolumePainChart
            data={logs.map((log) => {
              const vol = log.sets.reduce((acc, s) => acc + ((s.weight || 10) * (s.reps || 10)), 0);
              return {
                date: log.date,
                label: log.date.split("T")[0].slice(5),
                volume: vol,
                pain: log.overallPain || 0,
              };
            })}
            title={`${exercise.name} Longitudinal Analytics`}
          />

          {logs.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm uppercase text-muted-foreground tracking-wider">Historical Logbook</h4>
              {logs.map((log) => (
                <Card key={log.id} className="p-4 rounded-2xl border bg-card shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-foreground">{log.date.split("T")[0]}</span>
                    <Badge variant={log.overallPain <= 2 ? "safe" : "outline"} className="font-bold">
                      Pain: {log.overallPain} / 10
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
                    {log.sets.map((s, idx) => (
                      <span key={idx} className="px-2 py-1 rounded bg-secondary text-foreground">
                        Set {s.setNumber}: {s.weight || 0}kg × {s.reps || 0} reps
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground font-bold">
              <p>Past set logs for {exercise.name} will appear here after your first completed workout.</p>
            </Card>
          )}
        </TabsContent>


        {/* Tab 4: Notes */}
        <TabsContent value="notes">
          <Card className="p-8 text-center text-muted-foreground font-bold">
            <p>Personal clinician & sensation notes can be recorded here during your sessions.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
