CREATE TABLE "node_packages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "node_packages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"version" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "package_imports" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "package_imports_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"file_id" integer NOT NULL,
	"node_package_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "file_imports" RENAME COLUMN "importingFileId" TO "importing_file_id";--> statement-breakpoint
ALTER TABLE "file_imports" RENAME COLUMN "importedFileId" TO "imported_file_id";--> statement-breakpoint
ALTER TABLE "file_imports" DROP CONSTRAINT "file_imports_importingFileId_files_id_fk";
--> statement-breakpoint
ALTER TABLE "file_imports" DROP CONSTRAINT "file_imports_importedFileId_files_id_fk";
--> statement-breakpoint
ALTER TABLE "package_imports" ADD CONSTRAINT "package_imports_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_imports" ADD CONSTRAINT "package_imports_node_package_id_node_packages_id_fk" FOREIGN KEY ("node_package_id") REFERENCES "public"."node_packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_imports" ADD CONSTRAINT "file_imports_importing_file_id_files_id_fk" FOREIGN KEY ("importing_file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_imports" ADD CONSTRAINT "file_imports_imported_file_id_files_id_fk" FOREIGN KEY ("imported_file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;