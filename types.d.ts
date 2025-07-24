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

  // LDPlayer
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
  setLdInstancePath: {
    payload: string;
    response: boolean;
  };
  getLdInstancePath: {
    payload: void;
    response: string;
  };

  // Group
  mainCreateGroup: {
    payload: {
      accessToken: string;
      ldName: string;
      nameGroup: string;
      oaId: string;
      privateId: string[];
    };
    response: boolean;
  };
  checkBanLdInstance: {
    payload: { ldName: string; accessToken: string };
    response: boolean;
  };

  // Txt File
  getTxtFiles: {
    payload: void;
    response: {
      id: number;
      name: string;
      count: number;
      path: string;
      createAt: string;
    }[];
  };
  saveTxtFile: {
    payload: { name: string; count: number; path: string };
    response: boolean;
  };
  deleteTxtFile: {
    payload: number;
    response: boolean;
  };

  // Phone File
  updatePhoneFile: {
    payload: { ldName: string; fileName: string };
    response: string;
  };

  // Friends
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

  // Account
  getAccount: {
    payload: void;
    response: {
      id: number;
      type: string;
      name: string;
      status: boolean;
      createAt: string;
    }[];
  };

  // Account
  addAccount: {
    payload: { type: string; name: string; status: boolean };
    response: boolean;
  };

  // Account
  deleteAccount: {
    payload: number;
    response: boolean;
  };

  updateAccount: {
    payload: { name: string; type: string; status: boolean };
    response: boolean;
  };

  // Image File
  selectImageFile: {
    payload: void;
    response: { name: string; path: string } | null;
  };

  // Profile
  deleteProfile: {
    payload: string;
    response: boolean;
  };
  // Profil
  getProfile: {
    payload: void;
    response: {
      name: string;
      path: string;
      status: boolean;
      createAt: string;
    }[];
  };

  // Name Group
  selectFileNameGroup: {
    payload: void;
    response: string[] | null;
  };
  getFileNameGroup: {
    payload: void;
    response: { id: number; name: string; description: string }[];
  };
  deleteNameGroup: {
    payload: number;
    response: boolean;
  };
  addNameGroup: {
    payload: { name: string; description: string };
    response: boolean;
  };
  editNameGroup: {
    payload: { id: number; name: string; description: string };
    response: boolean;
  };

  // LDPlayer
  browseLdInstancePath: {
    payload: void;
    response: boolean;
  };

  // Login & Logout
  login: {
    payload: { username: string; password: string };
    response: { sessionId: string; userId: string };
  };
  logout: {
    payload: { sessionId: string; userId: string };
    response: { userId: string; sessionId: string };
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
