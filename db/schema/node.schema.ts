import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { nodeHash, timestamps } from "../dataTypes";
import { file } from "./file.schema";
import { relations } from "drizzle-orm";
import { project } from "./project.schema";

export const node = pgTable("nodes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  hash: nodeHash.notNull(),
  fileId: integer("file_id")
    .references(() => file.id)
    .notNull(),
  start: integer().notNull(),
  end: integer().notNull(),
  text: text().notNull(),
  kind: integer().notNull(),
  parentId: integer("parent_id"),
  projectId: uuid("project_id")
    .references(() => project.id)
    .notNull(),
  ...timestamps,
});

export type NodeInput = typeof node.$inferInsert;
export type NodeOutput = typeof node.$inferSelect;

export const nodeParent = relations(node, ({ one }) => ({
  parentNode: one(node, {
    fields: [node.parentId],
    references: [node.id],
  }),
}));
