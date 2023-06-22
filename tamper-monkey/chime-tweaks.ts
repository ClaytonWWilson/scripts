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

.show-modal {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
  z-index: 2;
}

.modal-content {
  /*     display: grid; */
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 3rem 1fr 1fr 1fr 1fr;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 1rem 1.5rem;
  width: 26rem;
  border-radius: 0.5rem;
  height: 80%;
  justify-items: center;
}

.modal-top-bar {
/*   border-bottom: 1px solid black; */
  width: 100%;
  height: 3rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gid-template-rows: 1fr;
}

#back-button {
  visibility: hidden;
}

#fetch-channels-button {
  grid-column: 2/3;
  margin: auto;
}

.close-button {
  /*   float: right; */
  justify-self: right;
  width: 1.5rem;
  height: 1.5rem;
  line-height: 1.5rem;
  text-align: center;
  cursor: pointer;
  border-radius: 0.25rem;
  background-color: lightgray;
  grid-column: 3/4;
}

.close-button:hover {
  background-color: darkgray;
}

.view-mount {
  width: 100%;
  height: calc(100% - 3rem);
  border-top: 1px solid gray;
  padding-top: .5rem;
/*   overflow: hidden; */
}

.modal-over-view {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(10, 45px);
}

#hide-channels-button {
  grid-row: 2/3;
  grid-column: 2/5;
  margin: auto;
}

#mark-read-button {
  grid-row: 3/4;
  grid-column: 2/5;
  margin: auto;
}

#mass-invite-button {
  grid-row: 4/5;
  grid-column: 2/5;
  margin: auto;
}

#mass-message-button {
  grid-row: 5/6;
  grid-column: 2/5;
  margin: auto;
}

.span-button {
  display: flex;
  user-select: none;
  cursor: pointer;
  border-radius: 0.25rem;
/*   border: solid 1px green; */
  background-color: lightgray;
  width: fit-content;
  height: fit-content;
  padding: 0.25rem;
}

.disabled-button {
  cursor: auto;
  background-color: darkgray;
  
}

.large-button {
  font-size: 20pt;
}

.chime-room-list {
  border: 1px solid gray;
  padding-left: 1rem;
  height: calc(100% - 8rem - 3.5rem);
  overflow: hidden;
  overflow-y: scroll;
  list-style-type: none;
  margin-top: .5rem;
  margin-bottom: .5rem;
}

.chime-room-list > li {
  margin-bottom: 5px;
}

.li-text {
  user-select: none;
}

.modal-footer {
/*   border: 2px solid orange; */
  height: 8rem;
}

.modal-hide-channels-view {
/*   border: 2px solid green; */
  width: 100%;
  height: 100%;
}

.modal-mark-read-view {
/*   border: 2px solid green; */
  width: 100%;
  height: 100%;
}

.modal-mass-invite-view {
/*   border: 2px solid green; */
  width: 100%;
  height: 100%;
}

.modal-mass-message-view {
/*   border: 2px solid green; */
  width: 100%;
  height: 100%;
}

.selector-buttons-container {
  display: flex;
/*   border: 2px solid orange; */
}

.selector-buttons-container > span {
  margin-right: 5px;
}

.confirm-button-container {
/*   border: 2px solid yellow; */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

#confirm-button {
  grid-column: 2/3;
  justify-self: center;
}

.user-entry-container {
/*   border: 2px solid tan; */
  margin-bottom: .5rem;
}

.message-entry-container {
/*   border: 2px solid red; */
  display: flex;
  flex-direction: column;
  text-align: center;
}

#mass-message-input {
  resize: none;
}


