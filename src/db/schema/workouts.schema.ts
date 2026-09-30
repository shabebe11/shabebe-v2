import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const workouts = pgTable(
  "workouts",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
    raw: jsonb("raw").notNull(),
  },
  (t) => [index("workouts_start_time_idx").on(t.startTime)],
).enableRLS();
