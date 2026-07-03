import { TrendingUp, Trophy, Flame, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";

export function Progress() {
  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <PageHeader
        title="Rehabilitation Analytics & PRs"
        description="Visual evidence of joint stabilization and strength re-acquisition."
      />

      {/* Analytics Grid */}
      <div className="grid gap-6 sm:grid-cols-3">
        <Card className="border-border shadow-sm">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-rehab-amber/10 text-rehab-amber flex items-center justify-center font-black">
              <Flame size={24} />
            </div>
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase">Current Streak</span>
              <p className="text-2xl font-black text-foreground">4 Days</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-rehab-green/10 text-rehab-green flex items-center justify-center font-black">
              <TrendingUp size={24} />
            </div>
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase">Pain Reduction</span>
              <p className="text-2xl font-black text-foreground">-75%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
              <Trophy size={24} />
            </div>
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase">Workouts Done</span>
              <p className="text-2xl font-black text-foreground">12</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Milestone Milestones */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Clinical Milestone Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { title: "Week 1: Rotator Cuff Neurological Activation", done: true, pct: 100 },
            { title: "Week 2: Zero Anterior Subluxation Under Load", done: false, pct: 50 },
            { title: "Week 4: Full Scapulohumeral Rhythm Restoration", done: false, pct: 0 },
            { title: "Week 6: Graduation to Overhead Gym Pressing", done: false, pct: 0 },
          ].map((m, i) => (
            <div key={i} className="p-4 rounded-2xl border bg-secondary/20 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-foreground flex items-center gap-2">
                  {m.done && <CheckCircle2 size={16} className="text-rehab-green" />}
                  {m.title}
                </span>
                <Badge variant={m.done ? "safe" : "outline"}>{m.pct}% Complete</Badge>
              </div>
              <ProgressBar value={m.pct} className="h-1.5" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
