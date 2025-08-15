type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageUsage: number;
};

type StaticData = {
  totalStorage: number;
  cpuModel: string;
  totalMemoryGB: number;
};

type DataLDPlayersDB = {
  NoDataGridLD: number;
  LDPlayerGridLD: string;
  StatusAccGridLD: string;
  DateTimeGridLD: string;
  StatusGridLD: string;
  NameLineGridLD: string;
  FriendGridLD: string;
  GroupGridLD: string;
  PhoneGridLD: string;
  TokenGridLD: string;
  PhoneFileGridLD: string;
  CreateAt: string;
  LineKaiGridLD: string[];
};

type CreateLDPlayersDB = {
  NoDataGridLD: number;
  LDPlayerGridLD: string;
  DateTimeGridLD: string;
  StatusGridLD: string;
  PrefixGridLD: string;
};

type LineAccount = {
  id: number;
  type: string;
  lineId: string;
};

type TxtRow = {
  id: number;
  name: string;
  count: number;
  path: string;
  createAt: string;
};

// Define the shape of IPC events
type IpcEventMap = {
  // ===== Core Events =====
  statistics: { payload: Statistics; response: void };
  test: { payload: any; response: void };
  getStaticData: { payload: void; response: StaticData };

  // ===== LDPlayer Management =====
  browseLdInstancePath: { payload: void; response: boolean };
  callLdInstance: { payload: string; response: boolean };
  checkBanLdInstance: {
    payload: { ldName: string; accessToken: string };
    response: boolean;
  };
  createLdInstance: {
    payload: { prefix: string; count: number };
    response: string;
  };
  deleteLdInstance: { payload: string; response: boolean };
  deleteRowFromDB: { payload: string; response: boolean };
  fetchLdInstance: { payload: void; response: string[] };
  getDataCreateLDPlayers: { payload: void; response: CreateLDPlayersDB[] };
  getLDPlayersDB: { payload: void; response: DataLDPlayersDB[] };
  getLdInstancePath: { payload: void; response: string };
  getTokenLdInstance: { payload: string; response: boolean };
  moveSelectedLDPlayers: { payload: string[]; response: boolean };
  setLdInstancePath: { payload: string; response: boolean };

  // ===== Friends Management =====
  addFriends: {
    payload: {
      ldName: string;
      accessToken: string;
      target: number;
      phoneFile: string;
      privatePhone: string;
    };
    response: boolean;
  };
  findAndAddFriend: {
    payload: { accessToken: string; ldName: string; userId: string };
    response: boolean;
  };

  // ===== Chat / Group Management =====
  createChat: {
    payload: {
      accessToken: string;
      ldName: string;
      nameGroup: string;
      profile: string;
      searchId: string;
      message: string;
    };
    response: boolean;
  };
  mainCreateChat: {
    payload: {
      ldName: string;
      accessToken: string;
      nameGroup: string;
      searchId: string;
      profile: string;
    };
    response: boolean;
  };
  createChatCustom: {
    payload: {
      accessToken: string;
      ldName: string;
      nameGroup: string;
      profile: string;
      oaId: string;
      privateId: string;
    };
    response: boolean;
  };
  createChatSystem: {
    payload: {
      accessToken: string;
      ldName: string;
      nameGroup: string;
      oaId: string;
      privateId: string;
    };
    response: boolean;
  };
  inviteIntoChats: {
    payload: {
      ldName: string;
      accessToken: string;
      profile: string;
      nameGroup: string;
      oaId: string;
      privateId: string;
      message: string;
    };
    response: boolean;
  };

  // ===== File / Phone File Management =====
  deleteTxtFile: { payload: number; response: boolean };
  getTxtFiles: { payload: void; response: TxtRow[] };
  selectTextFile: {
    payload: void;
    response: { name: string; path: string; count: number };
  };
  saveTxtFile: {
    payload: { name: string; count: number; path: string };
    response: boolean;
  };
  updatePhoneFile: {
    payload: { ldName: string; fileName: string };
    response: string;
  };

  // ===== Account Management =====
  addAccount: {
    payload: { type: string; name: string; mid: string; status: boolean };
    response: boolean;
  };
  deleteAccount: { payload: string; response: boolean };
  getAccount: {
    payload: void;
    response: {
      id: number;
      type: string;
      name: string;
      status: boolean;
      createAt: string;
      mid: string;
    }[];
  };
  updateAccount: {
    payload: { name: string; type: string; mid: string; status: boolean };
    response: boolean;
  };

  // ===== Remembered Credentials =====
  deleteRememberedCredentials: { payload: void; response: boolean };
  getRememberedCredentials: {
    payload: void;
    response: { username: string; password: string } | null;
  };
  saveRememberedCredentials: {
    payload: { username: string; password: string };
    response: boolean;
  };

  // ===== Profile Management =====
  deleteProfile: { payload: string; response: boolean };
  getProfile: {
    payload: void;
    response: {
      id: number;
      name: string;
      path: string;
      status: boolean;
      createAt: string;
    }[];
  };
  selectImageFile: {
    payload: void;
    response: { name: string; path: string } | null;
  };

  // ===== Name Group Management =====
  addNameGroup: {
    payload: { name: string; description: string };
    response: boolean;
  };
  deleteNameGroup: { payload: number; response: boolean };
  editNameGroup: {
    payload: { id: number; name: string; description: string };
    response: boolean;
  };
  getFileNameGroup: {
    payload: void;
    response: {
      id: number;
      name: string;
      description: string;
      createAt: string;
    }[];
  };
  selectFileNameGroup: { payload: void; response: string[] | null };

  // ===== Message Management =====
  addMessage: {
    payload: { nameMessage: string; message: string };
    response: boolean;
  };
  deleteMessage: { payload: number; response: boolean };
  editMessage: {
    payload: { id: number; nameMessage: string; message: string };
    response: boolean;
  };
  getMessage: {
    payload: void;
    response: {
      id: number;
      nameMessage: string;
      message: string;
      createAt: string;
    }[];
  };

  // ===== Status Management =====
  addStatus: { payload: string; response: boolean };
  deleteStatus: { payload: number; response: boolean };
  getStatus: {
    payload: void;
    response: { id: number; status: string; createdAt: string }[];
  };
  updateStatus: { payload: { id: number; status: string }; response: boolean };
  updateStatusLDPlayer: {
    payload: { id: number; status: string };
    response: boolean;
  };

  // ===== Auth =====
  login: {
    payload: { username: string; password: string };
    response: { sessionId: string; userId: string };
  };
  logout: {
    payload: { sessionId: string; userId: string };
    response: { userId: string; sessionId: string };
  };

  // ===== Version Management =====
  addAvailableVersion: { payload: string; response: boolean };
  getVersionData: {
    payload: void;
    response: {
      currentVersion: string;
      availableVersions: string[];
      lastUpdated: string;
    };
  };
  removeAvailableVersion: { payload: string; response: boolean };
  updateCurrentVersion: { payload: string; response: boolean };
};

// Helper types for type-safe IPC communication
type IpcEventKey = keyof IpcEventMap;
type IpcEventPayload<T extends IpcEventKey> = IpcEventMap[T]["payload"];
type IpcEventResponse<T extends IpcEventKey> = IpcEventMap[T]["response"];

// Type for unsubscribe function
type UnsubscribeFunction = () => void;

// Helper type to convert IpcEventMap to electron window API
type IpcEventToElectronApi<T extends IpcEventMap> = {
  [K in keyof T]: T[K]["response"] extends void
    ? (callback: (payload: T[K]["payload"]) => void) => UnsubscribeFunction
    : (payload: T[K]["payload"]) => Promise<T[K]["response"]>;
};

// Type for the electron window object
interface Window {
  electron: IpcEventToElectronApi<IpcEventMap>;
}
