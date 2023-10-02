const defaultMeta = require("./default-meta");

/**
 * @type {import("rollup-plugin-userscript-metablock").MetaValues}
 */
const meta = {
  name: "Selectable Replan Text",
  version: "0.0.2",
  description:
    "Makes replan strings selectable, so you're not required to type them out",
  match: [
    "https://na.route.planning.last-mile.a2z.com/*",
    "https://na.dispatch.planning.last-mile.a2z.com/*",
  ],
  grant: ["GM_addStyle"],
  "run-at": "document-end",
  copyright: defaultMeta.copyright,
  homepage: defaultMeta.homepage,
  author: defaultMeta.author,
  namespace: defaultMeta.namespace,
  supportUrl: defaultMeta.supportUrl,
};

module.exports = meta;
