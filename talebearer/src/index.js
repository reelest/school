import { readFile } from "./discover";
import { resolveFile } from "./filesystem";

readFile(".", "text/html").then((e) => console.log(resolveFile("/")));
