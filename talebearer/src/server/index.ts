import handleRequest from "./routes";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  DB: D1Database;
}

export default {
  fetch: handleRequest,
};
