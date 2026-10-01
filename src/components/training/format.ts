export const LIFT_LABEL = { squat: "Squat", bench: "Bench", deadlift: "Deadlift" } as const;
export const LIFT_ORDER = ["squat", "bench", "deadlift"] as const;
export const LIFT_STRIP = { squat: "bg-squat", bench: "bg-bench", deadlift: "bg-deadlift" } as const;
export const LIFT_CHART_COLOUR = { squat: "#E24B4A", bench: "#378ADD", deadlift: "#C77D12" } as const;

const TZ = "Pacific/Auckland";
const dayFormat = new Intl.DateTimeFormat("en-NZ", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" });
const shortFormat = new Intl.DateTimeFormat("en-NZ", { timeZone: TZ, day: "numeric", month: "short" });
const monthFormat = new Intl.DateTimeFormat("en-NZ", { timeZone: TZ, month: "long", year: "numeric" });
const keyFormat = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });

export function kg(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return Number.isInteger(value) ? String(value) : value.toFixed(value * 10 === Math.round(value * 10) ? 1 : 2);
}

const kgFormat = new Intl.NumberFormat("en-NZ", { maximumFractionDigits: 0 });

export function volume(valueKg: number) {
  return `${kgFormat.format(valueKg)} kg`;
}

export function dayLabel(iso: string) {
  return dayFormat.format(new Date(iso));
}

export function shortDate(iso: string) {
  return shortFormat.format(new Date(iso));
}

export function monthLabel(iso: string) {
  return monthFormat.format(new Date(iso));
}

export function dateKey(date: Date) {
  return keyFormat.format(date);
}

export function minutesBetween(start: string, end: string | null) {
  if (!end) return null;
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
}

type SetLike = { weightKg: number | null; reps: number | null; durationSeconds: number | null };

function describe(set: SetLike) {
  const load = set.weightKg === null ? "" : `${kg(set.weightKg)}`;
  if (set.durationSeconds !== null) return load ? `${load} kg · ${set.durationSeconds}s` : `${set.durationSeconds}s`;
  return load ? `${load} × ${set.reps}` : `${set.reps} reps`;
}

export function summariseSets(sets: SetLike[]) {
  const groups: { text: string; count: number }[] = [];
  for (const set of sets) {
    const text = describe(set);
    const last = groups.at(-1);
    if (last && last.text === text) last.count++;
    else groups.push({ text, count: 1 });
  }
  return groups.map(({ text, count }) => (count > 1 ? `${text} × ${count}` : text));
}
