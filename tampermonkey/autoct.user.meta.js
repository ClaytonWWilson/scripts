const defaultMeta = require("./default-meta");

/**
 * @type {import("rollup-plugin-userscript-metablock").MetaValues}
 */
const meta = {
  name: "AutoCT",
  version: "0.0.1",
  description: "Auto Cluster Transfer",
  match: ["https://routingtools-na.amazon.com/clusterTransfer.jsp*"],
  grant: ["GM_addStyle", "GM_registerMenuCommand", "GM_xmlhttpRequest"],
  "run-at": "document-idle",
  author: "Clayton Wilson (eclawils) and Joshua Frost (josfrost)",
  connect: ["https://routingtools-na.amazon.com/clusterTransfer.jsp*"],
  copyright: defaultMeta.copyright,
  homepage: defaultMeta.homepage,
  namespace: defaultMeta.namespace,
  supportUrl: defaultMeta.supportUrl,
};

module.exports = meta;
