import { integer, pgTable } from "drizzle-orm/pg-core";
import { nodePackage } from "./nodePackage.schema";
import { timestamps } from "../dataTypes";
import { file } from "./file.schema";

export const packageImport = pgTable("package_imports", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fileId: integer("file_id")
    .references(() => file.id)
    .notNull(),
  nodePackageId: integer("node_package_id")
    .references(() => nodePackage.id)
    .notNull(),
  ...timestamps,
});

export type PackageImportInput = typeof packageImport.$inferInsert;
export type PackageImportOutput = typeof packageImport.$inferSelect;
