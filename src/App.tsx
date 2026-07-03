import { NavLink, Route, Routes } from "react-router-dom";
import { Activity, BookOpen, CalendarCheck, ChartNoAxesColumnIncreasing, Dumbbell, HeartPulse, Moon, ShieldCheck, Utensils } from "lucide-react";
import { Dashboard } from "./pages/Dashboard";
import { Workout } from "./pages/Workout";
import { ExerciseLibrary } from "./pages/ExerciseLibrary";
import { Progress } from "./pages/Progress";
import { PainDiary } from "./pages/PainDiary";
import { Nutrition } from "./pages/Nutrition";
import { Doctor } from "./pages/Doctor";

const navItems = [
  { to: "/", label: "Today", icon: Activity },
  { to: "/workout", label: "Workout", icon: Dumbbell },
  { to: "/exercises", label: "Library", icon: BookOpen },
  { to: "/progress", label: "Progress", icon: ChartNoAxesColumnIncreasing },
  { to: "/diary", label: "Pain", icon: HeartPulse },
  { to: "/nutrition", label: "Food", icon: Utensils },
  { to: "/doctor", label: "Doctor", icon: ShieldCheck }
];

export function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <CalendarCheck aria-hidden="true" />
          <div>
            <strong>Shoulder Recovery</strong>
            <span>Rehab & fitness companion</span>
          </div>
        </div>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className="nav-link">
              <item.icon size={20} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="theme-button" type="button" aria-label="Dark mode coming soon">
          <Moon size={18} aria-hidden="true" />
          <span>Dark mode</span>
        </button>
      </aside>
      <main className="main-panel">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/exercises" element={<ExerciseLibrary />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/diary" element={<PainDiary />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/doctor" element={<Doctor />} />
        </Routes>
      </main>
    </div>
  );
}
