DROP TABLE "node_parents" CASCADE;--> statement-breakpoint
ALTER TABLE "nodes" ADD COLUMN "parent_id" integer;