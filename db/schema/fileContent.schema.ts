import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { file } from "./file.schema";
import { timestamps } from "../dataTypes";

export const fileContent = pgTable("file_content", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fileId: integer("file_id")
    .references(() => file.id)
    .notNull(),
  content: text().notNull(),
  ...timestamps,
});

export type FileContentOutput = typeof fileContent.$inferSelect;
export type FileContentInput = typeof fileContent.$inferInsert;
