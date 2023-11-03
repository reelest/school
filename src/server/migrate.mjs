import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import "dotenv/config";
import { createClient } from "@libsql/client";
const db = drizzle(
  createClient({
    url: "libsql://talebearer-rowend36.turso.io",
    authToken: process.env.DB,
  })
);
// this will automatically run needed migrations on the database
await migrate(db, { migrationsFolder: "./migrations" });

console.log("Migrations applied");
