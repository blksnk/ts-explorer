import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { file } from "./file.schema";
import { timestamps } from "../dataTypes";
import { project } from "./project.schema";

export const fileImport = pgTable("file_imports", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  importingFileId: integer("importing_file_id")
    .references(() => file.id)
    .notNull(),
  importedFileId: integer("imported_file_id")
    .references(() => file.id)
    .notNull(),
  projectId: uuid("project_id")
    .references(() => project.id)
    .notNull(),
  ...timestamps,
});

export type FileImportOutput = typeof fileImport.$inferSelect;
export type FileImportInput = typeof fileImport.$inferInsert;
