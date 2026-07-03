import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import {
  Dashboard, Programs, Workout, KnowledgeBase, ExerciseDetail,
  Posture, Health, Progress, MedicalRecords, Settings
} from "@/pages/index";
import { seedDefaultDataIfEmpty } from "@/lib/db";
import { useAppStore } from "@/store/appStore";

export function App() {
  const { theme } = useAppStore();

  useEffect(() => {
    // Seed database on first startup
    seedDefaultDataIfEmpty().catch(console.error);

    // Ensure theme class is applied on root html
    const root = document.documentElement;
    root.classList.remove("dark", "medical-blue");
    if (theme === "dark")         root.classList.add("dark");
    if (theme === "medical-blue") root.classList.add("medical-blue");
  }, [theme]);

  return (
    <div className="flex min-h-screen bg-background text-foreground pb-16 md:pb-0">
      <Sidebar />
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-y-auto">
        <Routes>
          <Route path="/"               element={<Dashboard />} />
          <Route path="/programs"       element={<Programs />} />
          <Route path="/workout"        element={<Workout />} />
          <Route path="/knowledge"      element={<KnowledgeBase />} />
          <Route path="/knowledge/:id"  element={<ExerciseDetail />} />
          <Route path="/posture"        element={<Posture />} />
          <Route path="/health"         element={<Health />} />
          <Route path="/progress"       element={<Progress />} />
          <Route path="/medical"        element={<MedicalRecords />} />
          <Route path="/settings"       element={<Settings />} />
        </Routes>
      </main>
      <MobileNav />
    </div>
  );
}
