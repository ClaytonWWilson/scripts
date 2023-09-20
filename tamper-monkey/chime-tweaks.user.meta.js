const defaultMeta = require("./default-meta");

/**
 * @type {import("rollup-plugin-userscript-metablock").MetaValues}
 */
const meta = {
  name: "Chime-Tweaks",
  version: "0.2.4",
  description: "Various tweaks and improvements to Chime Web",
  match: ["app.chime.aws/*"],
  grant: ["GM_addStyle"],
  require: "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
  "run-at": "document-end",
  copyright: defaultMeta.copyright,
  homepage: defaultMeta.homepage,
  author: defaultMeta.author,
  namespace: defaultMeta.namespace,
  supportUrl: defaultMeta.supportUrl,
};

module.exports = meta;
