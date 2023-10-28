import { lookup } from "mime-types";
import m from "mithril";

import { createFile } from "./filesystem";
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
async function readFile(file, type, basePath = window.location.href) {
  const url = new URL(file, basePath);
  if (url.origin !== window.location.origin) return;
  await m
    .request({
      method: "GET",
      url: url.toString(),
      deserialize: function (value) {
        return value;
      },
    })
    .then(async (content) => {
      addFile(createFile(url.pathname, content));
      switch (type) {
        case "text/html":
          await discoverFromHTML(content, url.href);
      }
    })
    .catch((e) => {
      addFile(create404(url.pathname));
    });
}
const parser = new DOMParser();
async function discoverFromHTML(html, href) {
  const dom = parser.parseFromString(html, "text/html");
  const scripts = dom.getElementsByTagName("script");
  for (let script of scripts) {
    readFile(script.getAttribute("src"), "application/javascript", origin);
  }
  const styles = dom.getElementsByTagName("link");
  for (let style of styles) {
    readFile(
      style.getAttribute("href"),
      style.rel === "stylesheet" ? "text/css" : lookup(styles.href) || "",
      origin
    );
  }
  const links = dom.getElementsByTagName("a");
  for (let link of links) {
    readFile(link.getAttribute("href"), "text/html", origin);
  }
  const imgs = document.getElementsByTagName("img");
  for (let img of imgs) {
    readFile(img.getAttribute("src"), lookup(styles.href), origin);
  }
}

readFile(".", "text/html");
