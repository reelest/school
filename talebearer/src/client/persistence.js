import { stringify, parse } from "@ungap/structured-clone/json";
import { getFileSystem, setFileSystem } from "./filesystem";
export function saveFileSystem() {
  return localStorage.setItem(
    "talebearer-filesystem",
    stringify(getFileSystem())
  );
}

export function loadFileSystem() {
  try {
    let data = localStorage.getItem("talebearer-filesystem");
    setFileSystem(parse(data));
  } catch (e) {
    console.log(e);
  }
}
