import { StorageBackend } from "../../common/storage_backend";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { buckets, objects } from "../model/buckets";
import { eq } from "drizzle-orm";

export class DBStorage<
  K extends Record<string, string>
> extends StorageBackend {
  db: Omit<LibSQLDatabase<K>, "batch">;
  constructor(db: Omit<LibSQLDatabase<K>, "batch">) {
    super();
    this.db = db;
  }
  async put(key: string, value: string): Promise<void> {
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
