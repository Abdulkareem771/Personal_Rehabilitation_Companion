import { useNavigate } from "react-router-dom";
import { UserCheck, CheckCircle2, Play, Sparkles, Clock, Flame } from "lucide-react";
import { useExercises } from "@/hooks/useData";
import { useWorkoutStore } from "@/store/workoutStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const postureExIds = ["chin-tuck", "band-pull-apart", "wall-slide", "face-pull"];

export function Posture() {
  const navigate = useNavigate();
  const allExercises = useExercises();
  const store = useWorkoutStore();

  const postureExercises = postureExIds
    .map((id) => allExercises.find((e) => e.id === id))
    .filter(Boolean);

  const handleLaunchRoutine = () => {
    const flatPEs = postureExIds.map((id, idx) => ({
      id: `posture-${idx}`,
      exerciseId: id,
      order: idx + 1,
      sets: 2,
      reps: "15",
    }));
    store.startSession(`posture-${Date.now()}`, flatPEs);
    store.enterWorkoutMode();
    navigate("/workout");
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <PageHeader
        title="10-Minute Daily Posture Reset"
        description="Daily ergonomics protocol designed to counter desk slump, retract the scapulae, and relieve anterior labral tension."
        badge={
          <Badge className="bg-rehab-amber/20 text-rehab-amber hover:bg-rehab-amber/30 border-0 font-extrabold flex items-center gap-1">
            <Flame size={14} className="fill-rehab-amber" /> Recommended Daily
          </Badge>
        }
      />

      {/* Hero Launcher */}
      <Card className="overflow-hidden border-border shadow-xl">
        <div className="bg-gradient-to-r from-rehab-teal to-primary p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
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
    </div>
  );
}
