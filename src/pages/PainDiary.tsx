import type { FormEvent } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type Entry = {
  date: string;
  pain: string;
  instability: string;
  shoulder: string;
  trigger: string;
  notes: string;
};

export function PainDiary() {
  const [entries, setEntries] = useLocalStorage<Entry[]>("pain-diary", []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const entry = Object.fromEntries(new FormData(event.currentTarget)) as Entry;
    setEntries((current) => [{ ...entry, date: new Date().toISOString().slice(0, 10) }, ...current]);
    event.currentTarget.reset();
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Evening check-in</p>
          <h1>Pain Diary</h1>
        </div>
      </header>

      <form className="panel form-panel" onSubmit={submit}>
        <label>Pain today<input name="pain" type="number" min="0" max="10" defaultValue="2" /></label>
        <label>Instability<select name="instability"><option>None</option><option>Clicking</option><option>Subluxation</option><option>Dislocation</option></select></label>
        <label>Which shoulder?<select name="shoulder"><option>Both stable</option><option>Left</option><option>Right</option><option>Both</option></select></label>
        <label>Trigger<input name="trigger" placeholder="Exercise, sleep, posture, sudden movement" /></label>
        <label className="full">Comments<textarea name="notes" placeholder="What happened, what helped, what to avoid tomorrow" /></label>
        <button className="primary-button" type="submit">Save diary entry</button>
      </form>

      <div className="stack">
        {entries.map((entry, index) => (
          <article className="panel" key={`${entry.date}-${index}`}>
            <div className="section-title"><h2>{entry.date}</h2><span>Pain {entry.pain}/10</span></div>
            <p>{entry.instability} · {entry.shoulder} · {entry.trigger}</p>
            <p>{entry.notes}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
