import Link from "next/link";
import {
  dateKey,
  dayLabel,
  kg,
  LIFT_LABEL,
  LIFT_ORDER,
  minutesBetween,
  shortDate,
  summariseSets,
  volume,
} from "@/components/training/format";
import { PRS } from "@/content/prs";
import { getLastSyncedAt, getTrainingTotals, getWorkoutHistory } from "@/server/hevy/actions";

export const revalidate = 3600;

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function currentWeek() {
  const today = new Date(`${dateKey(new Date())}T00:00:00Z`);
  const monday = new Date(today);
  monday.setUTCDate(today.getUTCDate() - ((today.getUTCDay() + 6) % 7));
  return WEEKDAYS.map((label, i) => {
    const day = new Date(monday);
    day.setUTCDate(monday.getUTCDate() + i);
    return { label, key: day.toISOString().slice(0, 10), future: day > today, today: day.getTime() === today.getTime() };
  });
}

function bestFor(lift: (typeof LIFT_ORDER)[number]) {
  return PRS.filter((pr) => pr.lift === lift).sort((a, b) => b.kg - a.kg || a.reps - b.reps)[0] ?? null;
}

export default async function LatestPage() {
  const [sessions, totals, syncedAt] = await Promise.all([
    getWorkoutHistory(500),
    getTrainingTotals(),
    getLastSyncedAt(),
  ]);
  const [last, ...earlier] = sessions;

  const week = currentWeek();
  const thisWeek = sessions.filter((s) => week.some((d) => d.key === dateKey(new Date(s.startTime))));
  const trained = new Set(thisWeek.map((s) => dateKey(new Date(s.startTime))));
  const weekSets = thisWeek.reduce((sum, s) => sum + s.setCount, 0);
  const weekVolume = thisWeek.reduce((sum, s) => sum + s.volumeKg, 0);

  const bests = LIFT_ORDER.map((lift) => ({ lift, pr: bestFor(lift) }));
  const total = bests.every((b) => b.pr) ? bests.reduce((sum, b) => sum + b.pr!.kg, 0) : null;

  return (
    <>
      <h1 className="font-display text-6xl font-medium text-chalk">Latest</h1>
      <p className="mt-3 text-sm text-faint">
        {syncedAt ? `synced from hevy · ${shortDate(syncedAt)}` : ""}
      </p>

      <div className="mt-10 grid gap-3 lg:grid-cols-[1fr_20rem]">
        <section className="relative border border-line p-6">
          <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-chalk/40" />
          <p className="text-xs text-faint">last session</p>
          {last ? (
            <>
              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="font-display text-5xl font-medium text-chalk">{last.title}</h2>
                <span className="text-sm text-muted">{dayLabel(last.startTime)}</span>
              </div>
              <dl className="mt-5 grid grid-cols-3 border-y border-line">
                {[
                  { label: "duration", value: `${minutesBetween(last.startTime, last.endTime) ?? "—"} min` },
                  { label: "sets", value: String(last.setCount) },
                  { label: "volume", value: volume(last.volumeKg) },
                ].map((stat, i) => (
                  <div key={stat.label} className={`py-3 ${i ? "border-l border-line pl-4" : ""}`}>
                    <dt className="text-xs text-faint">{stat.label}</dt>
                    <dd className="mt-1 font-display text-2xl font-medium text-chalk">{stat.value}</dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-5 space-y-3">
                {last.exercises.map((exercise, i) => (
                  <li key={`${exercise.title}${i}`} className="grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-6">
                    <span className="text-sm text-muted">{exercise.title}</span>
                    <span className="text-xs text-faint sm:text-right">{summariseSets(exercise.sets).join(" · ")}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-3 text-sm text-faint">No sessions logged yet.</p>
          )}
        </section>

        <div className="grid content-start gap-3">
          <section className="border border-line p-5">
            <p className="text-xs text-faint">this week</p>
            <ol className="mt-4 grid grid-cols-7 gap-1 text-center">
              {week.map((day) => (
                <li key={day.key} className="flex flex-col items-center gap-2">
                  <span
                    aria-hidden
                    className={`size-4 rounded-full border-[1.5px] ${
                      trained.has(day.key)
                        ? "border-chalk bg-chalk"
                        : day.future
                          ? "border-line"
                          : "border-faint"
                    }`}
                  />
                  <span className={`text-[11px] ${day.today ? "text-chalk" : "text-faint"}`}>{day.label}</span>
                  <span className="sr-only">{trained.has(day.key) ? "trained" : "no session"}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 border-t border-line pt-3 text-xs text-muted">
              {thisWeek.length
                ? `${thisWeek.length} ${thisWeek.length === 1 ? "session" : "sessions"} · ${weekSets} sets · ${volume(weekVolume)}`
                : last
                  ? `no session this week`
                  : "nothing logged yet"}
            </p>
          </section>

          <section className="border border-line p-5">
            <div className="flex items-baseline justify-between">
              <p className="text-xs text-faint">current bests</p>
              <Link href="/trainingLog/history" className="text-xs text-faint transition-colors hover:text-chalk">
                all PRs →
              </Link>
            </div>
            <dl className="mt-3">
              {bests.map(({ lift, pr }) => (
                <div key={lift} className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-b border-line py-2">
                  <dt className="text-sm text-muted">{LIFT_LABEL[lift]}</dt>
                  <dd className="font-display text-2xl font-medium text-chalk">
                    {pr ? kg(pr.kg) : "—"}
                    {pr && (
                      <span className="ml-1 font-mono text-xs text-faint">
                        kg{pr.reps > 1 ? ` × ${pr.reps}` : ""}
                      </span>
                    )}
                  </dd>
                  {pr && (
                    <dd className="col-start-1 text-[11px] text-faint">{shortDate(`${pr.date}T12:00:00+12:00`)}</dd>
                  )}
                </div>
              ))}
              <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 pt-2">
                <dt className="text-sm text-muted">Total</dt>
                <dd className="font-display text-2xl font-medium text-chalk">
                  {kg(total)}
                  {total !== null && <span className="ml-1 font-mono text-xs text-faint">kg</span>}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </>
  )
}