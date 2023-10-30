import { Request } from "@cloudflare/workers-types";
import {Env} from "../types";
import app from "./router";
import stream from  "./stream";
import {json, error} from "itty-router";
import {preflight, corsify} from "./cors";

app.all("*", preflight)
    .get("/stream", stream);

export default function handleRequest(request: Request, env: Env){
    return app.handle(request, env).then(json).catch(error).then(corsify);
}
