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

// Define the shape of IPC events
type IpcEventMap = {
  statistics: {
    payload: Statistics;
    response: void;
  };
  test: {
    payload: any;
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

  // Update File Count
  updateFileCount: {
    payload: string;
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
      privatePhone: string;
    };
    response: boolean;
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
      mid: string;
    }[];
  };

  // Account
  addAccount: {
    payload: {
      type: string;
      name: string;
      mid: string;
      status: boolean;
    };
    response: boolean;
  };
  deleteAccount: {
    payload: string;
    response: boolean;
  };
  updateAccount: {
    payload: {
      name: string;
      type: string;
      mid: string;
      status: boolean;
    };
    response: boolean;
  };

  // Remembered Credentials
  saveRememberedCredentials: {
    payload: {
      username: string;
      password: string;
    };
    response: boolean;
  };
  getRememberedCredentials: {
    payload: void;
    response: {
      username: string;
      password: string;
    } | null;
  };
  deleteRememberedCredentials: {
    payload: void;
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
      id: number;
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
    response: {
      id: number;
      name: string;
      description: string;
      createAt: string;
    }[];
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

  // Message
  addMessage: {
    payload: { nameMessage: string; message: string };
    response: boolean;
  };
  deleteMessage: {
    payload: number;
    response: boolean;
  };
  getMessage: {
    payload: void;
    response: MessageType[];
  };
  editMessage: {
    payload: { id: number; nameMessage: string; message: string };
    response: boolean;
  };
  // LDPlayer
  browseLdInstancePath: {
    payload: void;
    response: boolean;
  };

  // Invite Into Chat
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

  // Login & Logout
  login: {
    payload: { username: string; password: string };
    response: { sessionId: string; userId: string };
  };
  logout: {
    payload: { sessionId: string; userId: string };
    response: { userId: string; sessionId: string };
  };

  // Create Chat
  createChat: {
    payload: {
      accessToken: string;
      ldName: string;
      nameGroup: string;
      profile: string;
      oaId: string;
      message: string;
    };
    response: boolean;
  };

  // Status
  getStatus: {
    payload: void;
    response: { id: number; status: string; createdAt: string }[];
  };
  addStatus: {
    payload: string;
    response: boolean;
  };
  updateStatus: {
    payload: { id: number; status: string };
    response: boolean;
  };
  deleteStatus: {
    payload: number;
    response: boolean;
  };
  updateStatusLDPlayer: {
    payload: { id: number; status: string };
    response: boolean;
  };

  // Add Me
  addMe: {
    payload: {
      accessToken: string;
      ldName: string;
      phone: string;
      userId: string;
    };
    response: boolean;
  };

  // Version Management
  getVersionData: {
    payload: void;
    response: {
      currentVersion: string;
      availableVersions: string[];
      lastUpdated: string;
    };
  };
  updateCurrentVersion: {
    payload: string;
    response: boolean;
  };
  addAvailableVersion: {
    payload: string;
    response: boolean;
  };
  removeAvailableVersion: {
    payload: string;
    response: boolean;
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
