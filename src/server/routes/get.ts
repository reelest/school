import { IRequest, status } from "itty-router";
import { getDB, lateInit } from "../middleware/db";
import { eq, sql } from "drizzle-orm";
import { buckets, objects } from "../model/buckets";
import { deserialize, serialize } from "@ungap/structured-clone";
import { Env } from "..";

let stmt = lateInit(() =>
  getDB()
    .insert(buckets)
    .values({ bucket: sql.placeholder("bucket"), sha: sql.placeholder("sha") })
);
export default async function getBundle(req: IRequest, env: Env) {
  const bucket = req.params.objectId;
  console.log(
    await getDB()
      .select()
      .from(objects)
      .where(eq(objects.sha, bucket))
      .limit(1)
      .all()
  );
  return await getDB()
    .select()
    .from(objects)
    .where(eq(objects.sha, bucket))
    .limit(1)
    .all();
}
