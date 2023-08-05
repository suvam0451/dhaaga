"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  createClient: () => createClient,
  createCodeRequestUrl: () => createCodeRequestUrl,
  verifyToken: () => verifyToken
});
module.exports = __toCommonJS(src_exports);
var import_axios = __toESM(require("axios"));
var import_misskey_js = require("misskey-js");
var import_react_native_uuid = __toESM(require("react-native-uuid"));
var createClient = (instanceUrl, token) => {
  const cli = new import_misskey_js.api.APIClient({
    origin: instanceUrl,
    credential: token
  });
  return cli;
};
var verifyToken = (host, session) => __async(void 0, null, function* () {
  const res = yield import_axios.default.post(`${host}/api/miauth/${session}/check`);
  return res.data;
});
var createCodeRequestUrl = (instanceUrl) => {
  const authEndpoint = `${instanceUrl}/miauth/${import_react_native_uuid.default.v4()}`;
  const options = {
    name: "Dhaaga",
    callback: "https://example.com/",
    permission: "write:notes,write:following,read:drive"
  };
  const queryString = Object.keys(options).map((key) => `${key}=${encodeURIComponent(options[key])}`).join("&");
  return `${authEndpoint}?${queryString}`;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createClient,
  createCodeRequestUrl,
  verifyToken
});
