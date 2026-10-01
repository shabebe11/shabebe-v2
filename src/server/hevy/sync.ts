import { deleteWorkout, setSyncState, upsertWorkout } from "@/server/supabase/mutations";
import { getSyncState } from "@/server/supabase/queries";
import { allWorkouts, workoutEventsSince, type HevyWorkoutEvent } from "./client";

const LAST_SYNCED_AT = "last_synced_at";

export async function syncHevy() {
  const startedAt = new Date().toISOString();
  const since = await getSyncState(LAST_SYNCED_AT);
  let updated = 0;
  let deleted = 0;

  if (!since) {
    for await (const workout of allWorkouts()) {
      await upsertWorkout(workout);
      updated++;
    }
  } else {
    const latest = new Map<string, HevyWorkoutEvent>();
    for await (const event of workoutEventsSince(since)) {
      const id = event.type === "deleted" ? event.id : event.workout.id;
      if (!latest.has(id)) latest.set(id, event);
    }
    for (const event of latest.values()) {
      if (event.type === "deleted") {
        await deleteWorkout(event.id);
        deleted++;
      } else {
        await upsertWorkout(event.workout);
        updated++;
      }
    }
  }

  await setSyncState(LAST_SYNCED_AT, startedAt);
  return { mode: since ? "incremental" : "backfill", since, startedAt, updated, deleted };
}
