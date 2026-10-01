export type Pr = {
  lift: "squat" | "bench" | "deadlift";
  kg: number;
  reps: number;
  date: string;
  note?: string;
};

export const PRS: Pr[] = [
  { lift: "bench", kg: 92.5, reps: 1, date: "2026-07-14", note: "No straps, clean bar path" },
  { lift: "bench", kg: 100, reps: 1, date: "2026-07-24" },
  { lift: "squat", kg: 70, reps: 6, date: "2026-08-21" },
  { lift: "deadlift", kg: 90, reps: 4, date: "2026-08-23" },
  { lift: "squat", kg: 75, reps: 6, date: "2026-08-28" },
  { lift: "deadlift", kg: 97.5, reps: 4, date: "2026-08-30" },
  { lift: "deadlift", kg: 100, reps: 4, date: "2026-09-05" },
  { lift: "deadlift", kg: 105, reps: 4, date: "2026-09-10" },
  { lift: "deadlift", kg: 110, reps: 4, date: "2026-09-17" },
  { lift: "deadlift", kg: 120, reps: 4, date: "2026-09-24" },
];
