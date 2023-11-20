import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";
// import { drizzle as drizzle1, DrizzleD1Database } from "drizzle-orm/d1";
import { createClient } from "@libsql/client";
import { IRequest } from "itty-router";
import { Env } from "../cloudflare";
import { buckets } from "../model/buckets";

let db: // | DrizzleD1Database<{ buckets: typeof buckets }>
LibSQLDatabase<{ buckets: typeof buckets }>;
export default function withDB(request: IRequest, env: Env) {
  if (!db) {
    db =
      // request.cf
      // ? drizzle1(env.D1 as unknown as D1Database)
      // :
      drizzle(
        createClient({
          url: "libsql://talebearer-rowend36.turso.io",
          authToken: env.DB,
        }),
        { schema: { buckets } }
      );
  }
}

export function getDB() {
  return db;
}

export function lateInit<T>(init: (...args: any[]) => T): () => T {
  let m: T;
  return () => {
    if (m) return m;
    return (m = init());
  };
}
