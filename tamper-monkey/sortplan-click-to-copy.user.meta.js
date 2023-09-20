const defaultMeta = require("./default-meta");

/**
 * @type {import("rollup-plugin-userscript-metablock").MetaValues}
 */
const meta = {
  name: "SortPlan Click-to-copy",
  version: "0.1.1",
  description:
    "Adds a copy button to the sort planning page to copy plan values",
  match: ["https://na.sort.planning.last-mile.a2z.com/*"],
  grant: ["GM_addStyle"],
  "run-at": "document-end",
  copyright: defaultMeta.copyright,
  homepage: defaultMeta.homepage,
  author: defaultMeta.author,
  namespace: defaultMeta.namespace,
  supportUrl: defaultMeta.supportUrl,
};

module.exports = meta;
