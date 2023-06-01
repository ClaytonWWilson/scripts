// ==UserScript==
// @name         Chime-Tweaks
// @namespace    mailto:eclawils@amazon.com
// @version      0.1
// @description  Various tweaks and improvements to Chime Web
// @author       Clayton Wilson
// @match        app.chime.aws/*
// @icon         none
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js
// @run-at   document-end
// ==/UserScript==

const removeAllChildNodes = (parent: HTMLElement) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

const selectListItems = (
  list: NodeListOf<HTMLInputElement>,
  selector: "all" | "none" | "stations"
) => {
  switch (selector) {
    case "all":
      list.forEach((item) => {
        item.checked = true;
      });
      break;
    case "none":
      list.forEach((item) => {
        item.checked = false;
      });
      break;
    case "stations":
      list.forEach((item) => {
        if (
          // Room names are fucked
          item.name
            .trim()
            .match(
              /^(AMXL)?.?[A-Z]{3}[1-9]{1}.?(-|–).?.Central[\s]?Ops.?(-|–).?[A-Za-z]+$/g
            ) ||
          item.name === "DON3 - East - Central Ops"
        ) {
          item.checked = true;
        }
      });
      break;
  }
};

(() => {
  // @ts-ignore
  GM_addStyle(`
  .modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transform: scale(1.1);
    transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
  }

  .modal-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      padding: 1rem 1.5rem;
      width: 24rem;
      border-radius: 0.5rem;
      height: 70vh;
  }

  .close-button {
      float: right;
      width: 1.5rem;
      line-height: 1.5rem;
      text-align: center;
      cursor: pointer;
      border-radius: 0.25rem;
      background-color: lightgray;
  }

  .close-button:hover {
      background-color: darkgray;
  }

  .show-modal {
      opacity: 1;
      visibility: visible;
      transform: scale(1.0);
      transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
  }

  #station-list {
    height: 50vh;
    overflow: hidden;
    overflow-y: scroll;
  }

  #selector-btn-container {
    display: flex;
    margin-top: 2px;
    margin-bottom: 2px;
  }

  #confirm-btn {
    margin-top: 2px;
  }

  #get-stations-btn, #select-stations-btn, #select-all-btn, #select-none-btn, #confirm-btn {
    color: lightgray;
  }
  `);

  type ChimeRoom = {
    ActiveRoomChannel: string;
    BackgroundRoomChannel: string;
    Channel: string;
    CreatedOn: string;
    CreatorId: string;
    CreatorIdentity: ChimeRoomCreatorIdentity;
    LastMentioned: string | null;
    LastRead: string;
    LastSent: string;
    Locked: null;
    MessageCount: number;
    Name: string;
    Open: boolean;
    Preferences: ChimeRoomPreferences;
    Privacy: string;
    RoomId: string;
    Type: string;
    UpdatedOn: string;
    Visibility: "hidden" | "visible";
    WorkTalkAccountId: string;
  };

  type ChimeRoomCreatorIdentity = {
    DisplayName: string;
    Email: string;
    FullName: string;
    LastDelivered: string | null;
    LastRead: string | null;
    PresenceChannel: string;
    ProfileId: string;
    ProfileType: string;
    Username: string | null;
    WorkTalkAccountId: string;
  };

  type ChimeRoomPreferences = {
    NotificationPreferences: ChimeRoomNotificationsPreferences;
  };

  type ChimeRoomNotificationsPreferences = {
    DesktopNotificationPreferences: string;
    MobileNotificationPreferences: string;
  };

  // const hideMemberList = true;
  // const shrinkTopBar = true;
  // const shrinkRoomList = true;
  const getStationsFromApi = async (apiKey: string) => {
    const roomsUrl = "https://api.express.ue1.app.chime.aws/msg/rooms/";

    let next: string | null = "";
    const chimeRooms = [] as ChimeRoom[];

    // Keep requesting rooms until all have been retrieved
    while (next !== null && next !== undefined) {
      // @ts-ignore
      await axios
        .get(roomsUrl, {
          headers: {
            "x-chime-auth-token": apiKey,
          },
          params: {
            "next-token": next,
          },
        })
        // @ts-ignore
        .then((res) => {
          console.log(res);
          const apiResponse = res.data;

          chimeRooms.push(...apiResponse.Rooms);
          next = apiResponse.NextToken?.trim() as string;
        })
        // @ts-ignore
        .catch((err) => {
          console.log(err);
          console.log("rejected");
          next = null;
          // reject(err);
          return;
        });
      // console.log("next");
    }

    const visibleRooms = [] as ChimeRoom[];

    for (let i = 0; i < chimeRooms.length; i++) {
      if (chimeRooms[i].Visibility == "hidden") continue;

      visibleRooms.push(chimeRooms[i]);
    }

    return visibleRooms;
  };

  const hideRoomWithApi = (apiKey: string, roomId: string): Promise<any> => {
    const roomUpdateUrl = "https://api.express.ue1.app.chime.aws/msg/rooms/";
    // @ts-ignore
    return axios.post(
      `${roomUpdateUrl}${roomId}`,
      {
        RoomId: roomId,
        Visibility: "hidden",
      },
      {
        headers: {
          "x-chime-auth-token": apiKey,
        },
      }
    );
  };

  const interval = setInterval(() => {
    const topBar = document.querySelector(".ChatContainer__top.webContainer");

    // if (topBar == null || memberList == null || roomList == null) {
    if (topBar == null) {
      console.log("Cant find bar");
      return;
    }

    clearInterval(interval);

    const hideRoomsButton = document.createElement("span");

    hideRoomsButton.innerHTML = `
      <span id="hide-my-rooms">
        <button class="outlook__button outlook__button--default _3Qdm7kDcXZkFyvRiDHxI7m ChatContainer__headerIcon ChatMessage__nonCopyable _6r72YEzgxJnG7jGGxa74i _3XyrA5QGUz0NqaFXFsRq8d" data-testid="roomNotificationButton" aria-label="Notification Settings: Normal" type="button">
          <span class="ch-icon _2xCR-KH821nE_g8TcMukUv _1ujIO6VidjhA0Jx5NJDi64" data-testid="button-icon">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="0,0,256,256"><g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M7,4c-2.757,0 -5,2.243 -5,5v24c0,2.757 2.243,5 5,5h4.14063c0.339,2.895 -0.5153,4.85858 -2.6543,6.14258c-0.385,0.231 -0.56922,0.692 -0.44922,1.125c0.119,0.433 0.51289,0.73242 0.96289,0.73242c2.56,0 8.70759,-0.795 11.68359,-8h7.49609c0.116,-0.689 0.29058,-1.356 0.51758,-2h-8.69727c-0.419,0 -0.79445,0.2613 -0.93945,0.6543c-1.641,4.476 -4.64161,6.25545 -7.09961,6.93945c1.181,-1.749 1.52444,-4.01544 1.02344,-6.77344c-0.087,-0.475 -0.50137,-0.82031 -0.98437,-0.82031h-5c-1.654,0 -3,-1.346 -3,-3v-24c0,-1.654 1.346,-3 3,-3h36c1.654,0 3,1.346 3,3v20.61719c0.718,0.416 1.386,0.90508 2,1.45508v-22.07227c0,-2.757 -2.243,-5 -5,-5zM40,30c-5.5,0 -10,4.5 -10,10c0,5.5 4.5,10 10,10c5.5,0 10,-4.5 10,-10c0,-5.5 -4.5,-10 -10,-10zM40,32c4.4,0 8,3.6 8,8c0,4.4 -3.6,8 -8,8c-4.4,0 -8,-3.6 -8,-8c0,-4.4 3.6,-8 8,-8zM36.5,35.5c-0.25,0 -0.49922,0.10078 -0.69922,0.30078c-0.4,0.4 -0.4,0.99844 0,1.39844l2.79883,2.80078l-2.79883,2.80078c-0.4,0.4 -0.4,0.99844 0,1.39844c0.2,0.2 0.49922,0.30078 0.69922,0.30078c0.2,0 0.49922,-0.10078 0.69922,-0.30078l2.80078,-2.79883l2.80078,2.79883c0.2,0.2 0.49922,0.30078 0.69922,0.30078c0.2,0 0.49922,-0.10078 0.69922,-0.30078c0.4,-0.4 0.4,-0.99844 0,-1.39844l-2.79883,-2.80078l2.79883,-2.80078c0.4,-0.4 0.4,-0.99844 0,-1.39844c-0.4,-0.4 -0.99844,-0.4 -1.39844,0l-2.80078,2.79883l-2.80078,-2.79883c-0.2,-0.2 -0.44922,-0.30078 -0.69922,-0.30078z"></path></g></g></svg>
          </span>
          <span class="ch-label" data-testid="button-label">aaaaaa</span>
        </button>
      </span>
    `;

    hideRoomsButton.setAttribute(
      "style",
      "margin-left: 5px; margin-top: -3px;"
    );
    // configBtn.style = "margin-left: 5px; margin-top: -3px;";

    const modal = document.createElement("div");
    modal.className = "modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const closeModalBtn = document.createElement("span");
    closeModalBtn.className = "close-button";
    closeModalBtn.innerText = "x";

    const modalText = document.createElement("h4");
    modalText.innerText = "Select which stations you want to hide";

    const stationListContainer = document.createElement("div");
    // const stationListData = getStationsFromApi();
    stationListContainer.innerHTML = `
      <button id="get-stations-btn">Get stations</button>
      <div id="selector-btn-container">
        <button id="select-stations-btn" disabled>Select stations</button>
        <button id="select-all-btn" disabled>Select all</button>
        <button id="select-none-btn" disabled>Select none</button>
      </div>
      <ul id="station-list" style="list-style-type: none;"></ul>
      <button id="confirm-btn" disabled>Confirm</button>
    `;

    modalContent.appendChild(closeModalBtn);
    modalContent.appendChild(modalText);
    modalContent.appendChild(stationListContainer);

    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    // Declarations for managed elements
    const confirmBtn = document.getElementById(
      "confirm-btn"
    ) as HTMLButtonElement;
    const getStationsBtn = document.getElementById(
      "get-stations-btn"
    ) as HTMLButtonElement;
    const stationListEl = document.getElementById(
      "station-list"
    ) as HTMLUListElement;
    const selectStationsBtn = document.getElementById(
      "select-stations-btn"
    ) as HTMLButtonElement;
    const selectAllBtn = document.getElementById(
      "select-all-btn"
    ) as HTMLButtonElement;
    const selectNoneBtn = document.getElementById(
      "select-none-btn"
    ) as HTMLButtonElement;

    if (
      !confirmBtn ||
      !getStationsBtn ||
      !stationListEl ||
      !selectStationsBtn ||
      !selectAllBtn ||
      !selectNoneBtn
    ) {
      console.error(
        "Could not find a mounted element",
        "confirmBtn",
        confirmBtn,
        "getStationsBtn",
        getStationsBtn,
        "stationListEl",
        stationListEl,
        "selectStationsBtn",
        selectStationsBtn,
        "selectAllBtn",
        selectAllBtn,
        "selectNoneBtn",
        selectNoneBtn
      );
      return;
    }

    const toggleModal = () => {
      modal.classList.toggle("show-modal");
    };

    const windowOnClick = (event: any) => {
      if (event.target === modal) {
        toggleModal();
      }
    };

    const fetchStationsAndMount = async () => {
      getStationsBtn.disabled = true;

      // Clear items chime rooms from the current list
      removeAllChildNodes(stationListEl);

      const apiKey = `_aws_wt_session=${localStorage
        .getItem("X-Chime-Auth-Token")
        ?.replace(/\"/g, "")}`;

      const chimeRooms = await getStationsFromApi(apiKey);

      chimeRooms.forEach((chimeRoom) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <div style="display: flex">
            <input type="checkbox" value="${chimeRoom.RoomId}" name="${chimeRoom.Name}" id="station-hide-checkbox">
            <p>${chimeRoom.Name}</p>
          </div>
        `;
        stationListEl.appendChild(listItem);
      });

      getStationsBtn.disabled = false;
      confirmBtn.disabled = false;
      selectStationsBtn.disabled = false;
      selectAllBtn.disabled = false;
      selectNoneBtn.disabled = false;
    };

    const hideStations = async () => {
      confirmBtn.disabled = true;

      const apiKey = `_aws_wt_session=${localStorage
        .getItem("X-Chime-Auth-Token")
        ?.replace(/\"/g, "")}`;

      const stationCheckboxes = document.querySelectorAll(
        "#station-hide-checkbox"
      ) as NodeListOf<HTMLInputElement>;

      let promises: Promise<void>[] = [];

      stationCheckboxes.forEach((stationCheckbox) => {
        if (stationCheckbox.checked) {
          promises.push(hideRoomWithApi(apiKey, stationCheckbox.value));
        }
      });

      if (promises.length == 0) {
        confirmBtn.disabled = false;
        return;
      }

      let retryStations: string[] = [];
      let results = await Promise.allSettled(promises);
      results.forEach((result) => {
        if (result.status === "rejected") {
          retryStations.push(JSON.parse(result.reason.config.data).RoomId);
        }
      });

      let counter = 0;
      while (retryStations.length > 0 && counter < 3) {
        promises = [];

        retryStations.forEach((station) => {
          promises.push(hideRoomWithApi(apiKey, station));
        });

        results = await Promise.allSettled(promises);
        retryStations = [];

        results.forEach((result) => {
          if (result.status === "rejected") {
            retryStations.push(JSON.parse(result.reason.config.data).RoomId);
          }
        });

        counter++;
      }

      fetchStationsAndMount().then(() => {
        confirmBtn.disabled = false;
      });
    };

    // Event listeners for all managed elements
    hideRoomsButton.addEventListener("click", toggleModal);
    closeModalBtn.addEventListener("click", toggleModal);
    window.addEventListener("click", windowOnClick);
    confirmBtn.addEventListener("click", hideStations);
    getStationsBtn.addEventListener("click", fetchStationsAndMount);
    selectStationsBtn.addEventListener("click", () =>
      selectListItems(
        document.querySelectorAll("#station-hide-checkbox"),
        "stations"
      )
    );
    selectAllBtn.addEventListener("click", () =>
      selectListItems(
        document.querySelectorAll("#station-hide-checkbox"),
        "all"
      )
    );
    selectNoneBtn.addEventListener("click", () =>
      selectListItems(
        document.querySelectorAll("#station-hide-checkbox"),
        "none"
      )
    );

    topBar.appendChild(hideRoomsButton);
  }, 50);
})();

// BUG: Button likes to unmount from top bar. Need to repeatedly check if it's not there
