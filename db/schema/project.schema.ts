import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../dataTypes";

export const project = pgTable("projects", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull().default("Untitled Project"),
  ...timestamps,
});

export type ProjectInput = typeof project.$inferInsert;
export type ProjectOutput = typeof project.$inferSelect;
