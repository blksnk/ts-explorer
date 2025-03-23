ALTER TABLE "files" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "files" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "file_imports" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "file_imports" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "nodes" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "nodes" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;