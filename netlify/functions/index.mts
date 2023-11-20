import { Context, Config } from "@netlify/functions";
import handleRequest from "../../src/server/app";
import { IRequest } from "itty-router";
import "dotenv/config";

export default async (req: Request, context: Context) => {
  return handleRequest(req as IRequest, {
    DB: process.env.DB as string,
  });
};

export const config: Config = {
  path: ["/api", "/api/*"],
};
