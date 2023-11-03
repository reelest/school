import { ResponseFormatter, json, text, html, png, webp } from "itty-router";
const netlify = /*#__PURE__*/ (e: ResponseFormatter): ResponseFormatter => {
  return (body?: any, options?: ResponseInit) =>
    body && body instanceof Response ? body : e(body, options);
};

export const njson = netlify(json);
export const ntext = netlify(text);
export const nhtml = netlify(html);
export const npng = netlify(png);
export const nwebp = netlify(webp);
