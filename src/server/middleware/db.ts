import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { IRequest } from "itty-router";
import { Env } from "..";
import { buckets } from "../model/buckets";

let db: LibSQLDatabase<{ buckets: typeof buckets }>;
export default function withDB(request: IRequest, env: Env) {
  if (!db) {
    db = drizzle(
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
