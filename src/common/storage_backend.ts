import { IFile, SerializedRecord } from "./vcs";

export abstract class StorageBackend {
  abstract put(key: string, value: string): Promise<void>;
  abstract get(key: string): Promise<string>;

  async save(record: SerializedRecord) {
    const m: Promise<void>[] = [];
    for (let i in record.files) {
      m.push(
        this.put(record.files[i].version, JSON.stringify(record.files[i]))
      );
    }
    await Promise.all(m);
    await this.put(record.root[1] as string, JSON.stringify(record.root));
  }
  async load(version: string): Promise<SerializedRecord> {
    const files: SerializedRecord["files"] = {};
    const m: Promise<void>[] = [];
    const _findKeys = (x: SerializedRecord["root"] | string) => {
      if (typeof x === "string") {
        m.push(this.get(x).then((e) => (files[x] = JSON.parse(e))));
      } else {
        x.slice(2).forEach((e) => _findKeys(e));
      }
    };
    const res = {
      files,
      root: JSON.parse(await this.get(version)),
    };
    console.log(res);
    _findKeys(res.root);
    await Promise.all(m);
    return res;
  }
}
