import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { day: "Mon", pain: 3, sleep: 7, protein: 95, water: 1.8 },
  { day: "Tue", pain: 2, sleep: 7.5, protein: 118, water: 2.1 },
  { day: "Wed", pain: 2, sleep: 8, protein: 124, water: 2.4 },
  { day: "Thu", pain: 1, sleep: 7, protein: 130, water: 2.3 },
  { day: "Fri", pain: 2, sleep: 7.5, protein: 126, water: 2.5 }
];

export function Progress() {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Trends over time</p>
          <h1>Progress</h1>
        </div>
      </header>

      <section className="panel chart-panel">
        <div className="section-title">
          <h2>Pain and sleep</h2>
          <span>weekly view</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="pain" stroke="#dc2626" strokeWidth={3} />
            <Line type="monotone" dataKey="sleep" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <div className="content-grid two">
        <article className="panel"><h2>Body measurements</h2><p>Weight, waist, chest, hip, neck, arm, thigh, calf, and progress photos will live here.</p></article>
        <article className="panel"><h2>Export</h2><p>CSV, JSON, PDF, backup, and restore controls are planned for physician visits and device changes.</p></article>
      </div>
    </section>
  );
}
