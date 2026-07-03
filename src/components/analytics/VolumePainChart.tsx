import { useState } from "react";
import { TrendingUp, TrendingDown, Activity, AlertCircle, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ChartDataPoint {
  date: string;
  label: string;
  volume: number; // weight * reps
  pain: number;   // 0-10 scale
}

interface VolumePainChartProps {
  data: ChartDataPoint[];
  title?: string;
  subtitle?: string;
}

export function VolumePainChart({ data, title = "Volume vs. Joint Pain Trajectory", subtitle = "Correlating mechanical workload with anterior capsule discomfort." }: VolumePainChartProps) {
  const [filter, setFilter] = useState<"all" | "30" | "7">("all");

  const filteredData = data.filter((d) => {
    if (filter === "all") return true;
    const days = filter === "30" ? 30 : 7;
    const diff = (new Date().getTime() - new Date(d.date).getTime()) / (1000 * 3600 * 24);
    return diff <= days;
  });

  const maxVolume = Math.max(...filteredData.map((d) => d.volume), 100);
  const avgPain = filteredData.length > 0
    ? (filteredData.reduce((acc, curr) => acc + curr.pain, 0) / filteredData.length).toFixed(1)
    : "0.0";
  const totalVolume = filteredData.reduce((acc, curr) => acc + curr.volume, 0);

  // SVG dimensions
  const height = 180;
  const width = 600;
  const padding = 30;

  return (
    <Card className="shadow-md border-border overflow-hidden">
      <CardHeader className="bg-secondary/20 pb-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity size={20} className="text-primary" /> {title}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>

        <div className="flex gap-1.5 bg-background p-1 rounded-xl border self-end sm:self-auto">
          {[
            { id: "7", label: "7D" },
            { id: "30", label: "30D" },
            { id: "all", label: "All" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filter === btn.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3.5 rounded-2xl border bg-secondary/10 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Total Volume Executed</span>
            <span className="text-lg font-black text-foreground">{totalVolume.toLocaleString()} kg·reps</span>
          </div>
          <div className="p-3.5 rounded-2xl border bg-secondary/10 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Average Joint Pain</span>
            <div className="flex items-center gap-1.5">
              <span className={`text-lg font-black ${Number(avgPain) <= 2 ? "text-rehab-green" : "text-rehab-amber"}`}>
                {avgPain} / 10
              </span>
              {Number(avgPain) <= 2 && <TrendingDown size={16} className="text-rehab-green" />}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl border bg-secondary/10 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Logged Sessions</span>
            <span className="text-lg font-black text-foreground">{filteredData.length}</span>
          </div>
        </div>

        {/* SVG Chart */}
        {filteredData.length >= 2 ? (
          <div className="space-y-3">
            <div className="w-full overflow-x-auto pb-2">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[220px] min-w-[500px]">
                {/* Horizontal Grid lines */}
                {[0.2, 0.5, 0.8].map((ratio, i) => (
                  <line
                    key={i}
                    x1={padding}
                    y1={height - ratio * (height - padding * 2) - padding}
                    x2={width - padding}
                    y2={height - ratio * (height - padding * 2) - padding}
                    stroke="currentColor"
                    strokeOpacity={0.08}
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Bars for Volume */}
                {filteredData.map((d, i) => {
                  const barWidth = Math.min(32, (width - padding * 2) / filteredData.length * 0.55);
                  const stepX = (width - padding * 2) / Math.max(1, filteredData.length - 1);
                  const x = padding + i * stepX - barWidth / 2;
                  const barHeight = ((d.volume / maxVolume) * (height - padding * 2));
                  const y = height - padding - barHeight;

                  return (
                    <g key={i}>
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={Math.max(4, barHeight)}
                        rx={6}
                        fill="currentColor"
                        className="text-primary/25 hover:text-primary/50 transition-colors"
                      />
                      <text
                        x={x + barWidth / 2}
                        y={height - 10}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[10px] font-mono font-bold"
                      >
                        {d.label}
                      </text>
                    </g>
                  );
                })}

                {/* Polyline for Pain */}
                <polyline
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={filteredData
                    .map((d, i) => {
                      const stepX = (width - padding * 2) / Math.max(1, filteredData.length - 1);
                      const x = padding + i * stepX;
                      const y = height - padding - (d.pain / 10) * (height - padding * 2);
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />

                {/* Dots for Pain points */}
                {filteredData.map((d, i) => {
                  const stepX = (width - padding * 2) / Math.max(1, filteredData.length - 1);
                  const x = padding + i * stepX;
                  const y = height - padding - (d.pain / 10) * (height - padding * 2);
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r={5}
                      fill="#dc2626"
                      stroke="#ffffff"
                      strokeWidth={2}
                      className="hover:scale-125 transition-transform"
                    />
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-xs font-bold pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-primary/30 inline-block" />
                <span className="text-muted-foreground">Workload Volume (kg·reps)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rehab-red inline-block border-2 border-white shadow-sm" />
                <span className="text-muted-foreground">Joint Pain Rating (0–10)</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center border rounded-2xl bg-secondary/10 space-y-2">
            <AlertCircle size={32} className="mx-auto text-muted-foreground" />
            <p className="font-bold text-sm text-foreground">Not Enough Longitudinal Data Yet</p>
            <p className="text-xs text-muted-foreground">
              Complete at least 2 workout sessions to generate customized volume vs. pain correlation graphs.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
