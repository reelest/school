import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
      sql`(date())`
    ),
  },
  (table) => {
    return {
      bucketIdx: index("bucketIdx").on(table.bucket, table.uploadTime),
    };
  }
);
