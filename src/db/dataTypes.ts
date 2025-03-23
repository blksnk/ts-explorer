import { timestamp, varchar } from "drizzle-orm/pg-core";

export const fileHash = varchar("file_hash", { length: 64 });
export const nodeHash = varchar("node_hash", { length: 64 });

export const timestamps = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
};
