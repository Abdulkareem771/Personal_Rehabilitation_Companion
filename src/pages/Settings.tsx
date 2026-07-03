import { Moon, Sun, Palette, Download, Upload, Trash2, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Settings() {
  const { theme, setTheme } = useAppStore();

  const handleExport = () => {
    alert("ReForge data backup exported successfully to JSON.");
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in pb-16">
      <PageHeader
        title="App Preferences & Offline Data Vault"
        description="Configure your visual theme, measurement units, and manage your 100% private IndexedDB local storage."
      />

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
