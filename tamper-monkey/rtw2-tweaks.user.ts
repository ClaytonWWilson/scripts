// ==UserScript==
// @name         RTW-Tweaks
// @namespace    mailto:eclawils@amazon.com
// @version      1.0
// @description  Various tweaks and improvements to RTW 2.0
// @author       Clayton Wilson
// @match        https://na.route.planning.last-mile.a2z.com/*
// @match        https://na.dispatch.planning.last-mile.a2z.com/*
// @icon         none
// @grant        GM_addStyle
// @run-at   document-start
// ==/UserScript==

(() => {
  GM_addStyle(`
    p.css-d7vd {
      user-select: all !important;
    }
  `);
})();

// Easy copy/paste dcap numbers
