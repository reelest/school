import { fetcher } from "itty-fetcher";
import { serialize, unserialize } from "../common/vcs";
const api = fetcher({
  base: "/api",
});

export default async function sync(bucket, fs) {
  console.log(await api.get(`/bundle/${encodeURIComponent(bucket)}`));
  api.post(
    `/upload/${encodeURIComponent(bucket)}`,
    JSON.stringify(serialize(fs))
  );
}
