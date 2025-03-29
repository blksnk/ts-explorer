import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { file } from "./file.schema";
import { timestamps } from "../dataTypes";
import { project } from "./project.schema";

export const fileContent = pgTable("file_content", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fileId: integer("file_id")
    .references(() => file.id)
    .notNull(),
  content: text().notNull(),
  projectId: uuid("project_id")
    .references(() => project.id)
    .notNull(),
  ...timestamps,
});

export type FileContentOutput = typeof fileContent.$inferSelect;
export type FileContentInput = typeof fileContent.$inferInsert;
