import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
};

export function MetricCard({ label, value, helper, icon: Icon }: MetricCardProps) {
  return (
    <article className="metric-card">
      <Icon size={20} aria-hidden="true" />
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{helper}</small>
      </div>
    </article>
  );
}
