import { unstable_cache } from "next/cache";
import {
  getBestLifts,
  getLifetimeStats,
  getPrTimeline,
  getRecentWorkouts,
  getTrainingDays,
} from "@/server/supabase/queries";

const BIG_THREE = {
  squat: "Squat (Barbell)",
  bench: "Bench Press (Barbell)",
  deadlift: "Deadlift (Barbell)",
} as const;
type Lift = keyof typeof BIG_THREE;

const HEVY = { tags: ["hevy"], revalidate: false as const };
const LIFTS = Object.keys(BIG_THREE) as Lift[];
const TITLES = LIFTS.map((lift) => BIG_THREE[lift]);

function liftFor(title: string) {
  return LIFTS.find((lift) => BIG_THREE[lift] === title) ?? null;
}

export const getBigThree = unstable_cache(
  async () => {
    const rows = await getBestLifts(TITLES).catch((error) => {
      console.error("getBigThree failed:", error);
      return [];
    });
    const best = Object.fromEntries(
      LIFTS.map((lift) => [lift, rows.find((row) => row.title === BIG_THREE[lift])?.kg ?? null]),
    ) as Record<Lift, number | null>;
    const total = LIFTS.every((lift) => best[lift] !== null)
      ? LIFTS.reduce((sum, lift) => sum + (best[lift] ?? 0), 0)
      : null;
    return { ...best, total };
  },
  ["big-three"],
  HEVY,
);

export const getPrHistory = unstable_cache(
  async () => {
    const rows = await getPrTimeline(TITLES);
    return rows.map((row) => ({
      lift: liftFor(row.title),
      date: row.startTime.toISOString(),
      weightKg: row.weightKg,
      reps: row.reps,
    }));
  },
  ["pr-history"],
  HEVY,
);

export const getWorkoutHistory = unstable_cache(
  async (limit: number) => {
    const rows = await getRecentWorkouts(limit);
    return rows.map((row) => ({
      ...row,
      startTime: row.startTime.toISOString(),
      endTime: row.endTime?.toISOString() ?? null,
    }));
  },
  ["workout-history"],
  HEVY,
);

export const getTrainingHeatmap = unstable_cache(
  async () => {
    const since = new Date();
    since.setFullYear(since.getFullYear() - 1);
    return getTrainingDays(since);
  },
  ["training-heatmap"],
  HEVY,
);

export const getTrainingTotals = unstable_cache(async () => getLifetimeStats(), ["training-totals"], HEVY);
