import handleRequest from "./app";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  DB: string;
  D1: string;
}

export default {
  fetch: handleRequest,
};
