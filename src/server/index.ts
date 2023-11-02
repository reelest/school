import handleRequest from "./router";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  DB: string;
}

export default {
  fetch: handleRequest,
};
