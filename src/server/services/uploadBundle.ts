import { IRequest, status } from "itty-router";
import { getDB, lateInit } from "../middleware/db";
import { sql } from "drizzle-orm";
import { buckets, objects } from "../model/buckets";

import { Env } from "../cloudflare";
import { SerializedRecord } from "../../common/vcs";
import { DBStorage } from "./db_storage";

let stmt = lateInit(() =>
  getDB()
    .insert(buckets)
    .values({ bucket: sql.placeholder("bucket"), sha: sql.placeholder("sha") })
);
export default async function uploadBundle({
  bucket,
  version,
  content,
}: {
  bucket: string;
  version: string;
  content: SerializedRecord;
}) {
  await getDB().transaction(async (tx) => {
    await tx.insert(buckets).values({
      bucket: bucket,
      sha: version,
    });
    await new DBStorage(tx).save(content);
  });
}
