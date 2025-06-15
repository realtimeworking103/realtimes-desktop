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
  CreateAt: string;
};

type DataCreateLDPlayersDB = {
  NoDataGridLD: number;
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
    response: boolean;
  };
  deleteLdInstance: {
    payload: string;
    response: boolean;
  };
  deleteRowFromDB: {
    payload: string;
    response: number;
  };
  pullDBLdInstanceAuto: {
    payload: string;
    response: boolean;
  };
  pullDBLdInstanceManual: {
    payload: string;
    response: boolean;
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
    response: boolean;
  };
  getLDPlayerPath: {
    payload: void;
    response: string;
  };
  createGroup: {
    payload: { ldName: string; accessToken: string };
    response: { success: true } | { success: false; message: string };
  };
  checkBanLdInstance: {
    payload: { ldName: string; accessToken: string };
    response: { success: true } | { success: false; message: string };
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
