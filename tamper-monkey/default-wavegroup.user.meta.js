const defaultMeta = require("./default-meta");

/**
 * @type {import("rollup-plugin-userscript-metablock").MetaValues}
 */
const meta = {
  name: "Default Wavegroup",
  version: "0.0.2",
  description: "Default the demand upload type to 'Wave Group Enabled Demand'",
  match: ["https://logistics.amazon.com/internal/capacity/uploadFile"],
  "run-at": "document-end",
  copyright: defaultMeta.copyright,
  homepage: defaultMeta.homepage,
  author: defaultMeta.author,
  namespace: defaultMeta.namespace,
  supportUrl: defaultMeta.supportUrl,
};

module.exports = meta;
