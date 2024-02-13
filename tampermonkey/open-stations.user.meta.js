const defaultMeta = require("./default-meta");

/**
 * @type {import("rollup-plugin-userscript-metablock").MetaValues}
 */
const meta = {
  name: "Open Stations",
  version: "0.0.1",
  description: "Opens all the stations",
  match: ["https://w.amazon.com/bin/view/User/Lawrjuli"],
  grant: ["GM_addStyle", "GM_openInTab"],
  "run-at": "document-idle",
  author: defaultMeta.author,
  copyright: defaultMeta.copyright,
  homepage: defaultMeta.homepage,
  namespace: defaultMeta.namespace,
  supportUrl: defaultMeta.supportUrl,
};

module.exports = meta;
