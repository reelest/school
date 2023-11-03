import { IRequest, status } from "itty-router";
import { getDB, lateInit } from "../middleware/db";
import { sql } from "drizzle-orm";
import { buckets, objects } from "../model/buckets";
import { deserialize, serialize } from "@ungap/structured-clone";
import { Env } from "..";

let stmt = lateInit(() =>
  getDB()
    .insert(buckets)
    .values({ bucket: sql.placeholder("bucket"), sha: sql.placeholder("sha") })
);
export default async function uploadBundle(req: IRequest, env: Env) {
  const content = deserialize(await req.json());
  const bucket = req.params.bucketId;
  console.log({ bucket, content });
  await getDB().transaction(async (tx) => {
    await tx.insert(buckets).values({
      bucket: bucket,
      sha: content.version,
    });
    await tx
      .insert(objects)
      .values({
        sha: content.version,
        value: serialize(content),
      })
      .onConflictDoNothing();
  });
  return status(200);
}
