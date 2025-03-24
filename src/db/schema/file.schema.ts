import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { project } from "./project.schema";
import { fileHash, timestamps } from "../dataTypes";
import { relations } from "drizzle-orm";

export const file = pgTable("files", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  path: text().notNull(),
  name: text().notNull(),
  hash: fileHash.notNull().unique(),
  projectId: uuid("project_id")
    .references(() => project.id)
    .notNull(),
  ...timestamps,
});

export type FileInput = typeof file.$inferInsert;
export type FileOutput = typeof file.$inferSelect;

export const projectFiles = relations(file, ({ one }) => ({
  projectId: one(project),
}));
