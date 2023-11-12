import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { fetcher } from "itty-fetcher";
const api = fetcher({
  base: "http://localhost:8888/api",
});

describe("Worker", () => {
  it(
    "should return bundles",
    async () => {
      const text = await api.get("/bundle/test");
      expect(Array.isArray(text)).toBe(true);
    },
    { timeout: 7000 }
  );
});
