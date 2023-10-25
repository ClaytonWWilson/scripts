const defaultMeta = require("./default-meta");

/**
 * @type {import("rollup-plugin-userscript-metablock").MetaValues}
 */
const meta = {
  name: "Fix QBar SSD Blurb",
  version: "0.0.1",
  description: "Fixes the Station Blurb button on QBar",
  match: [
    "https://na.coworkassignment.science.last-mile.a2z.com/Scheduling/Workstation",
  ],
  grant: ["GM_addStyle"],
  "run-at": "document-end",
  copyright: defaultMeta.copyright,
  homepage: defaultMeta.homepage,
  author: "Clayton Wilson (eclawils)",
  namespace: defaultMeta.namespace,
  supportUrl: defaultMeta.supportUrl,
};

module.exports = meta;
