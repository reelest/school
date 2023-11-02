import { Router, json, error } from "itty-router";
import { Env } from "..";
import { corsify, preflight } from "../cors";
import withDB from "../model/db";

const app = Router();
app.all("*", withDB, preflight).all("*", () => error(404));

export default function handleRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext
) {
  return app.handle(request, env, ctx).then(json).catch(error).then(corsify);
}
