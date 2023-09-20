const defaultMeta = require("./default-meta");

/**
 * @type {import("rollup-plugin-userscript-metablock").MetaValues}
 */
const meta = {
  name: "Demand Upload Redirect",
  version: "0.0.2",
  description: "Automatically redirect to the working capacity upload page",
  match: ["https://logistics.amazon.com/internal/capacity/uploader"],
  "run-at": "document-end",
  copyright: defaultMeta.copyright,
  homepage: defaultMeta.homepage,
  author: defaultMeta.author,
  namespace: defaultMeta.namespace,
  supportUrl: defaultMeta.supportUrl,
};

module.exports = meta;
