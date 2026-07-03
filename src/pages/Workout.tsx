import { CheckCircle2 } from "lucide-react";
import { exercises } from "../data/exercises";
import { todaysWorkout } from "../data/workout";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { SafetyBadge } from "../components/SafetyBadge";

export function Workout() {
  const [done, setDone] = useLocalStorage<string[]>("workout-completed", []);
  const toggle = (id: string) =>
    setDone((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]));

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Monday session</p>
          <h1>Daily Workout</h1>
        </div>
        <div className="status-pill">{done.length}/{todaysWorkout.length} complete</div>
      </header>

      <div className="workout-list">
        {todaysWorkout.map((item) => {
          const exercise = exercises.find((entry) => entry.id === item.exerciseId);
          if (!exercise) return null;
          return (
            <article key={item.exerciseId} className="workout-card">
              <button
                className={`complete-button ${done.includes(item.exerciseId) ? "checked" : ""}`}
                type="button"
                onClick={() => toggle(item.exerciseId)}
                aria-label={`Mark ${exercise.name} complete`}
              >
                <CheckCircle2 size={24} aria-hidden="true" />
              </button>
              <div className="workout-main">
                <div className="section-title">
                  <div>
                    <h2>{exercise.name}</h2>
                    <p>{exercise.purpose}</p>
                  </div>
                  <SafetyBadge level={exercise.safety} />
                </div>
                <div className="tracking-grid">
                  <label>Sets<input defaultValue={item.sets ?? ""} inputMode="numeric" /></label>
                  <label>Reps<input defaultValue={item.reps ?? ""} /></label>
                  <label>RPE<input placeholder="6" inputMode="numeric" /></label>
                  <label>Pain<input placeholder="0-10" inputMode="numeric" /></label>
                </div>
                <textarea placeholder="Notes, instability, clicking, or form reminders" />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
