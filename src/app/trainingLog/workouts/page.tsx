import { TrainingHeatmap, type HeatmapCell } from "@/components/training/TrainingHeatmap";
import { dateKey, dayLabel, minutesBetween, monthLabel, summariseSets, volume } from "@/components/training/format";
import { getTrainingHeatmap, getWorkoutHistory } from "@/server/hevy/actions";

const cellLabel = new Intl.DateTimeFormat("en-NZ", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const monthTick = new Intl.DateTimeFormat("en-NZ", { month: "short", timeZone: "UTC" });

function buildCalendar(days: { day: string; workouts: number; sets: number }[]) {
  const byDay = new Map(days.map((d) => [d.day, d]));
  const today = new Date(`${dateKey(new Date())}T00:00:00Z`);
  const end = new Date(today);
  end.setUTCDate(end.getUTCDate() + (6 - ((today.getUTCDay() + 6) % 7)));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 7 * 53 + 1);

  const weeks: HeatmapCell[][] = [];
  const months: { column: number; label: string }[] = [];
  for (let column = 0, cursor = new Date(start); cursor <= end; column++) {
    const week: HeatmapCell[] = [];
    for (let row = 0; row < 7; row++, cursor.setUTCDate(cursor.getUTCDate() + 1)) {
      if (cursor > today) {
        week.push(null);
        continue;
      }
      const key = cursor.toISOString().slice(0, 10);
      if (cursor.getUTCDate() === 1 && column > 0) months.push({ column, label: monthTick.format(cursor) });
      const day = byDay.get(key);
      week.push({ key, label: cellLabel.format(cursor), workouts: day?.workouts ?? 0, sets: day?.sets ?? 0 });
    }
    weeks.push(week);
  }
  return { weeks, months };
}

export default async function WorkoutsPage() {
  const [days, sessions] = await Promise.all([getTrainingHeatmap(), getWorkoutHistory(500)]);
  const { weeks, months } = buildCalendar(days);

  const byMonth = new Map<string, typeof sessions>();
  for (const session of sessions) {
    const month = monthLabel(session.startTime);
    byMonth.set(month, [...(byMonth.get(month) ?? []), session]);
  }

  return (
    <>
      <h1 className="font-display text-6xl font-medium text-chalk">Workouts</h1>
      <p className="mt-3 text-sm text-faint">
        {sessions.length} sessions
      </p>

      <section className="mt-10 border border-line p-5">
        <TrainingHeatmap weeks={weeks} months={months} />
      </section>

      <div className="mt-12 space-y-10">
        {sessions.length === 0 && <p className="border-t border-line pt-4 text-sm text-faint">No sessions yet.</p>}
        {[...byMonth].map(([month, list]) => (
          <section key={month}>
            <h2 className="flex items-baseline justify-between text-sm text-muted">
              {month}
              <span className="text-xs text-faint">{list.length} sessions</span>
            </h2>
            <ul className="mt-3 border-t border-line">
              {list.map((session) => (
                <li key={session.id} className="border-b border-line">
                  <details className="group">
                    <summary className="grid cursor-pointer list-none grid-cols-[6.5rem_1fr_auto] items-baseline gap-4 py-3 outline-none [&::-webkit-details-marker]:hidden">
                      <span className="text-xs text-faint">{dayLabel(session.startTime)}</span>
                      <span className="font-display text-xl font-medium text-muted transition-colors group-open:text-chalk group-hover:text-chalk">
                        {session.title}
                      </span>
                      <span className="flex items-center gap-4 text-xs text-faint">
                        <span className="hidden sm:inline">{session.setCount} sets</span>
                        <span className="hidden sm:inline">{volume(session.volumeKg)}</span>
                        <span className="hidden md:inline">
                          {minutesBetween(session.startTime, session.endTime) ?? "—"} min
                        </span>
                        <span aria-hidden className="transition-transform group-open:rotate-45">+</span>
                      </span>
                    </summary>
                    <ul className="space-y-2 pb-4 pl-[7.5rem]">
                      {session.exercises.map((exercise, i) => (
                        <li key={`${exercise.title}${i}`} className="grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-4">
                          <span className="text-sm text-muted">{exercise.title}</span>
                          <span className="text-xs text-faint sm:text-right">{summariseSets(exercise.sets).join(" · ")}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
