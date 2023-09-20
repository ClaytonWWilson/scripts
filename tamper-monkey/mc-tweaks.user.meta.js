const defaultMeta = require("./default-meta");

/**
 * @type {import("rollup-plugin-userscript-metablock").MetaValues}
 */
const meta = {
  name: "MC-Tweaks",
  version: "1.1.2",
  description:
    "Various tweaks and improvements to Mission Control including task notifications and higher visibility on new tasks",
  match: ["https://na-mc-execute.corp.amazon.com/*"],
  grant: ["GM_addStyle"],
  "run-at": "document-start",
  copyright: defaultMeta.copyright,
  homepage: defaultMeta.homepage,
  author: defaultMeta.author,
  namespace: defaultMeta.namespace,
  supportUrl: defaultMeta.supportUrl,
};

module.exports = meta;
