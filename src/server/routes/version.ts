import { IRequest, status } from "itty-router";
import { getDB } from "../db";

export function getVersion(req: IRequest) {
  return "Hello World";
  getDB().select();
  return req.params;
}
