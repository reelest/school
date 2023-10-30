import "./globals.ts";
import handleRequest from "./routes";
import { Env } from "./types";
import { ExecutionContext, Request } from "@cloudflare/workers-types";

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		return handleRequest(request, env);
	}
};
