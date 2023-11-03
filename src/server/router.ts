import { Router, IRequest, error } from "itty-router";
import { Env } from ".";
import { corsify, preflight } from "./middleware/cors";
import withDB from "./middleware/db";
import withValidation from "./middleware/validate";
import { getVersion } from "./routes/version";
import { njson } from "./itty-netlify";
import uploadBundle from "./routes/upload";

type CF = [env: Env];
const app = Router<IRequest, CF>({ base: "/api/" });

const logger = (req: IRequest) => {
  console.log(req.route);
};
app
  .all<IRequest, CF>("*", preflight, withValidation, withDB)
  .get("/version/:bucketId", logger, getVersion)
  .post<IRequest, CF>("/upload/:bucketId", logger, uploadBundle)
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
