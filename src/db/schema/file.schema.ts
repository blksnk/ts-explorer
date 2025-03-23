import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { project } from "./project.schema";
import { fileHash, timestamps } from "../dataTypes";
import { relations } from "drizzle-orm";

export const file = pgTable("files", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  path: text().notNull(),
  name: text().notNull(),
  hash: fileHash.notNull(),
  projectId: integer("project_id").references(() => project.id),
  ...timestamps,
});

export const projectFiles = relations(file, ({ one }) => ({
  projectId: one(project),
}));
