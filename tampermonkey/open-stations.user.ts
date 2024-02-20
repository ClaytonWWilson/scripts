GM_addStyle(`
  .hidden {
    display: none;
  }

  .open-stations-script-container {
    display: flex;
    flex-direction: column;
    min-height: 30px;
    width: 200px;
    float: left;
    border: 3px dotted gray;
  }

  .open-stations-checkbox {
    margin-left: 10px !important;
    margin-right: 10px !important;
  }

  .open-stations-container {
    text-align: center;
  }

  .station-list-input {
    resize: none;
  }

  .option-label {
    user-select: none;
  }
`);

function toggleVisibility(element: HTMLElement) {
  element.classList.toggle("hidden");
}

function updateRunButton(
  runButton: HTMLButtonElement,
  checkboxes: HTMLInputElement[]
) {
  for (let checkbox of checkboxes) {
    if (checkbox.checked) {
      runButton.disabled = false;
      return;
    }
  }

  runButton.disabled = true;
}

(async () => {
  const scriptContainer = document.createElement("div");
  scriptContainer.classList.add("open-stations-script-container");

  const panelContainer = document.createElement("div");
  panelContainer.classList.add("open-stations-container");

  const openPanelButton = document.createElement("button");
  openPanelButton.innerText = "Open Stations";
  openPanelButton.addEventListener("click", () => {
    toggleVisibility(panelContainer);
  });

  const optionsContainer = document.createElement("div");

  const suiCheckbox = document.createElement("input");
  suiCheckbox.classList.add("open-stations-checkbox");
  suiCheckbox.setAttribute("type", "checkbox");
  suiCheckbox.setAttribute("id", "open-stations-sui-checkbox");
  const suiLabel = document.createElement("label");
  suiLabel.setAttribute("for", "open-stations-sui-checkbox");
  suiLabel.innerText = "SUI";
  suiLabel.classList.add("option-label");

  const chimeCheckbox = document.createElement("input");
  chimeCheckbox.classList.add("open-stations-checkbox");
  chimeCheckbox.setAttribute("type", "checkbox");
  chimeCheckbox.setAttribute("id", "open-stations-chime-checkbox");
  const chimeLabel = document.createElement("label");
  chimeLabel.setAttribute("for", "open-stations-chime-checkbox");
  chimeLabel.innerText = "Chime";
  chimeLabel.classList.add("option-label");

  optionsContainer.appendChild(suiCheckbox);
  optionsContainer.appendChild(suiLabel);
  optionsContainer.appendChild(chimeCheckbox);
  optionsContainer.appendChild(chimeLabel);

  panelContainer.appendChild(optionsContainer);

  const stationListInput = document.createElement("textarea");
  stationListInput.classList.add("station-list-input");
  stationListInput.setAttribute("rows", "5");

  panelContainer.appendChild(stationListInput);

  const runButton = document.createElement("button");
  runButton.innerText = "Do it";
  runButton.disabled = true;
  runButton.addEventListener("click", () => {
    const stations = stationListInput.value
      .split("\n")
      .map((old) => old.trim())
      .reverse(); // Reverse so that tabs appear in the same order as user inputted.
    if (!stations || stations.length < 1) {
      console.error("No stations found in textbox");
      return;
    }

    if (suiCheckbox.checked) {
      for (let station of stations) {
        if (station.length < 4) continue;
        const xpath = `//a[contains(., "${station} SUI")]`;
        const anchor = document
          .evaluate(xpath, document, null, XPathResult.ANY_TYPE, null)
          .iterateNext();

        if (!anchor) {
          alert(`Can't find SUI link for ${station}`);
          continue;
        }

        const link = (anchor as HTMLAnchorElement).href;
        GM_openInTab(link, { active: false });
      }
    }

    if (chimeCheckbox.checked) {
      for (let station of stations) {
        if (station.length < 4) continue;
        const xpath = `//a[contains(., "${station} Chime (Online)")]`;
        const anchor = document
          .evaluate(xpath, document, null, XPathResult.ANY_TYPE, null)
          .iterateNext();

        if (!anchor) {
          alert(`Can't find Chime link for ${station}`);
          continue;
        }

        const link = (anchor as HTMLAnchorElement).href;
        GM_openInTab(link, { active: false });
      }
    }
  });

  // Enable of disable the run button based on whether an option is selected
  suiCheckbox.addEventListener("change", () => {
    updateRunButton(runButton, [suiCheckbox, chimeCheckbox]);
  });

  chimeCheckbox.addEventListener("change", () => {
    updateRunButton(runButton, [suiCheckbox, chimeCheckbox]);
  });

  panelContainer.appendChild(runButton);
  panelContainer.classList.add("hidden");

  scriptContainer.appendChild(openPanelButton);
  scriptContainer.appendChild(panelContainer);

  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.target) {
        const stationTable = document.querySelector("#tableid");
        if (!stationTable) return;

        // Sanity check also prevents ts complaints
        if (!stationTable.parentNode) {
          console.log("Station table has no parentNode", stationTable);
          return;
        }

        // Check script container is attached
        const scriptContainerQuery = document.querySelector(
          ".open-stations-script-container"
        );

        if (!scriptContainerQuery) {
          stationTable.parentNode.insertBefore(scriptContainer, stationTable);
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
