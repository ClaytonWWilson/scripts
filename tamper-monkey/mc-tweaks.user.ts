// ==UserScript==
// @name         MC-Tweaks
// @version      1.1.1
// @description  Various tweaks and improvements to Mission Control including task notifications and higher visibility on new tasks
// @match        https://na-mc-execute.corp.amazon.com/*
// @iconURL      https://raw.githubusercontent.com/ClaytonWWilson/scripts/master/tamper-monkey/icons/mc-icon-200x200.png
// @icon64URL    https://raw.githubusercontent.com/ClaytonWWilson/scripts/master/tamper-monkey/icons/mc-icon-64x64.png
// @run-at       document-start
// @author       Clayton Wilson (eclawils)
// @namespace    mailto:eclawils@amazon.com
// @website      https://github.com/ClaytonWWilson
// @supportURL   https://github.com/ClaytonWWilson/scripts/issues
// @updateURL    https://github.com/ClaytonWWilson/scripts/releases/latest/download/mc-tweaks.user.js
// @downloadURL  https://github.com/ClaytonWWilson/scripts/releases/latest/download/mc-tweaks.user.js
// @grant        GM_addStyle
// ==/UserScript==

const MISSION_CONTROL_ICON =
  "https://d3fyhn76ojkw8f.cloudfront.net/static/Website/favicon.ico";

// Display a desktop notification
const showNotification = (title: string, body: string) => {
  new Notification(title, {
    body: body,
    icon: MISSION_CONTROL_ICON,
    renotify: true,
    tag: "MC",
  });
};

(() => {
  "use strict";

  const ignored = new Map<string, boolean>();

  // css for color flashing
  //@ts-ignore
  GM_addStyle(`
    .flashing {
        animation: flashing 2s infinite;
    }

    @keyframes flashing {
      0% {
        background-color: orange;
      }

      50% {
        background-color: red;
      }

      100% {
        background-color: orange;
      }
    }
  `);

  Notification.requestPermission()
    .then((permission) =>
      console.log(`Notification permissions are ${permission}`)
    )
    .catch((err) => console.error(err));

  // HTML class for tasks in MC
  const taskClassName = "exceptionItem";

  let counter = 1;
  setInterval(() => {
    const tasks = document.getElementsByClassName(taskClassName);

    // Task list is empty
    if (tasks === undefined || tasks === null || tasks.length == 0) {
      return;
    }

    // Set all ignored tasks to false by default to track which tasks are complete
    ignored.forEach((_val, taskID) => {
      ignored.set(taskID, false);
    });

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      let taskID = task.getAttribute("data-id");

      // ID was not found, add a new one
      if (taskID === null) {
        taskID = (counter++).toString();
        task.setAttribute("data-id", taskID);
      }

      // Check if this task has been processed already
      if (ignored.get(taskID) !== undefined) {
        ignored.set(taskID, true);
        continue;
      }

      // OnClick listener to remove the flashing css
      task.addEventListener("click", () => {
        task.classList.remove("flashing");
      });

      // Add flashing css class
      task.classList.add("flashing");

      // Show a desktop notification
      if (Notification.permission === "granted") {
        showNotification("New Task", `Task #${taskID}`);
      } else if (Notification.permission === "denied") {
        console.error("Notification permissions are denied.");
      } else {
        // If permissions have not been granted or denied, then try requesting permissions again
        Notification.requestPermission()
          .then((permission) => {
            if (permission === "granted") {
              // Incorrectly says that taskID could be null
              showNotification("New Task", `Task #${taskID}`);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }

      // Set all found tasks to ignored
      ignored.set(taskID, true);
    }

    // If task is false, then it was not found in MC, so remove it from ignored list
    ignored.forEach((present, taskID) => {
      if (!present) {
        ignored.delete(taskID);
      }
    });
  }, 500);
})();

// FEATURE: Add configuration to disable flashing and/or notifications
// FEATURE: Track # of completed tasks for the day
// FEATURE: Space out icons, add tooltips, and make them larger
