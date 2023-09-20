import html from "../lib/jsmarkup";

GM_addStyle(`kbd {
  background-color: #eee;
  border-radius: 3px;
  border: 1px solid #b4b4b4;
  box-shadow:
    0 1px 1px rgba(0, 0, 0, 0.2),
    0 2px 0 0 rgba(255, 255, 255, 0.7) inset;
  color: #333;
  display: inline-block;
  font-size: 0.85em;
  font-weight: 700;
  line-height: 1;
  padding: 2px 4px;
  white-space: nowrap;
}

.hidden {
  display: none;
}

h2 {
  text-align: center;
  padding-top: 5px;
}

ul {
  list-style-type: none;
  padding-left: 0px;
  margin-bottom: 10px;
}

table {
  margin-bottom: 10px;
  margin-top: 10px;
}

#auto-ct-container {
  border: 1px solid gray;
  width: fit-content;
}

#transfer-input {
  resize: none;
  width: 100%;
  margin: 0;
  padding: 0;
}

#transfer-list {
  border: 1px solid gray;
  display: flex;
  flex-direction: column;
}

.transfer-li-container {
  display: grid;
  grid-columns: 3fr;
  column-gap: 2rem;
}

#transfer-station-code {
  grid-column-start: 0;
  grid-column-end: 1;
}

#transfer-tba-count {
  grid-column-start: 1;
  grid-column-end: 2;
}

#transfer-dest-selector {
  grid-column-start: 2;
  grid-column-end: 3;
}

#queue-li-container {
  display: grid;
  grid-columns: 5fr;
  column-gap: 1rem;
}

#queue-table {
  border: 1px solid gray;
  width: 100%;
  border-collapse: collapse;
}

#queue-table td {
  border: 1px solid gray;
}

thead {
  background-color: lightgray;
}

#logs-table {
  border: 1px solid gray;
  width: 100%;
  border-collapse: collapse;
}

#logs-table td {
  border: 1px solid gray;
}

.severity-info {
  color: black;
}

.severity-warning {
  color: orange;
}

.severity-error {
  color: red;
}

#logs-table-container {
  max-height: 300px;
  overflow-y: scroll;
}`);

type AutoCTState = {
  status: "RUNNING" | "IDLE" | "STOPPED";
  jobs: Transfer[];
  previews?: Transfer[];
};

type Transfer = {
  station: string;
  cluster: string;
  tbas: string[];
};

type AutoCTLogs = LogEntry[];

type LogEntry = {
  message: string;
  time: Date;
  severity: "INFO" | "WARNING" | "ERROR";
};

const RTW1_CT_BASE_URL =
  "https://routingtools-na.amazon.com/clusterTransfer.jsp?stationCode=";
const STATION_CODE_RE = /^[A-Z]{3}[1-9]{1}$/;
const TBA_RE = /^TBA[0-9]+$/;

const openFilePicker = (onFile: (files: FileList) => {}) => {
  const input = document.createElement("input");

  input.setAttribute("type", "file");
  input.setAttribute("accept", "text/csv");
  input.setAttribute("style", "display: none;");
  input.addEventListener("change", (e) => {
    if (!e.target) return;

    const files: FileList | null = (e.target as HTMLInputElement).files;

    if (!files) return;

    onFile(files);
  });

  document.body.appendChild(input);

  input.focus();
  input.click();
  input.showPicker();
};

const stopAutoCt = () => {
  const state = getState();
  state.status = "STOPPED";
  setState(state);
};

// GM_registerMenuCommand("Load csv", openFilePicker);
GM_registerMenuCommand("Stop", stopAutoCt);

