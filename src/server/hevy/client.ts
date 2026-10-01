export type HevySet = {
  index: number;
  type: "normal" | "warmup" | "dropset" | "failure";
  weight_kg: number | null;
  reps: number | null;
  distance_meters: number | null;
  duration_seconds: number | null;
  rpe: number | null;
  custom_metric: number | null;
};

export type HevyExercise = {
  index: number;
  title: string;
  notes: string;
  exercise_template_id: string;
  superset_id: number | null;
  sets: HevySet[];
};

export type HevyWorkout = {
  id: string;
  title: string;
  description: string;
  routine_id?: string;
  start_time: string;
  end_time: string;
  updated_at: string;
  created_at: string;
  exercises: HevyExercise[];
};

export type HevyWorkoutEvent =
  | { type: "updated"; workout: HevyWorkout }
  | { type: "deleted"; id: string; deleted_at: string };

type Page<K extends string, T> = { page: number; page_count: number } & Record<K, T[]>;

const BASE_URL = "https://api.hevyapp.com/v1";
const PAGE_SIZE = 10;

async function hevy<T>(path: string, params: Record<string, string | number>): Promise<T> {
  const key = process.env.HEVY_API_KEY;
  if (!key) throw new Error("HEVY_API_KEY is not set");

  const url = new URL(`${BASE_URL}${path}`);
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, String(value));

  const res = await fetch(url, { headers: { "api-key": key }, cache: "no-store" });
  if (!res.ok) throw new Error(`Hevy ${path} failed with ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

async function* paginate<K extends string, T>(path: string, key: K, params: Record<string, string | number> = {}) {
  let page = 1;
  let pageCount = 1;
  while (page <= pageCount) {
    const data = await hevy<Page<K, T>>(path, { ...params, page, pageSize: PAGE_SIZE });
    yield* data[key];
    pageCount = data.page_count;
    page++;
  }
}

export function allWorkouts() {
  return paginate<"workouts", HevyWorkout>("/workouts", "workouts");
}

export function workoutEventsSince(since: string) {
  return paginate<"events", HevyWorkoutEvent>("/workouts/events", "events", { since });
}
