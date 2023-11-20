import { test, expect, beforeAll } from "vitest";
import { createFile, deleteFile, getFileSystem } from "../client/filesystem";
import { packRecords, serialize, unpackRecords, unserialize } from "./vcs";

test("serialize", async function () {
  await createFile("/main.js", "Hello");
  await createFile("/main.css", { type: "binary", value: btoa("Hello World") });
  await createFile("/main/main.css", {
    type: "binary",
    value: btoa("Hello World"),
  });
  const m = serialize(getFileSystem());
  expect(m).toHaveProperty("files");
  expect(m).toHaveProperty("root");
  expect(m.root[1]).toBe(getFileSystem().version);
});

test("unserialize", async function () {
  await createFile("/main.js", "Hello");
  await createFile("/main.css", { type: "binary", value: btoa("Hello World") });
  await createFile("/main/main.css", {
    type: "binary",
    value: btoa("Hello World"),
  });
  const m = serialize(getFileSystem());
  // expect(unserialize(m)).toEqual(getFileSystem());
  expect(serialize(unserialize(m))).toEqual(m);
});

test.only("packRecords", async function () {
  await createFile("/main.js", "Hello");
  await createFile("/main.css", { type: "binary", value: btoa("Hello World") });
  await createFile("/main/main.css", {
    type: "binary",
    value: btoa("Hello World"),
  });
  const m = serialize(getFileSystem());
  const z = packRecords(m);
  expect(packRecords(unpackRecords(z))).toEqual(z);
  expect(unserialize(unpackRecords(z))).toEqual(unserialize(m));

  // Add one file
  await createFile("/main.ts", "Hello");
  const x = serialize(getFileSystem());
  const p = packRecords(x, m);
  expect(p.a.length).toEqual(1);

  // Add one file and delete one file
  await createFile("/main5.ts", "Hello");
  await deleteFile("/main.ts");
  const n = serialize(getFileSystem());
  const s = packRecords(n, x);
  expect(s.a.length).toEqual(1);

  expect(unpackRecords(s, x)).toEqual({ files: n.files, root: n.root });

  // Modify one file
  await createFile("/main5.ts", "Hello9");
  const b = serialize(getFileSystem());
  const q = packRecords(b, n);
  expect(unpackRecords(q, n)).toEqual({ files: b.files, root: b.root });
  console.log(q);
  expect(q.a.length).toEqual(1);

  // Remove both files
  await deleteFile("/main.ts");
  await deleteFile("/main5.ts");
  const r = packRecords(serialize(getFileSystem()), m);
  expect(r.a.length).toEqual(0);
});
