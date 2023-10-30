import { Router } from "itty-router";
import { Request } from "@cloudflare/workers-types";
import { Env } from "../types";
const app = Router<Request, [Env]>();

export default app;
