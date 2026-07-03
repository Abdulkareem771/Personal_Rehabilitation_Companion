import { format, parseISO, differenceInCalendarDays, isToday, isYesterday } from "date-fns";

/** Format ISO date string for display. */
export function formatDate(iso: string, fmt = "dd MMM yyyy"): string {
  try { return format(parseISO(iso), fmt); }
  catch { return iso; }
}

/** Relative label: "Today", "Yesterday", or formatted date. */
export function relativeDate(iso: string): string {
  try {
    const d = parseISO(iso);
    if (isToday(d))     return "Today";
    if (isYesterday(d)) return "Yesterday";
    return format(d, "dd MMM");
  } catch { return iso; }
}

/** Greeting based on current hour. */
export function greeting(name: string): string {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${name}`;
  if (h < 17) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

/** Format kg/lbs based on user units. */
export function formatWeight(kg: number, units: "metric" | "imperial"): string {
  if (units === "imperial") return `${(kg * 2.2046).toFixed(1)} lbs`;
  return `${kg} kg`;
}

/** Format cm/inches. */
export function formatLength(cm: number, units: "metric" | "imperial"): string {
  if (units === "imperial") return `${(cm / 2.54).toFixed(1)} in`;
  return `${cm} cm`;
}

/** Days since an ISO date string. */
export function daysSince(iso: string): number {
  try { return differenceInCalendarDays(new Date(), parseISO(iso)); }
  catch { return 0; }
}

/** Short duration label, e.g. "45 min". */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

/** Rest seconds as "1:30". */
export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
