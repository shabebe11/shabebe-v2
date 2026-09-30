import { doublePrecision, index, integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { workouts } from "./workouts.schema";

export const sets = pgTable(
  "sets",
  {
    workoutId: text("workout_id")
      .notNull()
      .references(() => workouts.id, { onDelete: "cascade" }),
    exerciseIndex: integer("exercise_index").notNull(),
    setIndex: integer("set_index").notNull(),
    exerciseTemplateId: text("exercise_template_id").notNull(),
    exerciseTitle: text("exercise_title").notNull(),
    setType: text("set_type").notNull(),
    weightKg: doublePrecision("weight_kg"),
    reps: integer("reps"),
    rpe: doublePrecision("rpe"),
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.workoutId, t.exerciseIndex, t.setIndex] }),
    index("sets_template_time_idx").on(t.exerciseTemplateId, t.startTime),
  ],
).enableRLS();
