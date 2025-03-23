import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const file = pgTable("files", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  path: text().notNull(),
  name: text().notNull(),
  hash: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const fileImport = pgTable("file_imports", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fromFileId: integer().references(() => file.id),
  toFileId: integer().references(() => file.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});
