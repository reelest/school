import { IRequest, status } from "itty-router";
import { getDB, lateInit } from "../middleware/db";
import { sql } from "drizzle-orm";
import { buckets, objects } from "../model/buckets";
import {
  SerializedRecord,
  deserialize,
  serialize,
} from "@ungap/structured-clone";
import { Env } from "..";

let stmt = lateInit(() =>
  getDB()
    .insert(buckets)
    .values({ bucket: sql.placeholder("bucket"), sha: sql.placeholder("sha") })
);
export default async function uploadBundle(req: IRequest, env: Env) {
  let raw: SerializedRecord = await req.json(),
    content: any = raw;
  if (Array.isArray(content)) {
    content = deserialize(raw);
  } else {
    raw = serialize(content);
  }
  const bucket = req.params.bundleId;
  await getDB().transaction(async (tx) => {
    await tx.insert(buckets).values({
      bucket: bucket,
      sha: content.version,
    });
    await tx
      .insert(objects)
      .values({
        sha: content.version,
        value: raw,
      })
      .onConflictDoNothing();
  });
  return status(200);
}
