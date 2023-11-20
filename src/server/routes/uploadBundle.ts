import { IRequest, status } from "itty-router";
import { getDB, lateInit } from "../middleware/db";
import { sql } from "drizzle-orm";
import { buckets, objects } from "../model/buckets";

import { Env } from "../cloudflare";
import { SerializedRecord } from "../../common/vcs";
import uploadBundle from "../services/uploadBundle";

let stmt = lateInit(() =>
  getDB()
    .insert(buckets)
    .values({ bucket: sql.placeholder("bucket"), sha: sql.placeholder("sha") })
);
export default async function _uploadBundle(req: IRequest, env: Env) {
  const raw = await req.text();
  let content: SerializedRecord = await JSON.parse(raw);
  const bucket = req.params.bundleId;
  const version = content.root[1] as string;
  await uploadBundle({ bucket, version, content, raw });
  return status(200);
}
