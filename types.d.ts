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

// Define the shape of IPC events
type IpcEventMap = {
  statistics: {
    payload: Statistics;
    response: void;
  };
  getStaticData: {
    payload: void;
    response: StaticData;
  };
  getLDPlayersDB: {
    payload: void;
    response: DataLDPlayersDB[];
  };
  callLdInstance: {
    payload: string;
    response: boolean;
  };
  deleteLdInstance: {
    payload: string;
    response: boolean;
  };
  deleteRowFromDB: {
    payload: string;
    response: boolean;
  };
  getTokenLdInstance: {
    payload: string;
    response: boolean;
  };
  fetchLdInstance: {
    payload: void;
    response: string[];
  };
  createLdInstance: {
    payload: {
      prefix: string;
      count: number;
    };
    response: string;
  };
  getDataCreateLDPlayers: {
    payload: void;
    response: CreateLDPlayersDB[];
  };
  moveSelectedLDPlayers: {
    payload: string[];
    response: boolean;
  };
  setLDPlayerPath: {
    payload: string;
    response: boolean;
  };
  getLDPlayerPath: {
    payload: void;
    response: string;
  };
  mainCreateGroup: {
    payload: {
      accessToken: string;
      ldName: string;
      nameGroup: string;
      oaId: string;
      privateId: string;
    };
    response: boolean;
  };
  checkBanLdInstance: {
    payload: { ldName: string; accessToken: string };
    response: boolean;
  };
  getTxtFiles: {
    payload: void;
    response: { name: string; count: number; path: string; createAt: string }[];
  };
  saveTxtFile: {
    payload: { name: string; count: number; path: string };
    response: boolean;
  };
  deleteTxtFile: {
    payload: string;
    response: boolean;
  };
  updatePhoneFile: {
    payload: { ldName: string; fileName: string };
    response: string;
  };
  addFriends: {
    payload: {
      ldName: string;
      accessToken: string;
      target: number;
      phoneFile: string;
    };
    response: {
      success: boolean;
      added: number;
      remaining: number;
      message?: string;
    };
  };

  selectTextFile: {
    payload: void;
    response: {
      name: string;
      path: string;
      count: number;
    };
  };

  login: {
    payload: { username: string; password: string };
    response: { sessionId: string; userId: string };
  };

  logout: {
    payload: { sessionId: string; userId: string };
    response: { userId: string; sessionId: string };
  };

  selectImageFile: {
    payload: void;
    response: { name: string; path: string } | null;
  };
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
