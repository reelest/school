import { Router, IRequest, error } from "itty-router";
import { Env } from ".";
import { corsify, preflight } from "./middleware/cors";
import withDB from "./middleware/db";
import withValidation, { toRoute } from "./middleware/validate";
import { getVersion } from "./routes/version";
import { njson } from "./itty-netlify";
import uploadBundle from "./routes/upload";
import getBundle from "./routes/get";

type Args = [env: Env];
const app = Router<IRequest, Args>({ base: "/api/" });

const logger = (req: IRequest) => {
  console.log(req.route);
};
app
  .all<IRequest, Args>("*", preflight, withValidation, withDB)
  .get(toRoute("/version/{bundleId}"), logger, getVersion)
  .post<IRequest, Args>(toRoute("/bundle/{bundleId}"), logger, uploadBundle)
  .post<IRequest, Args>(toRoute("/objects/{objectId}"), logger, getBundle)
  .all("*", logger, () => error(401, "Unimplemented API"));

export default async function handleRequest(request: IRequest, env: Env) {
  return await app
    .handle(request, env)
    .then(njson)
    .catch((e) => {
      console.log(e);
      return error(e);
    })
    .then(corsify);
}
