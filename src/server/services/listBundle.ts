import { IRequest, status } from "itty-router";
import { getDB, lateInit } from "../middleware/db";
import { buckets } from "../model/buckets";
import { desc, eq, sql } from "drizzle-orm";

let stmt = lateInit(() =>
  getDB().select().from(buckets).orderBy(desc(buckets.uploadTime)).prepare()
);
export function listBundle() {
  return getDB().select().from(buckets);
}
