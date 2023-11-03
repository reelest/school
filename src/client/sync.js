import { fetcher } from "itty-fetcher";
import { stringify, parse } from "@ungap/structured-clone/json";
const api = fetcher({
  base: "/api",
});

export default async function sync(bucket, fs) {
  console.log(await api.get(`/version/${encodeURIComponent(bucket)}`));
  api.post(`/upload/${encodeURIComponent(bucket)}`, stringify(fs));
}
