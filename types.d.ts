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
  NoDataGridLD: string;
  LDPlayerGridLD: string;
  StatusAccGridLD: string;
  DateTimeGridLD: string;
  StatusGridLD: string;
  NameLineGridLD: string;
  FriendGridLD: string;
  GroupGridLD: string;
  PhoneGridLD: string;
  TokenGridLD: string;
};

type DataCreateLDPlayersDB = {
  NoDataGridLD: string;
  LDPlayerGridLD: string;
  DateTimeGridLD: string;
  StatusGridLD: string;
  PrefixGridLD: string;
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
    response: number;
  };
  deleteLdInstance: {
    payload: string;
    response: number;
  };
  deleteRowFromDB: {
    payload: number;
    response: number;
  };
  pullDBLdInstance: {
    payload: string;
    response: number;
  };
  fetchLdInstance: {
    payload: void;
    response: string[];
  };
  createLDPlayers: {
    payload: {
      prefix: string;
      count: number;
    };
    response: string;
  };
  getDataCreateLDPlayers: {
    payload: void;
    response: DataCreateLDPlayersDB[];
  };
  moveSelectedLDPlayers: {
    payload: string[];
    response: string;
  };
  setLDPlayerPath: {
    payload: string;
    response: number;
  };
  getLDPlayerPath: {
    payload: void;
    response: string;
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
