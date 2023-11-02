import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { IRequest } from "itty-router";
import { Env } from "..";

let db: DrizzleD1Database;
export default function withDB(request: IRequest, env: Env) {
  if (!db) {
    db = drizzle(env.DB);
  }
}

export function getDB() {
  return db;
}
