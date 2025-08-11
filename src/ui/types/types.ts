export type LDPlayerType = {
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

export type CreatedLDPlayerType = {
  NoDataGridLD: number;
  LDPlayerGridLD: string;
  DateTimeGridLD: string;
  StatusGridLD: string;
  PrefixGridLD: string;
};

export type NameGroupType = {
  id: number;
  name: string;
  description: string;
  createAt: string;
};

export type ProfileType = {
  id: number;
  name: string;
  path: string;
  createAt: string;
};

export type AccountType = {
  id: number;
  type: string;
  name: string;
  mid: string;
  status: boolean;
  createAt: string;
};

export type MessageType = {
  id: number;
  nameMessage: string;
  message: string;
  createAt: string;
};

export type StatusType = {
  id: number;
  status: string;
  createdAt: string;
};

export type VersionData = {
  currentVersion: string;
  availableVersions: string[];
  lastUpdated: string;
};
