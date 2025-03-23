ALTER TABLE "files" RENAME COLUMN "hash" TO "file_hash";--> statement-breakpoint
ALTER TABLE "nodes" RENAME COLUMN "hash" TO "node_hash";--> statement-breakpoint
ALTER TABLE "nodes" RENAME COLUMN "fileId" TO "file_id";--> statement-breakpoint
ALTER TABLE "nodes" DROP CONSTRAINT "nodes_fileId_files_id_fk";
--> statement-breakpoint
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;