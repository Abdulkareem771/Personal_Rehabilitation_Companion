export function Nutrition() {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Recovery fuel</p>
          <h1>Nutrition</h1>
        </div>
      </header>
      <div className="content-grid two">
        <article className="panel">
          <h2>Protein tracker</h2>
          <div className="macro-bar"><span style={{ width: "63%" }} /></div>
          <p>82 g logged from a 130 g daily target.</p>
        </article>
        <article className="panel">
          <h2>Daily checklist</h2>
          <div className="checklist">
            {["Breakfast protein", "Vegetables", "2.5 L water", "Creatine optional", "No skipped dinner"].map((item) => (
              <label key={item} className="check-row"><input type="checkbox" /><span>{item}</span></label>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
