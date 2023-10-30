import process from "process";
declare global {
  const process: typeof process
}

globalThis.process = process;

