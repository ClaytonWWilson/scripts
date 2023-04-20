// ==UserScript==
// @name         AA-Tweaks
// @namespace    mailto:eclawils@amazon.com
// @version      0.1
// @description  Fixes the 'Show Auto-Assign Suggestions' button on the RTW 1.0 Auto Assign page
// @author       Clayton Wilson
// @match        https://routingtools-na.amazon.com/modules/modules.jsp*
// @icon         none
// @grant        GM_addStyle
// @run-at   document-end
// ==/UserScript==

(() => {
  // @ts-ignore
  GM_addStyle(`
  #autoAssignPageId > div:nth-child(7) > div:nth-child(2) > table > tbody > tr > td:nth-child(1) > fieldset > div:nth-child(5) {
    margin-bottom: 50px !important;
  }
  `);
})();
