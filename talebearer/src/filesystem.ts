import path from "path-browserify";
const filesystem = {
  "": {
    type: "folder",
    files: [],
  },
};

interface IFile {
  content: string;
  name: string;
  exists: boolean;
  version: number;
}

export function addFile(file: IFile) {}

export function createFile(filepath, content) {
  const segments = filepath.split(path.sep);
  console.log(segments);
}
