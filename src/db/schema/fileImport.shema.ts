import { integer, pgTable } from "drizzle-orm/pg-core";
import { file } from "./file.schema";
import { timestamps } from "../dataTypes";

export const fileImport = pgTable("file_imports", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  importingFileId: integer()
    .references(() => file.id)
    .notNull(),
  importedFileId: integer()
    .references(() => file.id)
    .notNull(),
  ...timestamps,
});

export type FileImportOutput = typeof fileImport.$inferSelect;
export type FileImportInput = typeof fileImport.$inferInsert;
