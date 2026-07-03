import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck, CheckCircle2, Play, Sparkles, Clock, Flame, Layers, Eye, Circle, ArrowRight } from "lucide-react";
import { useExercises } from "@/hooks/useData";
import { useWorkoutStore } from "@/store/workoutStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

const postureExIds = ["chin-tuck", "band-pull-apart", "wall-slide", "face-pull"];

export function Posture() {
  const navigate = useNavigate();
  const allExercises = useExercises();
  const store = useWorkoutStore();

  const [compareSlider, setCompareSlider] = useState([50]);
  const [alignmentChecks, setAlignmentChecks] = useState([
    { id: 1, label: "Scapular Winging Eliminated", desc: "Verifying medial border flush against ribcage at rest.", checked: true },
    { id: 2, label: "Forward Head Posture Neutralized", desc: "Tragus of ear aligned plumb vertical with acromion process.", checked: true },
    { id: 3, label: "Zero Upper Trapezius Shrugging", desc: "No elevation during 135° overhead wall slides.", checked: false },
    { id: 4, label: "Symmetric Glenohumeral Height", desc: "Right shoulder blade leveled with uninjured left shoulder.", checked: false },
  ]);

  const toggleCheck = (id: number) => {
    setAlignmentChecks(alignmentChecks.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const postureExercises = postureExIds
    .map((id) => allExercises.find((ex) => ex.id === id))
    .filter(Boolean);

  const handleLaunchRoutine = () => {
    if (postureExercises.length === 0) return;
    const sessionExercises = postureExercises.map((ex, idx) => ({
      id: `posture-${idx}`,
      exerciseId: ex!.id,
      order: idx + 1,
      sets: 2,
      reps: "15",
      restSecondsOverride: 30,
    }));
    store.startSession("daily-posture-routine", sessionExercises);
    navigate("/workout");
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <PageHeader
        title="Daily Scapular Armor & Posture Circuit"
        description="Forward head posture and thoracic kyphosis directly narrow subacromial clearance. Perform this 10-minute daily routine to eliminate impingement."
      />

      {/* Hero Card */}
      <Card className="border-border shadow-md overflow-hidden bg-gradient-to-r from-rehab-teal/90 via-rehab-teal to-rehab-blue text-white">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-black uppercase tracking-widest text-white/80">Ergonomic Armor</span>
            <h2 className="text-2xl sm:text-3xl font-black">Open Subacromial Space</h2>
            <p className="text-white/90 text-sm max-w-xl font-medium">
              Rounded shoulders tilt the glenoid cavity forward by up to 15°, dramatically increasing vulnerability during overhead motion. This 10-minute circuit restores tall neutral alignment.
            </p>
          </div>
          <Button
            onClick={handleLaunchRoutine}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 font-black text-base shadow-lg shrink-0 gap-2 py-6"
          >
            <Play size={20} fill="currentColor" /> Start 10-Min Circuit
          </Button>
        </div>
      </Card>

      {/* Routine Steps */}
      <div className="space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
          Circuit Breakdown ({postureExercises.length} Movements)
        </span>
        <div className="grid gap-4 sm:grid-cols-2">
          {postureExercises.map((ex, idx) => (
            <Card
              key={ex?.id}
              onClick={() => navigate(`/knowledge/${ex?.id}`)}
              className="cursor-pointer border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="h-8 w-8 rounded-xl bg-primary/10 text-primary font-black text-sm flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    <Clock size={12} /> ~2.5 mins
                  </Badge>
                </div>
                <h3 className="font-extrabold text-lg text-foreground">{ex?.name}</h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  {ex?.content.purpose}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
                <span>Inspect Rationale</span>
                <span>2 sets × 15 reps →</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Before/After Alignment Comparison Tool */}
      <Card className="shadow-md border-border">
        <CardHeader className="bg-secondary/20 pb-4 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers size={20} className="text-primary" /> Before vs. After Scapular Alignment Visualizer
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Slide between Week 1 (Anterior tilt & scapular winging) and Week 6 (Restored scapulohumeral rhythm & neutral cervical carriage).
          </p>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Visual Comparison Box */}
            <div className="p-6 rounded-3xl border-2 border-dashed bg-secondary/15 space-y-4 text-center">
              <div className="flex justify-between items-center text-xs font-extrabold">
                <Badge variant={compareSlider[0] < 50 ? "destructive" : "outline"}>Baseline (Week 1)</Badge>
                <Badge variant={compareSlider[0] >= 50 ? "safe" : "outline"}>Current Phase (Week 6)</Badge>
              </div>

              {/* Simulated Visual Representation */}
              <div className="py-6 px-4 rounded-2xl bg-card border shadow-inner flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
                <div className="text-sm font-black text-foreground mb-1">
                  {compareSlider[0] < 50 ? "Anterior Head Carriage (+2.0 in)" : "Neutral Cervical Plumb Line (0.0 in)"}
                </div>
                <p className="text-xs text-muted-foreground max-w-sm">
                  {compareSlider[0] < 50
                    ? "Scapular medial border wings off ribcage by 18mm during reaching."
                    : "Serratus anterior actively pins medial scapula flush against ribcage."}
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-primary">
                  <span>Subacromial Clearance:</span>
                  <span className="font-mono bg-primary/10 px-2 py-0.5 rounded">
                    {compareSlider[0] < 50 ? "5.2 mm (Impingement Risk)" : "10.8 mm (Optimal Space)"}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold text-muted-foreground">
                  <span>Week 1 Profile</span>
                  <span>Slide to inspect progression</span>
                  <span>Week 6 Profile</span>
                </div>
                <Slider value={compareSlider} onValueChange={setCompareSlider} max={100} step={1} />
              </div>
            </div>

            {/* Clinical Postural Milestones Checklist */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-foreground uppercase tracking-wider">
                Clinical Postural Verification Checklist
              </h4>
              <div className="space-y-2.5">
                {alignmentChecks.map((check) => (
                  <div
                    key={check.id}
                    onClick={() => toggleCheck(check.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      check.checked ? "bg-rehab-green/5 border-rehab-green/30" : "bg-card border-border hover:border-primary/40 shadow-sm"
                    }`}
                  >
                    {check.checked ? (
                      <CheckCircle2 size={18} className="text-rehab-green shrink-0 mt-0.5" />
                    ) : (
                      <Circle size={18} className="text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-foreground">{check.label}</p>
                      <p className="text-[11px] text-muted-foreground">{check.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
