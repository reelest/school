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

  await createFile("/main.ts", "Hello");
  const p = packRecords(serialize(getFileSystem()), m);
  expect(p.a.length).toEqual(0);

  await createFile("/main.ts", "Hello9");
  const q = packRecords(serialize(getFileSystem()), m);
  expect(q.a.length).toEqual(1);

  await deleteFile("/main.ts");
  const r = packRecords(serialize(getFileSystem()), m);
  expect(r.a.length).toEqual(0);

  console.log(p, q, r);
});
