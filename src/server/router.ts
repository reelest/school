import { Router, IRequest, json, error } from "itty-router";
import { Env } from ".";
import { corsify, preflight } from "./middleware/cors";
import withDB from "./db";
import withValidation from "./middleware/validate";
import { getVersion } from "./routes/version";

type CF = [env: Env];
const app = Router<IRequest, CF>({ base: "/api" });
app
  .all<IRequest, CF>("*", withValidation, withDB, preflight)
  .get("/version/:bundleId", getVersion)
  .get("*", () => json("Hello"))
  .all("*", () => error(404));

export default async function handleRequest(request: IRequest, env: Env) {
  console.log(
    await app.handle(request, env).then(json).catch(error).then(corsify)
  );
  return await app.handle(request, env).then(json).catch(error).then(corsify);
}
