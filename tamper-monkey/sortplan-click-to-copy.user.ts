// ==UserScript==
// @name         SortPlan Click-to-copy
// @namespace    mailto:eclawils@amazon.com
// @version      0.1
// @description  Adds a copy button to the sort planning page to copy plan values
// @author       Clayton Wilson
// @match        https://na.sort.planning.last-mile.a2z.com/*
// @icon         none
// @grant        GM_addStyle
// @run-at       document-end
// @website      https://github.com/ClaytonWWilson
// @supportURL   https://github.com/ClaytonWWilson/scripts/issues
// @updateURL    https://github.com/ClaytonWWilson/scripts/releases/latest/download/sortplan-click-to-copy.user.js
// @downloadURL  https://github.com/ClaytonWWilson/scripts/releases/latest/download/sortplan-click-to-copy.user.js

// ==/UserScript==

// @ts-ignore
// GM_addStyle();

(() => {
  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.target) {
        const manifestedDisplay = document.querySelector(
          "#app-layout-content-1 > div > div > div > div.container-display-if-ready.success-container > div > div > div.css-dsf1ob > div > div:nth-child(1) > div > div:nth-child(1) > p.css-3ymn3a"
        ) as HTMLParagraphElement;

        const forecastedDisplay = document.querySelector(
          "#app-layout-content-1 > div > div > div > div.container-display-if-ready.success-container > div > div > div.css-dsf1ob > div > div:nth-child(1) > div > div:nth-child(2) > p.css-3ymn3a"
        ) as HTMLParagraphElement;

        const bagCountDisplay = document.querySelector(
          "#app-layout-content-1 > div > div > div > div.container-display-if-ready.success-container > div > div > div.css-dsf1ob > div > div:nth-child(2) > div > div > p.css-3ymn3a"
        ) as HTMLParagraphElement;

        const planInfoSection = document.querySelector(
          "#app-layout-content-1 > div > div > div > div.container-display-if-ready.success-container > div > div > div.css-1iiqi5c"
        );

        if (
          !manifestedDisplay ||
          !forecastedDisplay ||
          !bagCountDisplay ||
          !planInfoSection
        ) {
          console.error(
            "Couldn't find an element on screen. Make sure DCAP has finished running and refresh the page."
          );
          return;
        }

        let manifested = manifestedDisplay.innerText;
        let forecasted = forecastedDisplay.innerText;
        let bagCount = bagCountDisplay.innerText;

        if (!manifested || !forecasted || !bagCount) {
          console.error(
            "One of the DCAP plan values is empty. Stopping script."
          );
          return;
        }

        // Check of copy botton is attached or not
        let copyButton: HTMLAnchorElement | null = document.querySelector(
          ".sortplanning-copy-button"
        );

        // Re-attach button if it's not present
        if (!copyButton) {
          copyButton = document.createElement("a");
          copyButton.innerText = "Copy Values";
          copyButton.classList.add("css-r55ncy", "sortplanning-copy-button");
          copyButton.setAttribute("style", "width: 6rem;");

          copyButton.addEventListener("click", () => {
            navigator.clipboard.writeText(
              `${manifested}\r\n${forecasted}\r\n${bagCount}`
            );
          });

          planInfoSection.after(copyButton);
        }
      }
    });
  });

  bodyObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });
})();
