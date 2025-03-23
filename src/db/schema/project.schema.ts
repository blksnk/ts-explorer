import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../dataTypes";

export const project = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).default("Untitled Project"),
  ...timestamps,
});
