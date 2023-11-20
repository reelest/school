import { Router, IRequest, error } from "itty-router";
import { Env } from "./cloudflare";
import { corsify, preflight } from "./middleware/cors";
import withDB from "./middleware/db";
import getVersion from "./routes/getVersion";
import { njson } from "./itty-netlify";
import uploadBundle from "./routes/uploadBundle";
import getBundle from "./routes/getBundle";
import _listBundle from "./routes/listBundle";

type Args = [env: Env];
const app = Router<IRequest, Args>({ base: "/api/" });

/**
 * High-Level Description
 * ======================
 *
 * Sync Level 1
 * - User 1 sends current version to server. PUT /bundle/:bundleId -> bundleId
 * - User 2 requests current version from server. GET /bundle/:bundleId -> bundleId
 * - User 2 downloads bucket with specified version. /objects/:bundleId -> IDirectory
 *
 * Sync Level 2
 * - User 1 has a lastSavedServerVersion called :fromId which is guaranteed to be on the server.
 * - User 1 sends patch to server. PUT /patch/:fromId/:bundleId -> bundleId
 * - User 2 also has a lastSavedServerVersion.
 * - User 2 requests patches from his lastSavedServerVersion. GET /patch/:fromId/:bundleId -> bundleId
 * - If the server has the version, it sends a patch. Otherwise it sends a full filesystem.
 */

const logger = (req: IRequest) => {
  console.log(req.route);
};
app
  .all<IRequest, Args>("*", preflight, withDB)
  .get("/bundle/", logger, _listBundle)
  .get("/bundle/:bundleId", logger, getVersion)
  .put<IRequest, Args>("/bundle/:bundleId", logger, uploadBundle)
  .get<IRequest, Args>("/objects/:bundleId", logger, getBundle)
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
