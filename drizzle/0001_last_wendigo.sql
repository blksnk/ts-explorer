ALTER TABLE "files" ALTER COLUMN "hash" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "project_id" integer;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;