const sleep = async (milliseconds: number) => {
  await new Promise<void>((resolve, _reject) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
};

const logMessage = (
  message: string,
  severity?: "INFO" | "WARNING" | "ERROR"
): AutoCTLogs => {
  const logs = getLogs();
  const newLog: LogEntry = {
    message,
    severity: severity ? severity : "INFO",
    time: new Date(),
  };

  logs.push(newLog);
  setLogs(logs);

  return logs;
};

const getLogs = (): AutoCTLogs => {
  const stringifiedLogs = localStorage.getItem("autoCTLogs");

  let logs: AutoCTLogs;
  if (stringifiedLogs) {
    logs = JSON.parse(stringifiedLogs);
  } else {
    logs = [];
  }

  return logs;
};

const setLogs = (logs: AutoCTLogs) => {
  localStorage.setItem("autoCTLogs", JSON.stringify(logs));
};

const getState = (): AutoCTState => {
  const stringifiedState = localStorage.getItem("autoCTState");

  let state: AutoCTState;
  if (stringifiedState) {
    state = JSON.parse(stringifiedState);
  } else {
    state = {
      status: "IDLE",
      jobs: [],
    };

    setState(state);
  }

  return state;
};

const setState = (state: AutoCTState) => {
  localStorage.setItem("autoCTState", JSON.stringify(state));
};

// const loadTbasFromCsv = (f: File): Promise<string | ArrayBuffer> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.addEventListener("load", (e) => {
//       if (!e.target) return reject();
//       if (!e.target.result) return reject();

//       resolve(e.target.result);
//     });

//     reader.readAsText(f);
//   });
// };

// const loadTbasIntoState = (csv: string) => {
//   const stationMap = new Map<string, string[]>();
//   const lines = csv.split("\n");
//   lines.forEach((row) => {
//     const vals = row.split("\t");
//     const stationCode = vals[0];
//     const tba = vals[1];
//     if (!stationCode.match(STATION_CODE_RE) || !tba.match(TBA_RE)) {
//       logMessage(
//         `ERROR: Skipping row ${row} since it doesn't pattern match station code and TBA`
//       );
//       return;
//     }

//     let stationData = stationMap.get(stationCode);

//     if (!stationData) {
//       stationData = [];
//     }

//     stationData.push(tba);
//     stationMap.set(stationCode, stationData);
//   });

//   const state = getState();
//   stationMap.forEach((tbas, stationCode) => {
//     const newJob: Transfer = {
//       station: stationCode,
//       cluster: "SAME_DAY",
//       tbas,
//     };

//     state.jobs.push(newJob);
//   });
//   setState(state);
// };

const toggleAutoCTVisibility = () => {
  const hidableSection = document.querySelector("#hidable-auto-ct-section");

  if (!hidableSection) {
    logMessage("ERROR: Can't find hidable-auto-ct-section in the DOM");
    return;
  }

  if (hidableSection.classList.contains("hidden")) {
    hidableSection.classList.remove("hidden");
  } else {
    hidableSection.classList.add("hidden");
  }
};

// TODO: Add support for cluster in 3rd column
const parseInputToMap = (text: string) => {
  const stationMap = new Map<string, string[]>();
  const lines = text.split("\n");
  lines.forEach((row) => {
    if (row === "") return;

    const vals = row.split("\t");
    const stationCode = vals[0];
    const tba = vals[1];

    if (!stationCode.match(STATION_CODE_RE) || !tba.match(TBA_RE)) {
      logMessage(
        `ERROR: Skipping importing row '${row}' since it doesn't pattern match station code and TBA`
      );
      return;
    }

    let stationTbas = stationMap.get(stationCode);

    if (!stationTbas) {
      stationTbas = [];
    }

    stationTbas.push(tba);
    stationMap.set(stationCode, stationTbas);
  });

  return stationMap;
};

const buildPreviewList = (stationMap: Map<string, string[]>) => {
  const previewList = document.querySelector("#transfer-list");
  if (!previewList) {
    logMessage("ERROR: Can't find the preview list in the DOM");
    return;
  }

  let oldChildren = previewList.children;
  for (let i = 0; i < oldChildren.length; i++) {
    previewList.removeChild(oldChildren[i]);
  }

  let state = getState();
  state.previews = [];

  let index = -1;
  for (let stationTransfer of stationMap.entries()) {
    index++;
    const stationCode = stationTransfer[0];
    const tbas = stationTransfer[1];

    const newJob: Transfer = {
      station: stationCode,
      cluster: "",
      tbas,
    };
    state.previews.push(newJob);

    previewList.appendChild(
      html([
        "li",
        { class: "transfer-li-container" },
        [
          ["span", { id: "transfer-station-code" }, stationCode],
          ["span", { id: "transfer-tba-count" }, `${tbas.length} TBAs`],
          [
            "select",
            {
              id: "transfer-dest-selector",
              datastation: stationCode,
              datakey: `${index}`,
              dataselection: "",
              onchange: (e: Event) => {
                const target = e.target as HTMLSelectElement | null;
                if (!target) return;

                const stationCode = target.getAttribute("datastation");
                const stateIndex = target.getAttribute("datakey");
                const prevSelection = target.getAttribute("dataselection");

                if (
                  stationCode === null ||
                  stateIndex === null ||
                  prevSelection === null
                ) {
                  logMessage("ERROR: Missing required attributes on select");
                  return;
                }

                let state = getState();
                if (!state.previews) {
                  logMessage(
                    "ERROR: Localstorage state is inconsistant with DOM"
                  );
                  return;
                }

                state.previews[parseInt(stateIndex)].cluster = target.value;
                target.setAttribute("dataselection", target.value);

                setState(state);
              },
            },
            [
              ["option", {}, []],
              ["option", {}, "SAME_DAY"],
              ["option", {}, "SAME_DAY_SUNRISE"],
              ["option", {}, "SAME_DAY_AM"],
            ],
          ],
        ],
      ])
    );
  }

  setState(state);
};

const savePreviewToJobs = () => {
  let state = getState();
  state.jobs = state.previews ? state.previews : [];
  setState(state);
};

const buildQueueTable = () => {
  const queueTableBody = document.querySelector("#queue-table-body");

  if (!queueTableBody) {
    logMessage("Error: Can't find the queue table in the DOM");
    return;
  }

  let child: ChildNode | null;
  while ((child = queueTableBody.firstChild) !== null) {
    queueTableBody.removeChild(child);
  }

  const state = getState();

  state.jobs.forEach((job) => {
    queueTableBody.appendChild(
      html([
        "tr",
        {},
        [
          ["td", {}, job.station],
          ["td", {}, `${job.tbas.length} TBAs`],
          ["td", {}, job.cluster],
        ],
      ])
    );
  });
};

const emptyJobs = () => {
  const state = getState();
  state.jobs = [];
  setState(state);
};

const buildLogsTable = () => {
  const logsTableBody = document.querySelector("#logs-table-body");

  if (!logsTableBody) {
    logMessage("ERROR: Can't find logs-table-body in the DOM");
    return;
  }

  let child: ChildNode | null;
  while ((child = logsTableBody.firstChild) !== null) {
    logsTableBody.removeChild(child);
  }

  const logs = getLogs();

  logs.forEach((log) => {
    logsTableBody.appendChild(
      html([
        "tr",
        {},
        [
          [
            "td",
            { class: `severity-${log.severity.toLocaleLowerCase()}` },
            `${new Date(log.time).toLocaleString()}: ${log.message}`,
          ],
        ],
      ])
    );
  });
};

const emptyLogs = () => {
  setLogs([]);
};

const attachAutoCT = (parent: Element) => {
  let autoCTMarkup = html([
    "div",
    { id: "auto-ct-container" },
    [
      [
        "button",
        { id: "show-hide-button", onclick: toggleAutoCTVisibility },
        "bulk transfer",
      ],
      [
        "section",
        { id: "hidable-auto-ct-section", class: "hidden" },
        [
          ["h2", {}, "Transfers"],
          ["p", {}, "Enter a tab-separated list of:"],
          [
            "ul",
            {},
            [
              ["li", {}, [["Station"], ["kbd", {}, "TAB"], ["TBA"]]],
              [
                "li",
                {},
                [
                  ["Station"],
                  ["kbd", {}, "TAB"],
                  ["TBA"],
                  ["kbd", {}, "TAB"],
                  ["Cluster"],
                ],
              ],
            ],
          ],
          [
            "div",
            { id: "bulk-transfer-section-hidable" },
            [
              [
                "textarea",
                {
                  id: "transfer-input",
                  cols: "42",
                  rows: "20",
                  resizable: "false",
                  oninput: (e: InputEvent) => {
                    const { target } = e;
                    if (!target) return;
                    let stationMap = parseInputToMap(
                      (target as HTMLTextAreaElement).value
                    );
                    buildPreviewList(stationMap);
                  },
                },
                [],
              ],
              ["h2", {}, "Preview"],
              ["ul", { id: "transfer-list" }, []],
              [
                "button",
                {
                  onclick: () => {
                    savePreviewToJobs();
                    buildQueueTable();
                  },
                },
                "Save to Queue",
              ],
              ["h2", {}, "Queue"],
              [
                "table",
                { id: "queue-table" },
                [
                  [
                    "thead",
                    {},
                    [
                      ["td", {}, "Station"],
                      ["td", {}, "TBAs"],
                      ["td", {}, "Cluster"],
                    ],
                  ],
                  ["tbody", { id: "queue-table-body" }, []],
                ],
              ],
              ["button", {}, "Start AutoCT"],
              ["button", {}, "Download"],
              [
                "button",
                {
                  onclick: () => {
                    emptyJobs();
                    buildQueueTable();
                  },
                },
                "Clear Queue",
              ],
              ["h2", {}, "Logs"],
              [
                "select",
                {},
                [
                  ["option", {}, "All"],
                  ["option", {}, "Error"],
                  ["option", {}, "Successful"],
                ],
              ],
              [
                "div",
                { id: "logs-table-container" },
                [
                  [
                    "table",
                    { id: "logs-table" },
                    [
                      ["thead", {}, [["td", {}, "Message"]]],
                      ["tbody", { id: "logs-table-body" }, []],
                    ],
                  ],
                ],
              ],
              ["button", { onclick: buildLogsTable }, "Refresh Logs"],
              ["button", {}, "Download"],
              [
                "button",
                {
                  onclick: () => {
                    emptyLogs();
                    buildLogsTable();
                  },
                },
                "Clear Logs",
              ],
            ],
          ],
        ],
      ],
    ],
  ]);

  parent.appendChild(autoCTMarkup);

  return autoCTMarkup;
};

(async () => {
  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.target) {
        const ctContainer = document.querySelector("#submit-mrc");
        if (!ctContainer) return;

        // Check if autoct is already attached
        let autoCtContainer = ctContainer.querySelector("#auto-ct-container");

        if (!autoCtContainer) {
          autoCtContainer = attachAutoCT(ctContainer) as HTMLElement;
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

  // let state = getState();

  // // Not running
  // if (state.status === "IDLE" || state.status === "STOPPED") {
  //   return;
  // }

  // // All jobs complete, stop running
  // if (state.jobs.length === 0) {
  //   state.status = "IDLE";
  //   setState(state);
  //   logMessage("FINISHED");
  //   return;
  // }

  // if (getLogs().length === 0) {
  //   logMessage("STARTING");
  // }

  // let currentJob = state.jobs[0];
  // const stationCTUrl = `${RTW1_CT_BASE_URL}${currentJob.station}`;

  // // if (currentJob.transfers.length === 0) {
  // //   logMessage(
  // //     `SKIPPING current job at ${currentJob.station} since there are no transfers to perform`
  // //   );
  // //   state.jobs.shift();
  // //   setState(state);
  // //   location.reload();
  // //   return;
  // // }

  // if (location.href !== stationCTUrl) {
  //   logMessage(`NAVIGATING to ${currentJob.station} at ${stationCTUrl}`);
  //   location.replace(stationCTUrl);
  //   return;
  // }

  // // Transfer TBAs
  // logMessage(
  //   `TRANSFERRING ${currentJob.tbas.length} TBAs to ${currentJob.cluster} at ${currentJob.station}`
  // );

  // await sleep(5000);
  // // TODO: perform transfer
  // // TODO: Save errored TBAs
  // logMessage(
  //   `COMPLETED TRANSFER of ${currentJob.tbas.length} TBAS to ${currentJob.cluster} at ${currentJob.station}`
  // );

  // state.jobs.shift();
  // setState(state);

  // setState(state);

  // const nextJob = state.jobs[0];

  // if (!nextJob) {
  //   state.status = "IDLE";
  //   setState(state);
  //   logMessage("FINISHED");
  //   return;
  // }

  // const nextStationCTUrl = `${RTW1_CT_BASE_URL}${nextJob.station}`;
  // logMessage(`NAVIGATING to ${nextJob.station} at ${nextStationCTUrl}`);
  // location.replace(nextStationCTUrl);
})();
