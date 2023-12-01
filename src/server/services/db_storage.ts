import { StorageBackend } from "../../common/storage_backend";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { buckets, objects } from "../model/buckets";
import { getDB } from "../middleware/db";
import { eq } from "drizzle-orm";

export class DBStorage extends StorageBackend {
  db: Omit<ReturnType<typeof getDB>, "batch">;
  constructor(db: Omit<ReturnType<typeof getDB>, "batch">) {
    super();
    this.db = db;
  }
  async put(key: string, value: string): Promise<void> {
    console.log("Saving", key);
    await this.db
      .insert(objects)
      .values({
        sha: key,
        value: value,
      })
      .onConflictDoNothing();
  }
  async get(key: string): Promise<string> {
    return (
      await this.db
        .select({ value: objects.value })
        .from(objects)
        .where(eq(objects.sha, key))
        .limit(1)
        .get()
    )?.value as string;
  }
}
