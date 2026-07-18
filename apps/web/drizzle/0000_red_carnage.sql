CREATE TABLE "personas" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"industry" text DEFAULT 'telecom' NOT NULL,
	"difficulty" text DEFAULT 'beginner' NOT NULL,
	"emoji" text DEFAULT '👤',
	"description" text NOT NULL,
	"backstory" text NOT NULL,
	"hidden_objective" text NOT NULL,
	"mood" text DEFAULT 'neutral' NOT NULL,
	"urgency" integer DEFAULT 5 NOT NULL,
	"technical_knowledge" integer DEFAULT 5 NOT NULL,
	"patience_level" integer DEFAULT 5 NOT NULL,
	"personality_traits" jsonb DEFAULT '{"agreeableness":50,"patience":50,"trust":50,"stress":50,"empathy":50,"assertiveness":50}'::jsonb NOT NULL,
	"is_prebuilt" text DEFAULT 'false' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "simulations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"persona_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"transcript" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"emotion_timeline" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"qa_score" real,
	"started_at" timestamp,
	"ended_at" timestamp,
	"duration_seconds" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "personas" ADD CONSTRAINT "personas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_persona_id_personas_id_fk" FOREIGN KEY ("persona_id") REFERENCES "public"."personas"("id") ON DELETE set null ON UPDATE no action;