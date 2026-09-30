CREATE TABLE "workouts" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone,
	"updated_at" timestamp with time zone NOT NULL,
	"raw" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workouts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sets" (
	"workout_id" text NOT NULL,
	"exercise_index" integer NOT NULL,
	"set_index" integer NOT NULL,
	"exercise_template_id" text NOT NULL,
	"exercise_title" text NOT NULL,
	"set_type" text NOT NULL,
	"weight_kg" double precision,
	"reps" integer,
	"rpe" double precision,
	"start_time" timestamp with time zone NOT NULL,
	CONSTRAINT "sets_workout_id_exercise_index_set_index_pk" PRIMARY KEY("workout_id","exercise_index","set_index")
);
--> statement-breakpoint
ALTER TABLE "sets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sets" ADD CONSTRAINT "sets_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workouts_start_time_idx" ON "workouts" USING btree ("start_time");--> statement-breakpoint
CREATE INDEX "sets_template_time_idx" ON "sets" USING btree ("exercise_template_id","start_time");