`);

let chimeButton: HTMLSpanElement;

let overView: HTMLDivElement;
let hideChannelsView: HTMLDivElement;
let markReadView: HTMLDivElement;
let massInviteView: HTMLDivElement;
let massMessageView: HTMLDivElement;

const fetchAndAttachChannels = async () => {
  let apiToken = localStorage.getItem("X-Chime-Auth-Token");

  if (!apiToken) {
    console.error("API token is missing from browser storage.");
    return;
  }

  apiToken = `_aws_wt_session=${apiToken}`;

  const chimeRooms = await getChannelsFromApi(apiToken);

  const hideChannelsViewList = hideChannelsView.querySelector(
    "#hide-channels-chime-room-list"
  ) as HTMLUListElement;
  const markReadViewList = markReadView.querySelector(
    "#mark-read-chime-room-list"
  ) as HTMLUListElement;
  const massInviteViewList = massInviteView.querySelector(
    "#mass-invite-chime-room-list"
  ) as HTMLUListElement;
  const massMessageViewList = massMessageView.querySelector(
    "#mass-message-chime-room-list"
  ) as HTMLUListElement;

  if (
    !hideChannelsViewList ||
    !markReadViewList ||
    !massInviteViewList ||
    !massMessageViewList
  ) {
    console.error("Can't find one of the channel lists from one of the views");
    return;
  }

  attachRoomsToList(
    hideChannelsViewList,
    chimeRooms.filter((room) => {
      return room.Visibility === "visible";
    })
  );
  attachRoomsToList(markReadViewList, chimeRooms);
  attachRoomsToList(massInviteViewList, chimeRooms);
  attachRoomsToList(massMessageViewList, chimeRooms);

  const hideChannelsButton = overView.querySelector(
    "#hide-channels-button"
  ) as HTMLSpanElement;
  const markReadButton = overView.querySelector(
    "#mark-read-button"
  ) as HTMLSpanElement;
  const massInviteButton = overView.querySelector(
    "#mass-invite-button"
  ) as HTMLSpanElement;
  const massMessageButton = overView.querySelector(
    "#mass-message-button"
  ) as HTMLSpanElement;

  enableButton(hideChannelsButton);
  enableButton(markReadButton);
  enableButton(massInviteButton);
  enableButton(massMessageButton);
};

const attachRoomsToList = (ul: HTMLUListElement, rooms: ChimeRoom[]) => {
  const len = ul.children.length;
  for (let i = 0; i < len; i++) {
    ul.removeChild(ul.children[0]);
  }
  rooms.forEach((room) => {
    const roomLi = document.createElement("li");

    const roomLiDiv = document.createElement("div");
    roomLiDiv.setAttribute("style", "display: flex;");

    const roomLiInput = document.createElement("input");
    roomLiInput.setAttribute("type", "checkbox");
    roomLiInput.setAttribute("name", room.Name);
    roomLiInput.setAttribute("value", room.RoomId);

    const roomLiSpan = document.createElement("span");
    roomLiSpan.setAttribute("class", "li-text");
    roomLiSpan.innerHTML = room.Name;
    roomLiSpan.addEventListener("click", () => {
      if (roomLiInput.checked) {
        roomLiInput.checked = false;
      } else {
        roomLiInput.checked = true;
      }
    });

    roomLiDiv.appendChild(roomLiInput);
    roomLiDiv.appendChild(roomLiSpan);
    roomLi.appendChild(roomLiDiv);

    ul.appendChild(roomLi);
  });
};

const enableButton = (button: HTMLSpanElement) => {
  button.classList.remove("disabled-button");
};

const getChannelsFromApi = async (apiToken: string) => {
  const roomsUrl = "https://api.express.ue1.app.chime.aws/msg/rooms/";

  let next: string | null = "";
  const chimeRooms = [] as ChimeRoom[];

  // Keep requesting rooms until all have been retrieved
  while (next !== null && next !== undefined) {
    // @ts-ignore
    await axios
      .get(roomsUrl, {
        headers: {
          "x-chime-auth-token": apiToken,
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

  return chimeRooms;

  // const visibleRooms = [] as ChimeRoom[];

  // for (let i = 0; i < chimeRooms.length; i++) {
  //   if (chimeRooms[i].Visibility == "hidden") continue;

  //   visibleRooms.push(chimeRooms[i]);
  // }

  // return visibleRooms;
};

const hideRoomWithApi = (apiToken: string, roomId: string): Promise<any> => {
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
        "x-chime-auth-token": apiToken,
      },
    }
  );
};

const getChimeManagementButton = () => {
  if (chimeButton) {
    return chimeButton;
  }

  const chimeManagementButton = document.createElement("span");
  chimeManagementButton.innerHTML = `
    <span id="chime-management-button">
      <button class="trigger outlook__button outlook__button--default _3Qdm7kDcXZkFyvRiDHxI7m ChatContainer__headerIcon ChatMessage__nonCopyable _6r72YEzgxJnG7jGGxa74i _3XyrA5QGUz0NqaFXFsRq8d" data-testid="roomNotificationButton" aria-label="Notification Settings: Normal" type="button">
        <span class="ch-icon _2xCR-KH821nE_g8TcMukUv _1ujIO6VidjhA0Jx5NJDi64" data-testid="button-icon">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="0,0,256,256"><g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M7,4c-2.757,0 -5,2.243 -5,5v24c0,2.757 2.243,5 5,5h4.14063c0.339,2.895 -0.5153,4.85858 -2.6543,6.14258c-0.385,0.231 -0.56922,0.692 -0.44922,1.125c0.119,0.433 0.51289,0.73242 0.96289,0.73242c2.56,0 8.70759,-0.795 11.68359,-8h7.49609c0.116,-0.689 0.29058,-1.356 0.51758,-2h-8.69727c-0.419,0 -0.79445,0.2613 -0.93945,0.6543c-1.641,4.476 -4.64161,6.25545 -7.09961,6.93945c1.181,-1.749 1.52444,-4.01544 1.02344,-6.77344c-0.087,-0.475 -0.50137,-0.82031 -0.98437,-0.82031h-5c-1.654,0 -3,-1.346 -3,-3v-24c0,-1.654 1.346,-3 3,-3h36c1.654,0 3,1.346 3,3v20.61719c0.718,0.416 1.386,0.90508 2,1.45508v-22.07227c0,-2.757 -2.243,-5 -5,-5zM40,30c-5.5,0 -10,4.5 -10,10c0,5.5 4.5,10 10,10c5.5,0 10,-4.5 10,-10c0,-5.5 -4.5,-10 -10,-10zM40,32c4.4,0 8,3.6 8,8c0,4.4 -3.6,8 -8,8c-4.4,0 -8,-3.6 -8,-8c0,-4.4 3.6,-8 8,-8zM36.5,35.5c-0.25,0 -0.49922,0.10078 -0.69922,0.30078c-0.4,0.4 -0.4,0.99844 0,1.39844l2.79883,2.80078l-2.79883,2.80078c-0.4,0.4 -0.4,0.99844 0,1.39844c0.2,0.2 0.49922,0.30078 0.69922,0.30078c0.2,0 0.49922,-0.10078 0.69922,-0.30078l2.80078,-2.79883l2.80078,2.79883c0.2,0.2 0.49922,0.30078 0.69922,0.30078c0.2,0 0.49922,-0.10078 0.69922,-0.30078c0.4,-0.4 0.4,-0.99844 0,-1.39844l-2.79883,-2.80078l2.79883,-2.80078c0.4,-0.4 0.4,-0.99844 0,-1.39844c-0.4,-0.4 -0.99844,-0.4 -1.39844,0l-2.80078,2.79883l-2.80078,-2.79883c-0.2,-0.2 -0.44922,-0.30078 -0.69922,-0.30078z"></path></g></g></svg>
        </span>
        <span class="ch-label" data-testid="button-label">aaaaaa</span>
      </button>
    </span>
  `;

  chimeManagementButton.setAttribute(
    "style",
    "margin-left: 5px; margin-top: -3px;"
  );

  chimeManagementButton.addEventListener("click", toggleModal);

  chimeButton = chimeManagementButton;

  return chimeManagementButton;
};

const createModal = () => {
  const modal = document.createElement("div");
  modal.setAttribute("class", "modal");
  modal.setAttribute("id", "modal");

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-top-bar">
        <span class="span-button" id="back-button">Back</span>
        <span class="span-button" id="fetch-channels-button">Fetch Channels</span>
        <span class="close-button">×</span>
      </div>
      <div class="view-mount" id="view-mount">
      </div>
    </div>
  `;

  const fetchChannelsButton = modal.querySelector("#fetch-channels-button");

  if (!fetchChannelsButton) {
    console.error("Can't find fetch channels button");
    return;
  }

  fetchChannelsButton.addEventListener("click", fetchAndAttachChannels);

  const closeButton = modal.querySelector(".close-button");

  if (!closeButton) {
    console.error("Can't find close buitton");
    return;
  }

  // Create all of the views
  overView = createOverView();
  hideChannelsView = createHideChannelsView();
  markReadView = createMarkReadView();
  massInviteView = createMassInviteView();
  massMessageView = createMassMessageView();

  if (
    !hideChannelsView ||
    !markReadView ||
    !massInviteView ||
    !massMessageView
  ) {
    console.error("Error creating a view. Abandoning modal creation");
    return;
  }

  // Connect the overview's buttons to each of the tool's views
  const backButton = modal.querySelector("#back-button");

  if (!backButton) {
    console.error("Can't find back button on modal");
    return;
  }

  const viewMount = modal.querySelector("#view-mount");

  if (!viewMount) {
    console.error("Can't find view mount on modal");
    return;
  }

  backButton.addEventListener("click", () => {
    mountView(viewMount, overView);
  });

  closeButton.addEventListener("click", () => {
    mountView(viewMount, overView);
    toggleModal();
  });

  const hideChannelsButton = overView.querySelector("#hide-channels-button");
  const markReadButton = overView.querySelector("#mark-read-button");
  const massInviteButton = overView.querySelector("#mass-invite-button");
  const massMessageButton = overView.querySelector("#mass-message-button");

  if (
    !hideChannelsButton ||
    !markReadButton ||
    !massInviteButton ||
    !massMessageButton
  ) {
    console.error("Unable to find one of the overview's buttons");
    console.log(
      hideChannelsButton,
      markReadButton,
      massInviteButton,
      !massMessageButton
    );
    return;
  }

  hideChannelsButton.addEventListener("click", () => {
    if (hideChannelsButton.classList.contains("disabled-button")) return;
    backButton.setAttribute("style", "visibility: visible;");
    mountView(viewMount, hideChannelsView);
  });

  markReadButton.addEventListener("click", () => {
    if (markReadButton.classList.contains("disabled-button")) return;
    backButton.setAttribute("style", "visibility: visible;");
    mountView(viewMount, markReadView);
  });

  massInviteButton.addEventListener("click", () => {
    if (massInviteButton.classList.contains("disabled-button")) return;
    backButton.setAttribute("style", "visibility: visible;");
    mountView(viewMount, massInviteView);
  });

  massMessageButton.addEventListener("click", () => {
    if (massMessageButton.classList.contains("disabled-button")) return;
    backButton.setAttribute("style", "visibility: visible;");
    mountView(viewMount, massMessageView);
  });

  viewMount.appendChild(overView);

  return modal;
};

