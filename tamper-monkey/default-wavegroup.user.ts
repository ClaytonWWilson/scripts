// ==UserScript==
// @name         Default Wavegroup
// @version      0.0.1
// @description  Default the demand upload type to 'Wave Group Enabled Demand'
// @match        https://logistics.amazon.com/internal/capacity/uploadFile
// @icon         none
// @run-at       document-end
// @author       Clayton Wilson (eclawils)
// @namespace    mailto:eclawils@amazon.com
// ==/UserScript==

(() => {
  const option = document.querySelector(
    "#capacityForecastSlt > option:nth-child(4)"
  );
  option?.setAttribute("selected", "");
})();
