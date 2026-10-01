import { and, count, desc, eq, gte, inArray, lte, max, ne, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { sets, syncState, workouts } from "@/db/schema";

const workingSet = and(ne(sets.setType, "warmup"), gte(sets.reps, 1));

export async function getSyncState(key: string) {
  const [row] = await db.select({ value: syncState.value }).from(syncState).where(eq(syncState.key, key));
  return row?.value ?? null;
}

export async function getBestLifts(titles: string[]) {
  return db
    .select({ title: sets.exerciseTitle, kg: max(sets.weightKg) })
    .from(sets)
    .where(and(inArray(sets.exerciseTitle, titles), workingSet))
    .groupBy(sets.exerciseTitle);
}

export async function getPrTimeline(titles: string[]) {
  const ranked = db
    .select({
      title: sets.exerciseTitle,
      startTime: sets.startTime,
      weightKg: sets.weightKg,
      reps: sets.reps,
      previousBest: sql<number | null>`max(${sets.weightKg}) over (
        partition by ${sets.exerciseTitle}
        order by ${sets.startTime}, ${sets.weightKg}
        rows between unbounded preceding and 1 preceding
      )`.as("previous_best"),
    })
    .from(sets)
    .where(and(inArray(sets.exerciseTitle, titles), workingSet))
    .as("ranked");

  return db
    .select({ title: ranked.title, startTime: ranked.startTime, weightKg: ranked.weightKg, reps: ranked.reps })
    .from(ranked)
    .where(sql`${ranked.weightKg} > coalesce(${ranked.previousBest}, 0)`)
    .orderBy(ranked.title, ranked.startTime);
}

export async function getRecentWorkouts(limit: number) {
  return db
    .select({
      id: workouts.id,
      title: workouts.title,
      startTime: workouts.startTime,
      endTime: workouts.endTime,
      raw: workouts.raw,
      setCount: count(sets.setIndex),
      volumeKg: sql<number>`coalesce(sum(${sets.weightKg} * ${sets.reps}), 0)`.mapWith(Number),
    })
    .from(workouts)
    .leftJoin(sets, eq(sets.workoutId, workouts.id))
    .groupBy(workouts.id)
    .orderBy(desc(workouts.startTime))
    .limit(limit);
}

export async function getTrainingDays(since: Date) {
  const day = sql<string>`to_char(${workouts.startTime} at time zone 'Pacific/Auckland', 'YYYY-MM-DD')`;
  return db
    .select({
      day,
      workouts: sql<number>`count(distinct ${workouts.id})`.mapWith(Number),
      sets: count(sets.setIndex),
    })
    .from(workouts)
    .leftJoin(sets, eq(sets.workoutId, workouts.id))
    .where(gte(workouts.startTime, since))
    .groupBy(day)
    .orderBy(day);
}

export async function getE1rmTrend(titles: string[]) {
  const e1rm = sql<number>`case when ${sets.reps} = 1 then ${sets.weightKg} else ${sets.weightKg} * (1 + ${sets.reps}::float / 30) end`;
  return db
    .select({
      title: sets.exerciseTitle,
      startTime: sets.startTime,
      e1rm: sql<number>`max(${e1rm})`.mapWith(Number),
    })
    .from(sets)
    .where(and(inArray(sets.exerciseTitle, titles), workingSet, lte(sets.reps, 10)))
    .groupBy(sets.exerciseTitle, sets.startTime)
    .orderBy(sets.startTime);
}

export async function getLifetimeStats() {
  const [totals] = await db
    .select({
      workouts: sql<number>`count(distinct ${sets.workoutId})`.mapWith(Number),
      sets: count(),
      volumeKg: sql<number>`coalesce(sum(${sets.weightKg} * ${sets.reps}), 0)`.mapWith(Number),
    })
    .from(sets)
    .where(ne(sets.setType, "warmup"));
  return totals;
}
