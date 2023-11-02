import { fetcher } from "itty-fetcher";
const api = fetcher({
  base: "/api",
});

export default async function sync(bucket, fs) {
  console.log(await api.get(`/version?bucket=${bucket}`));
}
