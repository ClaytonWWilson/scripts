// ==UserScript==
// @name         QBar Dark Mode
// @version      0.0.1
// @description  Dark mode support for QBar to save your eyes
// @match        https://na.coworkassignment.science.last-mile.a2z.com/Scheduling/Workstation
// @iconURL      https://raw.githubusercontent.com/ClaytonWWilson/scripts/master/tamper-monkey/icons/mc-icon-200x200.png
// @icon64URL    https://raw.githubusercontent.com/ClaytonWWilson/scripts/master/tamper-monkey/icons/mc-icon-64x64.png
// @run-at       document-start
// @author       Clayton Wilson (eclawils)
// @namespace    mailto:eclawils@amazon.com
// @website      https://github.com/ClaytonWWilson
// @supportURL   https://github.com/ClaytonWWilson/scripts/issues
// @updateURL    https://github.com/ClaytonWWilson/scripts/releases/latest/download/qbar-dark-mode.user.js
// @downloadURL  https://github.com/ClaytonWWilson/scripts/releases/latest/download/qbar-dark-mode.user.js
// @grant        GM_addStyle
// ==/UserScript==

(() => {
  const primary = "#303030";
  const secondary = "#404040";
  const uiPrimary = "#526791";
  const uiSuccess = "";
  // CSS for dark mode
  GM_addStyle(`
    body {
      background-color: #303030;
    }

    th {
      background-color: #303030;
      color: white;
    }

    td {
      background-color: #303030;
      color: white;
    }

    h2 {
      background-color: #303030;
      color: white;
    }

    .table-primary {
      background-color: #526791;
    }

    .table-success {
      background-color: #557f45;
    }

    .table-active {
      background-color: #606060;
    }

    span {
      color: white !important;
    }

    .navbar {
      background-color: #464646 !important;
    }

    a {
      color: white !important;
    }

    .input-group-text {
      background-color: #404040 !important;
    }

    .input-group > select {
      background-color: #404040 !important;
      color: white;
    }

    .input-group > select > option {
      color: white;
    }

    .custom-file-label {
      background-color: #404040 !important;
      color: white;
    }

    td > input {
      background-color: #303030 !important;
      color: white !important;
    }

    option {
      color: white;
    }

    input:focus {
      color: white !important;
    }

    select:focus {
      color: white !important;
    }

    div#ratMenuContainer {
      background-color: #303030;
    }

    input {
      background-color: #404040 !important;
      color: white !important;
    }

    div#ui-datepicker-div {
      background-color: #404040;
    }

    td > span {
      background-color: #303030 !important;
    }
  `);
})();
