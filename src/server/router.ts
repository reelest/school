import { Router, IRequest, json, error } from "itty-router";
import { Env } from ".";
import { corsify, preflight } from "./middleware/cors";
import withDB from "./db";
import withValidation from "./middleware/validate";
import { getVersion } from "./routes/version";

type CF = [env: Env];
const app = Router<IRequest, CF>();
app
  .all<IRequest, CF>("*", withValidation, withDB, preflight)
  .get("/version/:bundleId", getVersion)
  .all("*", () => error(404));

export default function handleRequest(request: IRequest, env: Env) {
  return app.handle(request, env).then(json).catch(error).then(corsify);
}
