import { Droplets, Moon, Smile, Target, TrendingUp, Utensils } from "lucide-react";
import { dailyChecklist, todaysWorkout } from "../data/workout";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { MetricCard } from "../components/MetricCard";

export function Dashboard() {
  const [completed, setCompleted] = useLocalStorage<string[]>("daily-checklist", []);
  const toggle = (item: string) =>
    setCompleted((current) => (current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]));

  const progress = Math.round((completed.length / dailyChecklist.length) * 100);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Week 1 · Phase 1 stabilization</p>
          <h1>Good morning Abdulkareem</h1>
        </div>
        <div className="status-pill">Current streak · 1 day</div>
      </header>

      <div className="dashboard-grid">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Today’s plan</p>
            <h2>Control first, strength second.</h2>
            <p>
              Keep every shoulder exercise smooth, pain-aware, and below unstable ranges. Stop if pain rises above
              3/10 or you feel slipping.
            </p>
          </div>
          <div className="progress-ring" aria-label={`${progress}% complete`}>
            <strong>{progress}%</strong>
            <span>complete</span>
          </div>
        </section>

        <div className="metrics-grid">
          <MetricCard icon={Droplets} label="Water" value="1.2 / 2.5 L" helper="steady hydration" />
          <MetricCard icon={Utensils} label="Protein" value="82 / 130 g" helper="muscle target" />
          <MetricCard icon={TrendingUp} label="Pain" value="2 / 10" helper="acceptable" />
          <MetricCard icon={Target} label="Stability" value="7 / 10" helper="no slipping today" />
          <MetricCard icon={Moon} label="Sleep" value="7.5 h" helper="recovery support" />
          <MetricCard icon={Smile} label="Mood" value="Good" helper="ready to train" />
        </div>
      </div>

      <section className="content-grid two">
        <article className="panel">
          <div className="section-title">
            <h2>Daily checklist</h2>
            <span>{completed.length}/{dailyChecklist.length}</span>
          </div>
          <div className="checklist">
            {dailyChecklist.map((item) => (
              <label key={item} className="check-row">
                <input type="checkbox" checked={completed.includes(item)} onChange={() => toggle(item)} />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-title">
            <h2>Workout preview</h2>
            <span>{todaysWorkout.length} exercises</span>
          </div>
          <div className="stack">
            {todaysWorkout.map((exercise, index) => (
              <div className="compact-row" key={exercise.exerciseId}>
                <span>{index + 1}</span>
                <div>
                  <strong>{exercise.sets} x {exercise.reps}</strong>
                  <small>{exercise.target}</small>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