const createOverView = () => {
  const overView = document.createElement("div");
  overView.setAttribute("class", "modal-over-view");
  overView.innerHTML =
    '<span class="span-button large-button disabled-button" id="hide-channels-button">Hide Channels</span><span class="span-button large-button disabled-button" id="mark-read-button">Mark Read</span><span class="span-button large-button disabled-button" id="mass-invite-button">Mass Invite</span><span class="span-button large-button disabled-button" id="mass-message-button">Mass Message</span>';

  return overView;
};

const createHideChannelsView = () => {
  const view = document.createElement("div");
  view.setAttribute("class", "modal-hide-channels-view");
  view.innerHTML =
    '<div class="selector-buttons-container"><span class="span-button" id="select-stations">Stations</span><span class="span-button" id="select-all">All</span><span class="span-button" id="select-none">None</span></div><ul class="chime-room-list" id="hide-channels-chime-room-list"></ul><div class="modal-footer"><div class="confirm-button-container"><span class="span-button" id="confirm-button">confirm</span></div></div>';

  const hideChannelsList = view.querySelector("#hide-channels-chime-room-list");

  if (!hideChannelsList) {
    console.error("Can't find the chime room list for view");
    return view;
  }

  view.querySelector("#select-stations")?.addEventListener("click", () => {
    selectChannelsInList(hideChannelsList, "stations");
  });

  view.querySelector("#select-all")?.addEventListener("click", () => {
    selectChannelsInList(hideChannelsList, "all");
  });

  view.querySelector("#select-none")?.addEventListener("click", () => {
    selectChannelsInList(hideChannelsList, "none");
  });

  return view;
};

