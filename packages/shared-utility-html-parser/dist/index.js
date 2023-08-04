"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  parseStatusContent: () => parseStatusContent
});
module.exports = __toCommonJS(src_exports);
var import_mfm_js = require("mfm-js");
function parseStatusContent(str) {
  let retval = [];
  const ex = new RegExp(/<p>(.*?)<\/p>/, "g");
  let new_container;
  const tagExx = /<a href=".*?\/tags\/(.*?)\".*?<\/a>/g;
  str = str.replaceAll(tagExx, "#$1");
  str = str.replaceAll(/<a href=\"(.*?)".*?a>/g, "$1");
  while ((new_container = ex.exec(str)) !== null) {
    let currStr = new_container[1];
    currStr = currStr.replaceAll("&#39;", "'");
    currStr = currStr.replaceAll("<span>", "");
    currStr = currStr.replaceAll("</span>", "");
    const mfmTree = (0, import_mfm_js.parse)(currStr);
    retval.push(mfmTree);
  }
  return retval;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseStatusContent
});
