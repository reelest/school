import path from "path";
const filesystem: IDirectory = {
  parent: null,
  version: "",
  name: "",
  children: [],
};

export const getFileSystem = () => {
  return filesystem;
};

export const setFileSystem = (e: IDirectory) => {
  Object.assign(filesystem, e);
};

interface IDirectory {
  name: string;
  version: string;
  parent: IDirectory | null;
  children: Array<IDirectory | IFile>;
}
interface IFile {
  content: string;
  name: string;
  type: "text" | "binary";
  version: string;
  parent: IDirectory;
}

export async function createFile(
  filepath: string,
  content: string | { type: IFile["type"]; value: IFile["content"] }
) {
  const node = resolveFile(filepath);
  if (node && "content" in node && node.content === content) return;
  const filename = path.basename(filepath);
  const dirname = path.dirname(filepath);
  const segments = dirname.split(path.sep).filter(Boolean);
  let parent = filesystem;
  for (let segment of segments) {
    parent = addDirectoryNode(parent, segment);
  }
  const k = addFileNode(parent, filename);
  let type: IFile["type"] = "text";
  if (typeof content !== "string") {
    type = content.type;
    content = content.value;
  }
  k.content = content;
  k.type = type;
  await updateVersions(k);
  notifyFSChange();
}

async function updateVersions(k: IDirectory | IFile) {
  if ("content" in k) {
    k.version = await digest(k.content);
  } else {
    k.version = await digest(k.children.map((e) => e.version).join("\n"));
  }
  if (k.parent) {
    await updateVersions(k.parent);
  }
}
async function digest(message: string, algo = "SHA-1") {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest(algo, new TextEncoder().encode(message))
    ),
    (byte) => byte.toString(16).padStart(2, "0")
  ).join("");
}

export function resolveFile(filepath: string) {
  const filename = path.basename(filepath);
  const dirname = path.dirname(filepath);
  const segments = dirname.split(path.sep).filter(Boolean);
  let parent = filesystem;
  for (let segment of segments) {
    parent = parent.children.find(
      (e) => e.name === segment && "children" in e
    ) as IDirectory;
    if (!parent) return null;
  }
  if (filename) return parent.children.find((e) => e.name === filename);
  else return parent;
}

export async function deleteFile(filepath: string) {
  const x = resolveFile(filepath);
  if (x) {
    x.parent!.children.splice(x.parent!.children.indexOf(x), 1);
    let parent = x.parent;
    await updateVersions(parent!);
    x.parent = null;
    while (parent) {
      parent = parent.parent;
    }
  }
  notifyFSChange();
}

function addDirectoryNode(parent: IDirectory, name: string) {
  let m = parent.children.find((e) => e.name === name);
  if (m && "children" in m) {
    return m;
  } else {
    if (m) parent.children.splice(parent.children.indexOf(m), 1);
    m = {
      children: [],
      name: name,
      parent: parent,
      version: "",
    };
    parent.children.push(m);
    return m as IDirectory;
  }
}

function addFileNode(parent: IDirectory, name: string) {
  let m = parent.children.find((e) => e.name === name);
  if (m && "content" in m) {
    return m;
  } else {
    if (m) parent.children.splice(parent.children.indexOf(m), 1);
    m = {
      content: "",
      name: name,
      parent: parent,
      type: "text",
      version: "",
    };
    parent.children.push(m);
    return m as IFile;
  }
}

const cbs: ((fs: IDirectory) => void)[] = [];
export const onFSChange = (cb: (fs: IDirectory) => void) => {
  cbs.push(cb);
  cb(filesystem);
  return function () {
    if (cbs.includes(cb)) cbs.splice(cbs.indexOf(cb), 1);
  };
};

function notifyFSChange() {
  cbs.forEach((e) => e(filesystem));
}
