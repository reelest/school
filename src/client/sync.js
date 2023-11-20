import { fetcher } from "itty-fetcher";
import { serialize, unserialize } from "../common/vcs";
const api = fetcher({
  base: "http://localhost:8787/api",
});

export default async function sync(bucket, fs) {
  console.log(await api.get(`/bundle/${encodeURIComponent(bucket)}`));
  await api.put(`/bundle/${encodeURIComponent(bucket)}`, serialize(fs));
}
