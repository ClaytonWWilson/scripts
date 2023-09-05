// ==UserScript==
// @name         Demand Upload Redirect
// @version      0.0.1
// @description  Automatically redirect to the working capacity upload page
// @match        https://logistics.amazon.com/internal/capacity/uploader
// @icon         none
// @run-at       document-end
// @author       Clayton Wilson (eclawils)
// @namespace    mailto:eclawils@amazon.com
// @website      https://github.com/ClaytonWWilson
// @supportURL   https://github.com/ClaytonWWilson/scripts/issues
// @updateURL    https://github.com/ClaytonWWilson/scripts/releases/latest/download/demand-upload-redirect.user.js
// @downloadURL  https://github.com/ClaytonWWilson/scripts/releases/latest/download/demand-upload-redirect.user.js
// ==/UserScript==

(() => {
  location.replace("https://logistics.amazon.com/internal/capacity/uploadFile");
})();
