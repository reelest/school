import { sql } from "drizzle-orm";
import {
  blob,
  index,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const buckets = sqliteTable(
  "buckets",
  {
    index: integer("index").primaryKey({
      autoIncrement:
        true /** unnecessary for the most part, read sqlite docs */,
    }),
    bucket: text("bucket").notNull(),
    sha: text("sha").notNull(),
    uploadTime: integer("uploadTime", { mode: "timestamp" }).default(
      sql`CURRENT_TIMESTAMP`
    ),
  },
  (table) => {
    return {
      bucketIdx: index("bucketIdx").on(table.bucket, table.uploadTime),
    };
  }
);

export const objects = sqliteTable(
  "objects",
  {
    sha: text("sha").unique().notNull(),
    value: text("value", { mode: "json" }),
  },
  (table) => {
    return {
      bucketIdx: index("sha").on(table.sha),
    };
  }
);
