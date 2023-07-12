// ==UserScript==
// @name         SortPlanning-Tweaks
// @namespace    mailto:eclawils@amazon.com
// @version      0.1
// @description  Adds a copy button to the sort planning page to copy plan values
// @author       Clayton Wilson
// @match        https://na.sort.planning.last-mile.a2z.com/*
// @icon         none
// @grant        GM_addStyle
// @run-at   document-end
// ==/UserScript==

// @ts-ignore
// GM_addStyle();

(() => {
  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.target) {
        const manifested = (
          document.querySelector(
            "#app-layout-content-1 > div > div > div > div.container-display-if-ready.success-container > div > div > div.css-dsf1ob > div > div:nth-child(1) > div > div:nth-child(1) > p.css-3ymn3a"
          ) as HTMLParagraphElement
        ).innerText;

        const forcasted = (
          document.querySelector(
            "#app-layout-content-1 > div > div > div > div.container-display-if-ready.success-container > div > div > div.css-dsf1ob > div > div:nth-child(1) > div > div:nth-child(2) > p.css-3ymn3a"
          ) as HTMLParagraphElement
        ).innerText;

        const bagCount = (
          document.querySelector(
            "#app-layout-content-1 > div > div > div > div.container-display-if-ready.success-container > div > div > div.css-dsf1ob > div > div:nth-child(2) > div > div > p.css-3ymn3a"
          ) as HTMLParagraphElement
        ).innerText;

        const planInfoSection = document.querySelector(
          "#app-layout-content-1 > div > div > div > div.container-display-if-ready.success-container > div > div > div.css-1iiqi5c"
        );

        if (!manifested || !forcasted || !bagCount || !planInfoSection) return;

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
              `${manifested}\r\n${forcasted}\r\n${bagCount}`
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
