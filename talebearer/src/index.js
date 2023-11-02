import { readFile } from "./client/discover";
import { getFileSystem } from "./client/filesystem";
import { loadFileSystem, saveFileSystem } from "./client/persistence";
import sync from "./client/sync";

(async function () {
  console.time("Discovering files");
  await loadFileSystem();
  console.log(getFileSystem());
  await readFile(".", "text/html");
  console.timeEnd("Discovering files");
  const fs = getFileSystem();
  await saveFileSystem();
  console.log(fs);
  await sync("bucket", fs);
})().then(async () => {
  async;
});
