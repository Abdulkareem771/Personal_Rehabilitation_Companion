import { useState } from "react";
import { Info } from "lucide-react";
import { exercises } from "../data/exercises";
import { SafetyBadge } from "../components/SafetyBadge";

export function ExerciseLibrary() {
  const [openId, setOpenId] = useState(exercises[0]?.id);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Safe movement database</p>
          <h1>Exercise Library</h1>
        </div>
      </header>

      <div className="library-grid">
        {exercises.map((exercise) => (
          <article className="exercise-card" key={exercise.id}>
            <div className="exercise-art" aria-hidden="true">
              <span>{exercise.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}</span>
            </div>
            <div className="section-title">
              <div>
                <h2>{exercise.name}</h2>
                <p>{exercise.purpose}</p>
              </div>
              <SafetyBadge level={exercise.safety} />
            </div>
            <div className="tag-row">
              {exercise.muscles.map((muscle) => <span key={muscle}>{muscle}</span>)}
            </div>
            <button className="why-button" type="button" onClick={() => setOpenId(openId === exercise.id ? "" : exercise.id)}>
              <Info size={18} aria-hidden="true" />
              Why this exercise?
            </button>
            {openId === exercise.id && (
              <div className="why-panel">
                <strong>Why you need it</strong>
                <p>{exercise.whyYouNeedIt}</p>
                <strong>Engineering analogy</strong>
                <p>{exercise.engineeringAnalogy}</p>
                <strong>Rules</strong>
                <ul>
                  {exercise.instructions.map((step) => <li key={step}>{step}</li>)}
                </ul>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
