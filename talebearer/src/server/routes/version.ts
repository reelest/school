import { IRequest } from "itty-router";

export function version(req: IRequest) {
  return req.params;
}

export const versionSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Version",
  description: "Allows Client to Get The Current Version",
  type: "object",
  properties: {},
};
