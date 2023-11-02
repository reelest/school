import { fetcher } from "itty-fetcher";
const api = fetcher({
  base: "http://localhost:8787" || "https://talebearer.reelest.workers.dev",
});

export default async function sync(bucket, fs) {
  console.log(await api.get(`/version?bucket=${bucket}`));
}
