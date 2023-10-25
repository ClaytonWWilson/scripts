(() => {
  GM_addStyle(`
.fix-qbar-ssd-blurb-hidden {
  display: none;
}

#fix-qbar-ssd-blurb-button {
  color: #6610f2;
  border-color: #6610f2;
}

#fix-qbar-ssd-blurb-button:hover {
  color: #fff !important;
  background-color: #6610f2;
}
  `);

  const copyStationBlurb = () => {
    const cycleEl: HTMLSelectElement | null =
      document.querySelector("#cycleSelection");
    const cycle = cycleEl?.value;
    const totalRoutedVolume =
      document.querySelector("#totalRoutedVolume")?.textContent;
    const routedFlex = document.querySelector("#routedFLEX")?.textContent;
    const bufferFlex = document.querySelector("#pfsdBuffer")?.textContent;

    let blurb = `${cycle} routing complete. ${totalRoutedVolume} TBAs routed.\n`;

    if (routedFlex && bufferFlex) {
      const totalFlex = parseInt(routedFlex) + parseInt(bufferFlex);

      if (!Number.isNaN(totalFlex)) {
        blurb += `${totalFlex} total flex routes (${routedFlex} + ${bufferFlex} buffer)\n`;
      }
    }

    navigator.clipboard.writeText(blurb);
  };

  const createFixedStationBlurbButton = () => {
    const button = document.createElement("a");
    button.setAttribute("href", "#");
    button.text = "Copy Station Blurb";
    button.classList.add(
      "btn",
      "btn-outline-primary",
      "float-right",
      "fix-qbar-ssd-blurb-hidden"
    );
    button.setAttribute("id", "fix-qbar-ssd-blurb-button");
    button.addEventListener("click", copyStationBlurb);
    return button;
  };

  const setHidden = (el: Element) => {
    if (!el.classList.contains("fix-qbar-ssd-blurb-hidden")) {
      el.classList.add("fix-qbar-ssd-blurb-hidden");
    }
  };

  const setVisible = (el: Element) => {
    if (el.classList.contains("fix-qbar-ssd-blurb-hidden")) {
      el.classList.remove("fix-qbar-ssd-blurb-hidden");
    }
  };

  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.target) {
        // Get current cycle
        const cycleEl: HTMLSelectElement | null =
          document.querySelector("#cycleSelection");
        let cycle: string;
        if (cycleEl) {
          cycle = cycleEl.value;
        } else {
          cycle = "undefined";
        }

        // Get QBar button
        const qbarStationBlurbButton: HTMLAnchorElement | null =
          document.querySelector("#copyStationWebhook");

        // Can't find the QBar button, so return
        if (!qbarStationBlurbButton) {
          console.error("Can't find the Qbar 'Copy Station Blurb' button");
          return;
        }

        // Get the button's container
        const buttonContainer = qbarStationBlurbButton.parentNode;
        if (!buttonContainer) {
          // Nowhere to attach our button, so exit the script
          console.error(
            "Can't find the container element for 'Copy Station Blurb' button. Exiting..."
          );
          bodyObserver.disconnect();
          return;
        }

        // Get or create the new button
        let fixedStationBlurbButton = document.querySelector(
          "#fix-qbar-ssd-blurb-button"
        );
        if (!fixedStationBlurbButton) {
          fixedStationBlurbButton = createFixedStationBlurbButton();
          buttonContainer.insertBefore(
            fixedStationBlurbButton,
            qbarStationBlurbButton
          );
        }

        // If Same Day cycle, show fixed button
        if (cycle.startsWith("SAME_DAY")) {
          setHidden(qbarStationBlurbButton);
          setVisible(fixedStationBlurbButton);
        } else {
          setHidden(fixedStationBlurbButton);
          setVisible(qbarStationBlurbButton);
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
