import uniq from "uniq";
import { diff, patch } from "jsondiffpatch";
import * as _dmp from "diff-match-patch";
export interface IDirectory {
  name: string;
  version: string;
  parent: IDirectory | null;
  children: Array<IDirectory | IFile>;
}
export interface IFile {
  content: string;
  name: string;
  type: "text" | "binary";
  version: string;
  parent: IDirectory;
}

type IFileStack = Array<IFileStack | string>;

export type SerializedRecord = {
  files: Record<string, Omit<IFile, "parent"> & { parent?: IDirectory }>;
  root: IFileStack;
};
const pathProp = Symbol("paths");
type SerializedRecordWithPaths = SerializedRecord & {
  [pathProp]: Record<string, string>;
};
function walk<T>(
  each: (
    path: string,
    files: (IDirectory | IFile | null)[],
    enter: () => T[],
    stop: Function
  ) => T,
  ...fs: IDirectory[]
) {
  let stopped = false;
  function _walk(_fs: (IDirectory | null)[], path: string) {
    if (stopped) return [];
    const files = uniq(
      _fs
        .map((e) => (e ? e.children.map((e) => e.name) : []))
        .flat()
        .sort()
    ) as string[];
    return files.map(function (e): T {
      let nodes = _fs.map((dir) =>
        dir ? dir.children.find((node) => node.name === e) ?? null : null
      );
      return each(
        path + "/" + e,
        nodes,
        function () {
          return _walk(
            nodes.map((e) => (e && "children" in e ? e : null)),
            path + "/" + e
          );
        },
        function () {
          stopped = true;
        }
      );
    });
  }
  return _walk(fs, "");
}

export function serialize(fs: IDirectory): SerializedRecordWithPaths {
  const files: Record<string, Omit<IFile, "parent">> = {};
  const paths: Record<string, string> = {};
  const cache = [];
  return {
    files,
    [pathProp]: paths,
    root: [
      fs!.name,
      fs!.version,
      ...(walk(function (path, [e], enter) {
        if (e && "content" in e) {
          let s = e.version;
          let i = 0;
          while (files[s]) s = ++i + "." + e.version;
          files[s] = {
            content: e.content,
            name: e.name,
            type: e.type,
            version: e.version,
          };
          paths[path] = e.version;
          paths[s] = path;
          return s;
        } else {
          return [e!.name, e!.version, ...enter()];
        }
      }, fs) as IFileStack),
    ],
  };
}

export function unserialize(data: SerializedRecord) {
  const { files, root } = data;
  const keys = Object.keys(files);
  function _unserialize(x: IFileStack | string, parent: IDirectory | null) {
    if (typeof x === "string") {
      let v = keys.find((e) => x.startsWith(e)) as string;
      return { ...files[v], parent } as IFile;
    } else {
      const [name, version, ...files] = x;
      const node = {
        name,
        version,
        parent,
        children: null as unknown as (IDirectory | IFile)[],
      } as IDirectory;
      node.children = files.map((e) => _unserialize(e, node));
      return node;
    }
  }
  return _unserialize(root, null) as IDirectory;
}

/**
 * This method depends on JSON.parse/stringify behaviour remaining the same on both the server and the client
 */
const separator = ["\x00", "\x01", "\x02"];
const dmp = new _dmp.diff_match_patch();
const dmp2 = new _dmp.diff_match_patch();
dmp2.Diff_Timeout = 0.2;
dmp.Match_Threshold =
  dmp.Match_Distance =
  dmp.Patch_DeleteThreshold =
  dmp.Patch_Margin =
    0;
const RENAME_COST = 10;
function isRenameCandidate(content1: string, content2: string) {
  return (
    content2.length > RENAME_COST &&
    Math.min(content1.length, content2.length) /
      Math.max(content1.length, content2.length) >
      0.6 &&
    dmp2.diff_levenshtein(dmp2.diff_main(content1, content2)) /
      Math.max(content1.length, content2.length) >
      0.6
  );
}

// A more space efficient diff storage
function diff_main_toDelta(a: string, b: string) {
  const diffs = dmp.diff_main(a, b);
  dmp.diff_cleanupEfficiency(diffs);
  let sep;
  for (let i = 65; i < 255; i++) {
    let p = String.fromCharCode(i);
    if (!a.includes(p) && !b.includes(p)) {
      sep = p;
      break;
    }
  }
  if (!sep) {
    // Failed to find separator, default back to encodeURI
    return "\u00FF" + dmp.diff_toDelta(diffs);
  }
  //More efficient path
  var text = [""];
  for (var x = 0; x < diffs.length; x++) {
    switch (diffs[x][0]) {
      case _dmp.DIFF_INSERT:
        text[x + 1] = "+" + diffs[x][1];
        break;
      case _dmp.DIFF_DELETE:
        text[x + 1] = "-" + diffs[x][1].length;
        break;
      case _dmp.DIFF_EQUAL:
        text[x + 1] = "=" + diffs[x][1].length;
        break;
    }
  }
  return text.join(sep);
}

