import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, CheckCircle2, Play, ShieldAlert, Clock, Layers } from "lucide-react";
import { usePrograms, useExercises } from "@/hooks/useData";
import { useAppStore } from "@/store/appStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Programs() {
  const navigate = useNavigate();
  const programs = usePrograms();
  const allExercises = useExercises();
  const { activeProgramId, setActiveProgramId } = useAppStore();

  const activeProg = programs.find((p) => p.id === activeProgramId) || programs[0];
  const [selectedProgId, setSelectedProgId] = useState<string>(activeProg?.id || "");

  const currentProgram = programs.find((p) => p.id === selectedProgId) || activeProg;

  const handleActivate = (id: string) => {
    setActiveProgramId(id);
  };

  const getExerciseName = (exId: string) => {
    return allExercises.find((e) => e.id === exId)?.name || exId;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <PageHeader
        title="Clinical & Gym Programs"
        description="Structured multi-phase protocols designed to take you from post-acute stabilization back to heavy overhead strength."
      />

      {/* Program Selector Pills */}
      <div className="flex flex-wrap gap-3 pb-2">
        {programs.map((p) => {
          const isSelected = p.id === (currentProgram?.id || "");
          const isActive = p.id === activeProg?.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedProgId(p.id)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-sm transition-all border ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                  : "bg-card text-foreground border-border hover:border-primary/50"
              }`}
            >
              <Calendar size={18} />
              <span>{p.name}</span>
              {isActive && (
                <Badge className="bg-rehab-green text-white border-0 text-[10px] uppercase font-black ml-1">
                  Active
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {currentProgram ? (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Program Overview & Guidelines */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-md border-border">
              <CardHeader className="bg-secondary/30 pb-4">
                <Badge variant="outline" className="w-fit mb-2 uppercase tracking-wider font-extrabold">
                  {currentProgram.type}
                </Badge>
                <CardTitle className="text-xl">{currentProgram.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentProgram.description}
                </p>

                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase text-foreground">Clinical Phases</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentProgram.phases.map((ph, i) => (
                      <Badge key={ph} variant={i === 0 ? "default" : "secondary"} className="text-xs">
                        {i + 1}. {ph}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-border">
                  <span className="text-xs font-extrabold uppercase text-foreground">Protocol Goals</span>
                  {currentProgram.goals.map((g) => (
                    <div key={g} className="flex items-start gap-2 text-xs text-muted-foreground font-medium">
                      <CheckCircle2 size={16} className="text-rehab-green shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </div>
                  ))}
                </div>

                {currentProgram.safetyNotes && (
                  <div className="p-3.5 rounded-xl bg-rehab-amber/10 border border-rehab-amber/30 flex items-start gap-3">
                    <ShieldAlert size={18} className="text-rehab-amber shrink-0 mt-0.5" />
                    <p className="text-xs text-rehab-amber font-semibold leading-snug">
                      {currentProgram.safetyNotes}
                    </p>
                  </div>
                )}

                <div className="pt-4">
                  {currentProgram.id === activeProg?.id ? (
                    <Button
                      onClick={() => navigate("/workout")}
                      className="w-full font-extrabold text-base shadow-md py-6 gap-2"
                    >
                      <Play size={18} fill="currentColor" /> Resume Active Protocol
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => handleActivate(currentProgram.id)}
                      className="w-full font-bold py-6 border-primary text-primary hover:bg-primary/10"
                    >
                      Set As Active Protocol
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weeks & Days Drilldown */}
          <div className="lg:col-span-2 space-y-6">
            {currentProgram.weeks.map((week) => (
              <Card key={week.id} className="shadow-md">
                <CardHeader className="bg-secondary/20 border-b border-border py-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Week {week.weekNumber} Protocol</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {week.days.length} Sessions
                    </Badge>
                  </div>
                  {week.goals && (
                    <p className="text-xs text-muted-foreground mt-1 font-medium">{week.goals}</p>
                  )}
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {week.days.map((day) => (
                    <div key={day.id} className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm hover:border-primary/40 transition-colors">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black">
                            <Layers size={20} />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-base text-foreground">{day.name}</h4>
                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Clock size={12} /> ~20 min clinical session
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => navigate("/workout")}
                          className="font-bold gap-1.5 shadow-sm"
                        >
                          <Play size={14} fill="currentColor" /> Start Day
                        </Button>
                      </div>

                      {/* Blocks & Exercises */}
                      <div className="grid sm:grid-cols-3 gap-3 pt-2">
                        {day.blocks.map((block) => (
                          <div key={block.id} className="p-3.5 rounded-xl bg-secondary/30 border border-border space-y-2">
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-extrabold">
                              {block.type}
                            </Badge>
                            <h5 className="font-bold text-xs text-foreground">{block.name}</h5>
                            <ul className="space-y-1 pt-1">
                              {block.exercises.map((pe) => (
                                <li key={pe.id} className="text-xs text-muted-foreground flex justify-between">
                                  <span className="truncate font-medium pr-2">{getExerciseName(pe.exerciseId)}</span>
                                  <span className="font-bold text-foreground shrink-0">{pe.sets}x{pe.reps}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground font-bold">No program selected.</p>
        </Card>
      )}
    </div>
  );
}
