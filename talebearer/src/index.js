import { readFile } from "./discover";
import { resolveFile } from "./filesystem";
import "./sync";

readFile(".", "text/html").then((e) => console.log(resolveFile("/")));