const createMarkReadView = () => {
  const view = document.createElement("div");
  view.setAttribute("class", "modal-mark-read-view");
  view.innerHTML =
    '<div class="selector-buttons-container"><span class="span-button" id="select-stations">Stations</span><span class="span-button" id="select-all">All</span><span class="span-button" id="select-none">None</span></div><ul class="chime-room-list" id="mark-read-chime-room-list"></ul><div class="modal-footer"><div class="confirm-button-container"><span class="span-button" id="confirm-button">confirm</span></div></div>';

  const markReadList = view.querySelector("#mark-read-chime-room-list");

  if (!markReadList) {
    console.error("Can't find the chime room list for hideChannelsView");
    return view;
  }

  view.querySelector("#select-stations")?.addEventListener("click", () => {
    selectChannelsInList(markReadList, "stations");
  });

  view.querySelector("#select-all")?.addEventListener("click", () => {
    selectChannelsInList(markReadList, "all");
  });

  view.querySelector("#select-none")?.addEventListener("click", () => {
    selectChannelsInList(markReadList, "none");
  });

  return view;
};

const createMassInviteView = () => {
  const view = document.createElement("div");
  view.setAttribute("class", "modal-mass-invite-view");
  view.innerHTML =
    '<div class="selector-buttons-container"><span class="span-button" id="select-stations">Stations</span><span class="span-button" id="select-all">All</span><span class="span-button" id="select-none">None</span></div><ul class="chime-room-list" id="mass-invite-chime-room-list"></ul><div class="modal-footer"><div class="user-entry-container"><span>Username: </span><input id="username" /></div><div class="confirm-button-container"><span class="span-button" id="confirm-button">confirm</span></div></div>';

  const massInviteList = view.querySelector("#mass-invite-chime-room-list");

  if (!massInviteList) {
    console.error("Can't find the chime room list for hideChannelsView");
    return view;
  }

  view.querySelector("#select-stations")?.addEventListener("click", () => {
    selectChannelsInList(massInviteList, "stations");
  });

  view.querySelector("#select-all")?.addEventListener("click", () => {
    selectChannelsInList(massInviteList, "all");
  });

  view.querySelector("#select-none")?.addEventListener("click", () => {
    selectChannelsInList(massInviteList, "none");
  });

  return view;
};

