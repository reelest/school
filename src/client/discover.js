import { lookup } from "mime-types";
import m from "mithril";
import { createFile, deleteFile } from "./filesystem";
import path from "path";

const read = [];
export async function readFile(file, type, basePath = window.location.href) {
  if (!file) return;
  const url = new URL(file, basePath);
  if (url.origin !== window.location.origin) return;
  if (read.includes(url.toString())) return;
  read.push(url.toString());
  await m
    .request({
      method: "GET",
      url: url.toString(),
      responseType: isBinaryType(type) ? "blob" : "text",
    })
    .then(
      async (content) => {
        if (content && typeof content !== "string") {
          content = { type: "binary", value: await blobToBase64(content) };
        }
        if (type === "text/html" && path.extname(url.pathname) !== ".html")
          await createFile(url.pathname + "/index.html", content);
        else await createFile(url.pathname, content);

        switch (type) {
          case "text/html":
            return await discoverFromHTML(content, url.href);
          case "text/css":
            return await discoverFromCSS(content, url.href);
        }
      },
      async (e) => {
        console.warn("Failed to read: " + url.pathname + " " + basePath);
        await deleteFile(url.pathname);
      }
    );
}
const parser = new DOMParser();
async function discoverFromHTML(html, href) {
  const dom = parser.parseFromString(html, "text/html");
  const scripts = dom.getElementsByTagName("script");
  for (let script of scripts) {
    await readFile(script.getAttribute("src"), "application/javascript", href);
  }
  const styles = dom.getElementsByTagName("link");
  for (let style of styles) {
    await readFile(
      style.getAttribute("href"),
      style.rel === "stylesheet" ? "text/css" : lookup(styles.href) || "",
      href
    );
  }
  const links = dom.getElementsByTagName("a");
  for (let link of links) {
    await readFile(link.getAttribute("href"), "text/html", href);
  }
  const imgs = document.getElementsByTagName("img");
  for (let img of imgs) {
    await readFile(img.getAttribute("src"), lookup(styles.href), href);
  }
}

async function discoverFromCSS(cssText, href) {
  const dom = document;
  const style = dom.createElement("style");
  style.setAttribute("media", "(max-width: -1)");
  style.innerHTML = cssText;
  dom.head.append(style);
  const styleSheet = Array.from(dom.styleSheets).find(
    (ss) => ss.ownerNode == style
  );
  style.remove();
  /**
   * Got list of properties from @link [https://developer.mozilla.org/en-US/docs/Web/CSS/url]
   *
   * @param {string} key
   * @param {string} value
   */
  async function readProperty(key, value) {
    const m = [];
    value.replace(
      /url\((['"]?)((?:[^\1\)\\]|\\.)+)\1\)/g,
      function (_, __, match) {
        if (!(match.startsWith("#") || match.startsWith("data:")))
          m.push(match);
      }
    );
    if (!m.length) return;
    await Promise.all(m.map((url) => readFile(url, lookup(url), href)));
  }

  await Promise.all(
    Array.from(styleSheet.cssRules).map(async function readCSSRule(rule) {
      if (rule instanceof CSSStyleRule || rule instanceof CSSFontFaceRule) {
        await Promise.all(
          [...rule.style].map((e) => readProperty(e, rule.style[e]))
        );
      } else if (rule instanceof CSSImportRule) {
        await readFile(rule.href, "text/css", href);
      } else if (
        rule instanceof CSSGroupingRule ||
        rule instanceof CSSKeyframesRule
      ) {
        await Promise.all(Array.from(styleSheet.cssRules).map(readCSSRule));
      }
    })
  );
}

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
const isBinaryType = (type) =>
  ![
    "text/html",
    "application/javascript",
    "text/css",
    "application/json",
  ].includes(type);
