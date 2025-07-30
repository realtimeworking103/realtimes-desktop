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
  name: string;
  path: string;
  createAt: string;
};

export type AccountType = {
  id: number;
  type: string;
  name: string;
  status: boolean;
  createAt: string;
};
