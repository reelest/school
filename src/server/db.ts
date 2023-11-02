import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { IRequest } from "itty-router";
import { Env } from ".";

let db: LibSQLDatabase;
export default function withDB(request: IRequest, env: Env) {
  if (!db) {
    db = drizzle(
      createClient({
        url: "libsql://talebearer-rowend36.turso.io",
        authToken: env.DB,
      })
    );
  }
}

export function getDB() {
  return db;
}
