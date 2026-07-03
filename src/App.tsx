import { HashRouter, Route, Routes } from "react-router-dom";
import {
  Dashboard, Programs, Workout, KnowledgeBase, ExerciseDetail,
  Posture, Health, Progress, MedicalRecords, Settings
} from "@/pages/index";

// App shell — will be fully redesigned in Layer 6
export function App() {
  return (
    <HashRouter>
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
    </HashRouter>
  );
}
