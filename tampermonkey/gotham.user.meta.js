const defaultMeta = require("./default-meta");

/**
 * @type {import("rollup-plugin-userscript-metablock").MetaValues}
 */
const meta = {
  name: "Gotham",
  version: "0.2.4",
  description: "Various tweaks and improvements to Chime Web",
  match: ["app.chime.aws/*"],
  grant: ["GM_addStyle"],
  require: "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
  "run-at": "document-end",
  copyright: defaultMeta.copyright,
  homepage: defaultMeta.homepage,
  author: "Clayton Wilson (eclawils) and Cullen Henderson (cullenhe)",
  namespace: defaultMeta.namespace,
  supportUrl: defaultMeta.supportUrl,
};

module.exports = meta;