//Less efficient but it is expected that deltas are smaller
function diff_fromDelta(text1: string, delta: string) {
  if (delta.codePointAt(0) === 255) {
    return dmp.diff_fromDelta(text1, delta.slice(1));
  } else {
    let sep = delta[0];
    return dmp.diff_fromDelta(
      text1,
      delta.split(sep).slice(1).map(encodeURI).join("\t")
    );
  }
}

const compressKeys = function (
  shortNames: Record<string, string>,
  c: string,
  i: number,
  a: string[]
) {
  let p = 0,
    t = c.slice(0, ++p);
  while (a[i + 1] && a[i + 1].startsWith(t) && p < c.length) {
    t = c.slice(0, ++p);
  }
  while (a[i - 1] && a[i - 1].startsWith(t) && p < c.length) {
    t = c.slice(0, ++p);
  }
  shortNames[c] = t;
  return shortNames;
};

//TODO store files by path
const BINARY = 0;
const TEXT = 1;
const EMPTY = { files: {}, root: [], [pathProp]: {} };
export function packRecords(
  _new: SerializedRecordWithPaths,
  _old: SerializedRecordWithPaths = EMPTY
) {
  let __versionsOld = Object.keys(_old.files);
  const oldShortNames = __versionsOld.sort().reduce(compressKeys, {});

  let _versionsNew = Object.keys(_new.files);
  const newShortNames = _versionsNew.sort().reduce(compressKeys, {});

  // Removed Files
  let _versionsOld = __versionsOld
    .filter((e) => {
      return (
        _versionsNew.findIndex(
          (f) =>
            _old.files[e].version === _new.files[f].version &&
            _old[pathProp][e] === _new[pathProp][f]
        ) === -1
      );
    })
    .sort();

  // Added files
  _versionsNew = _versionsNew
    .filter((f) => {
      return (
        __versionsOld.findIndex(
          (e) =>
            _old.files[e].version === _new.files[f].version &&
            _old[pathProp][e] === _new[pathProp][f]
        ) === -1
      );
    })
    .sort();

  let versionsOld: (string | undefined)[] = [];
  let versionsNew: string[] = [];

  //Track file changes by file path
  for (let version of _versionsOld) {
    let mappedVersion =
      _new[pathProp][_old[pathProp][version] /* old filepath */];
    if (mappedVersion) {
      versionsOld.push(version);
      versionsNew.push(mappedVersion);
    }
  }

  //For previously untracked files, try to find renames: This is an 0n2 operation
  _versionsNew = _versionsNew.filter((e) => !versionsNew.includes(e));
  for (let i of _versionsNew) {
    versionsNew.push(i);
    let found = false;
    for (let j of _versionsOld) {
      if (isRenameCandidate(_old.files[j].content, _new.files[i].content)) {
        versionsOld.push(j);
        found = true;
        break;
      }
    }
    if (!found) {
      versionsOld.push(undefined);
    }
  }
  return {
    a: versionsNew.map((e, i) => [
      _new.files[e].name,
      _new.files[e].type === "text" ? TEXT : BINARY,
      newShortNames[e],
      versionsOld[i] !== undefined ? 0 : _new.files[e].content,

      versionsOld[i] !== undefined
        ? diff_main_toDelta(
            _old.files[versionsOld[i] as string].content,
            _new.files[e].content
          )
        : 0,
      versionsOld[i] ? oldShortNames[versionsOld[i] as string] : 0,
    ]),
    d: diff_main_toDelta(JSON.stringify(_old.root), JSON.stringify(_new.root)),
    b: _old.root[1],
  };
}

export function unpackRecords(
  diff: ReturnType<typeof packRecords>,
  _old: SerializedRecord = EMPTY
): SerializedRecord {
  const [n, t, v, co, d, b] = [0, 1, 2, 3, 4, 5];

  let m: SerializedRecord = {
    files: {},
    root: JSON.parse(
      dmp.diff_text2(diff_fromDelta(JSON.stringify(_old.root), diff.d))
    ),
  };
  const newKeys: Record<string, number> = {};
  function _findKeys(o: any, p: string[], x: IFileStack | string) {
    if (typeof x === "string") {
      let v = p.findIndex((e) => x.startsWith(e));
      o[x] = v;
    } else {
      x.slice(2).forEach((e) => _findKeys(o, p, e));
    }
  }
  _findKeys(
    newKeys,
    diff.a.map((e) => e[v] as string),
    m.root
  );
  let __versionsOld = Object.keys(_old.files);
  const oldShortNames = __versionsOld.sort().reduce(compressKeys, {});
  for (let i in oldShortNames) {
    oldShortNames[oldShortNames[i]] = i;
  }

  for (let version in newKeys) {
    let i = diff.a[newKeys[version]];
    m.files[version] =
      newKeys[version] < 0
        ? _old.files[version]
        : {
            content:
              i[co] === 0
                ? dmp.diff_text2(
                    diff_fromDelta(
                      _old.files[oldShortNames[i[b] as string]].content,
                      i[d] as string
                    )
                  )
                : (i[co] as string),
            name: i[n] as string,
            type: i[t] === BINARY ? "binary" : "text",
            version: version.replace(/^\d+\./, ""),
          };
  }

  return m;
}
