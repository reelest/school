import { IRequest, status } from "itty-router";
import { getDB, lateInit } from "../middleware/db";
import { eq, sql } from "drizzle-orm";
import { buckets, objects } from "../model/buckets";
import { deserialize, serialize } from "@ungap/structured-clone";
import { Env } from "../cloudflare";
import getBundle from "../services/getBundle";

let stmt = lateInit(() =>
  getDB()
    .insert(buckets)
    .values({ bucket: sql.placeholder("bucket"), sha: sql.placeholder("sha") })
);
export default async function _getBundle(req: IRequest, env: Env) {
  return await getBundle(req.params.bundleId);
}