const createMassMessageView = () => {
  const view = document.createElement("div");
  view.setAttribute("class", "modal-mass-message-view");
  view.innerHTML =
    '<div class="selector-buttons-container"><span class="span-button" id="select-stations">Stations</span><span class="span-button" id="select-all">All</span><span class="span-button" id="select-none">None</span></div><ul class="chime-room-list" id="mass-message-chime-room-list"></ul><div class="modal-footer"><div class="message-entry-container"><span>Message:</span><textarea id="mass-message-input" rows=5></textarea></div><div class="confirm-button-container"><span class="span-button" id="confirm-button">confirm</span></div></div>';

  const massMessageList = view.querySelector("#mass-message-chime-room-list");

  if (!massMessageList) {
    console.error("Can't find the chime room list for hideChannelsView");
    return view;
  }

  view.querySelector("#select-stations")?.addEventListener("click", () => {
    selectChannelsInList(massMessageList, "stations");
  });

  view.querySelector("#select-all")?.addEventListener("click", () => {
    selectChannelsInList(massMessageList, "all");
  });

  view.querySelector("#select-none")?.addEventListener("click", () => {
    selectChannelsInList(massMessageList, "none");
  });

  return view;
};

const selectChannelsInList = (ul: Element, selector: string) => {
  const checkboxes = ul.querySelectorAll("input");

  if (selector === "all") {
    for (const checkbox of checkboxes) {
      checkbox.checked = true;
    }
    return;
  }

  if (selector === "none") {
    for (const checkbox of checkboxes) {
      checkbox.checked = false;
    }
    return;
  }

  if (selector === "stations") {
    for (const checkbox of checkboxes) {
      const roomName = checkbox.getAttribute("name")?.trim();
      if (
        (roomName &&
          roomName.match(
            /^(AMXL)?.?[A-Z]{3}[1-9]{1}.?(-|–).?.Central[\s]?Ops.?(-|–).?[A-Za-z]+$/g
          )) ||
        roomName === "DON3 - East - Central Ops"
      ) {
        checkbox.checked = true;
      }
    }
    return;
  }
};

const toggleModal = () => {
  const modal = document.querySelector("#modal");
  const backButton = document.querySelector("#back-button");
  const viewMount = document.querySelector("#view-mount");
  // const overView = document.querySelector(".modal-over-view");

  if (!modal || !backButton || !viewMount || !overView) {
    console.error("Modal is not present in the document");
    console.log(modal, backButton, viewMount, overView);
    return;
  }

  modal.classList.toggle("show-modal");
  setTimeout(() => {
    backButton.setAttribute("style", "visibility: hidden;");
    mountView(viewMount, overView);
  }, 200);
};

const mountView = (mountPoint: Element, view: Element) => {
  mountPoint.removeChild(mountPoint.childNodes[1]);
  mountPoint.appendChild(view);
};

(() => {
  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.target) {
        const topBar = document.querySelector(
          ".ChatContainer__top.webContainer"
        );

        if (!topBar) return;

        // Check of chime button is attached to topbar and build and attach it again if it's not
        let chimeManagementButton = topBar.querySelector(
          "#chime-management-button"
        );

        if (!chimeManagementButton) {
          chimeManagementButton = getChimeManagementButton();

          topBar.appendChild(chimeManagementButton);
        }

        // Check if modal has been created yet
        let modal: Element | null | undefined =
          document.querySelector("#modal");

        if (!modal) {
          modal = createModal();

          if (!modal) return;
          document.body.appendChild(modal);

          window.addEventListener("click", (e) => {
            if (e.target === modal) {
              toggleModal();
            }
          });
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