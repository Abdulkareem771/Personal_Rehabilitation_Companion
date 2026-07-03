const timeline = [
  "January 2024 · First seizure",
  "Fracture dislocations",
  "MRI and CT imaging",
  "Physiotherapy",
  "More seizures",
  "Keppra",
  "Keppra + Tegretol",
  "February 2026 · Last seizure",
  "Phase 1 rehabilitation"
];

export function Doctor() {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Medical reference</p>
          <h1>Doctor Page</h1>
        </div>
      </header>
      <div className="content-grid two">
        <article className="panel">
          <h2>Medical history</h2>
          <p>Bilateral anterior shoulder instability, Bankart lesion, seizure-related traumatic dislocations, overhead loading avoided.</p>
        </article>
        <article className="panel">
          <h2>Questions</h2>
          <ul>
            <li>What movement ranges are safe right now?</li>
            <li>What symptoms require stopping rehab?</li>
            <li>When can gym loading progress?</li>
          </ul>
        </article>
      </div>
      <article className="panel">
        <h2>Timeline</h2>
        <ol className="timeline">
          {timeline.map((item) => <li key={item}>{item}</li>)}
        </ol>
      </article>
    </section>
  );
}
