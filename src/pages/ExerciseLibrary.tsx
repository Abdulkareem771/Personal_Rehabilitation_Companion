import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { useExercises } from "@/hooks/useData";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = ["all", "stability", "posture", "mobility", "strength", "core"];

export function KnowledgeBase() {
  const navigate = useNavigate();
  const allExercises = useExercises();
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = allExercises.filter((ex) => {
    const matchCat = selectedCat === "all" || ex.category === selectedCat;
    const matchSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        ex.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <PageHeader
        title="Clinical Knowledge Base"
        description="Search our biomechanically curated exercise library. Every movement includes personalized rationale linking directly to anterior instability recovery."
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search exercises, muscles, or tags (e.g. rotator cuff)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-2xl border border-border bg-card text-sm font-medium focus:ring-2 focus:ring-primary outline-none shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold capitalize transition-all ${
                selectedCat === cat
                  ? "bg-primary text-primary-foreground shadow-sm scale-105"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((ex) => (
          <Card
            key={ex.id}
            onClick={() => navigate(`/knowledge/${ex.id}`)}
            className="group cursor-pointer border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden"
          >
            <div>
              {/* Header Banner */}
              <div className="h-32 bg-gradient-to-br from-secondary via-secondary/60 to-background p-4 flex flex-col justify-between border-b border-border">
                <div className="flex items-center justify-between">
                  <Badge className="capitalize text-[10px] font-black">{ex.category}</Badge>
                  <Badge variant={ex.safety === "green" ? "safe" : "caution"} className="text-[10px] uppercase font-bold">
                    <ShieldCheck size={12} className="mr-1" /> {ex.safety}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                  <Sparkles size={14} className="text-primary" /> Personalized Rationale Included
                </div>
              </div>

              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-lg font-extrabold group-hover:text-primary transition-colors line-clamp-1">
                  {ex.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground line-clamp-2 font-medium mt-1">
                  {ex.content.purpose}
                </p>
              </CardHeader>
            </div>

            <CardContent className="p-5 pt-0 space-y-4">
              <div className="flex flex-wrap gap-1">
                {ex.muscles.slice(0, 3).map((m) => (
                  <span key={m} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-secondary/80 text-muted-foreground">
                    {m}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
                <span>Inspect Biomechanics</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="p-12 text-center text-muted-foreground font-bold">
          No exercises found matching "{searchQuery}".
        </Card>
      )}
    </div>
  );
}
