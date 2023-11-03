import openAPI from "openapi-request-validator";

import spec from "./openapi.json";
import { IRequest, Router, error } from "itty-router";
const OpenAPIRequestValidator =
  "default" in openAPI ? (openAPI.default as typeof openAPI) : openAPI;

export type ValidRoute = Array<keyof (typeof spec)["paths"]>;

const app = Router({ base: "/api" });
(Object.keys(spec.paths) as ValidRoute).forEach((path) => {
  app.all(path.replace(/\{([^{}]+)\}/g, ":$1"), function (req: IRequest) {
    const method = req.method.toLowerCase() as "get" | "post" | "put" | "patch";
    if (method in spec.paths[path]) {
      req.foundRoute = spec.paths[path];
    }
  });
});
export default function withValidation(req: IRequest) {
  app.handle(req);
  if (!req.foundRoute) {
    return error(401, "No public route at " + req.url);
  }
  const method = req.method.toLowerCase();
  if (!(method in req.foundRoute)) {
    return error(401, "Unsupported method " + method.toLocaleUpperCase());
  }
  const x = new OpenAPIRequestValidator(req.foundRoute[method]);
  const err = x.validateRequest(req);
  if (err) {
    return error(401, err);
  }
}
