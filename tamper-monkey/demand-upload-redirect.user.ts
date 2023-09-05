// ==UserScript==
// @name         Demand Upload Redirect
// @version      0.0.1
// @description  Automatically redirect to the working capacity upload page
// @match        https://logistics.amazon.com/internal/capacity/uploader
// @icon         none
// @run-at       document-end
// @author       Clayton Wilson (eclawils)
// @namespace    mailto:eclawils@amazon.com
// ==/UserScript==

(() => {
  location.replace("https://logistics.amazon.com/internal/capacity/uploadFile");
})();
