// ==UserScript==
// @name         MC-Tweaks
// @namespace    mailto:eclawils@amazon.com
// @version      0.1
// @description  Various tweaks and improvements to Mission Control
// @author       Clayton Wilson
// @match        https://na-mc-execute.corp.amazon.com/*
// @icon         none
// @grant        GM_addStyle
// @run-at   document-start
// ==/UserScript==

const missionControlIcon =
  "https://d3fyhn76ojkw8f.cloudfront.net/static/Website/favicon.ico";

const showNotification = (title: string, body: string) => {
  const notification = new Notification(title, {
    body: body,
    icon: missionControlIcon,
    renotify: true,
    tag: "MC",
  });
};

(() => {
  "use strict";

  let ignored = new Map<string, boolean>();

  // CSS for color flashing
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
    .catch((err) => console.log(err));

  const taskClassName = "exceptionItem";

  // Stores onclicks for tasks, so an intermediate onclick function can be injected
  // let onClicks = new Map();

  setInterval(() => {
    const tasks = document.getElementsByClassName(taskClassName);

    if (tasks === undefined || tasks === null) {
      return;
    }

    // Set all ignored tasks to false by default to track which tasks are complete
    ignored.forEach((_val, taskID) => {
      ignored.set(taskID, false);
    });

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const taskParagraph = task.querySelector(
        "div > div > div:nth-child(2) > div > p"
      );

      if (taskParagraph === null) {
        console.log("Could not find task ID");
        return;
      }

      const taskID = taskParagraph.textContent;

      if (taskID === null) {
        console.log("Could not find task ID");
        return;
      }

      // Check if this task has been processed already
      if (ignored.get(taskID) !== undefined) {
        ignored.set(taskID, true);
        continue;
      }

      // Inject a new onclick that clears the flashing css. Restore and call
      // the original onclick when the task is click for the first time.
      // onClicks.set(taskID, task.onclick);
      // task.onclick = () => {
      //   task.classList.remove("flashing");
      //   task.onclick = onClicks[taskID];
      //   task.onclick();
      // };

      task.addEventListener("click", () => {
        task.classList.remove("flashing");
      });

      // Add flashing css class
      task.classList.add("flashing");

      // Show a desktop notification
      if (Notification.permission === "granted") {
        showNotification("New Task", taskID);
      } else if (Notification.permission === "denied") {
        console.log("Notification permissions are denied.");
      } else {
        // If permissions have not been granted or denied, then try requesting permissions
        Notification.requestPermission()
          .then((permission) => {
            if (permission === "granted") {
              showNotification("New Task", taskID);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }

      ignored.set(taskID, true);
    }

    // If task is false, then it is no longer in MC, so remove it from ignored
    ignored.forEach((present, taskID) => {
      if (!present) {
        ignored.delete(taskID);
      }
    });
  }, 500);
})();

// FEATURE: Add configuration to disable flashing and/or notifications
// TODO: log any errors
// BUG: Iterate over ignored items an check if they are still in queue instead of removing them based on time
