import { readFile } from "./discover";
import { getFileSystem } from "./filesystem";
import { loadFileSystem, saveFileSystem } from "./persistence";
import sync from "./sync";
if (process.env.NODE_ENV !== "production")
  new EventSource("/esbuild").addEventListener("change", () =>
    location.reload()
  );
(async function () {
  console.time("Discovering files");
  await loadFileSystem();
  await readFile(".", "text/html");
  console.timeEnd("Discovering files");
  const fs = getFileSystem();
  await saveFileSystem();
  console.log(fs);
  await sync("bucket", fs);
})().then(async () => {
  async;
});
