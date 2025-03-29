import { integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../dataTypes";
import { project } from "./project.schema";

export const nodePackage = pgTable("node_packages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  projectId: uuid("project_id")
    .references(() => project.id)
    .notNull(),
  version: varchar({
    length: 255,
  }).notNull(),
  ...timestamps,
});

export type NodePackageInput = typeof nodePackage.$inferInsert;
export type NodePackageOutput = typeof nodePackage.$inferSelect;
