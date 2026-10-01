import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { sets, syncState, workouts } from "@/db/schema";
import type { HevyWorkout } from "@/server/hevy/client";

export async function upsertWorkout(workout: HevyWorkout) {
  const startTime = new Date(workout.start_time);
  const row = {
    id: workout.id,
    title: workout.title,
    startTime,
    endTime: workout.end_time ? new Date(workout.end_time) : null,
    updatedAt: new Date(workout.updated_at),
    raw: workout,
  };
  const setRows = workout.exercises.flatMap((exercise) =>
    exercise.sets.map((set) => ({
      workoutId: workout.id,
      exerciseIndex: exercise.index,
      setIndex: set.index,
      exerciseTemplateId: exercise.exercise_template_id,
      exerciseTitle: exercise.title,
      setType: set.type,
      weightKg: set.weight_kg,
      reps: set.reps,
      rpe: set.rpe,
      startTime,
    })),
  );

  await db.transaction(async (tx) => {
    await tx
      .insert(workouts)
      .values(row)
      .onConflictDoUpdate({
        target: workouts.id,
        set: { title: row.title, startTime: row.startTime, endTime: row.endTime, updatedAt: row.updatedAt, raw: row.raw },
      });
    await tx.delete(sets).where(eq(sets.workoutId, workout.id));
    if (setRows.length > 0) await tx.insert(sets).values(setRows);
  });
}

export async function deleteWorkout(id: string) {
  await db.delete(workouts).where(eq(workouts.id, id));
}

export async function setSyncState(key: string, value: string) {
  await db
    .insert(syncState)
    .values({ key, value })
    .onConflictDoUpdate({ target: syncState.key, set: { value, updatedAt: new Date() } });
}
