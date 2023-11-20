import { IRequest, status } from "itty-router";
import { getDB, lateInit } from "../middleware/db";
import { buckets } from "../model/buckets";
import { desc, eq, sql } from "drizzle-orm";

let stmt = lateInit(() =>
  getDB()
    .select()
    .from(buckets)
    .where(eq(buckets.bucket, sql.placeholder("bucket")))
    .orderBy(desc(buckets.uploadTime))
    .limit(1)
    .prepare()
);
export function getVersion(bundleId: string) {
  return stmt().all({ bucket: "" + bundleId });
}
