import db from "./sqliteService.js";

export function queryTableGetToken(
  StatusAccGridLD: string,
  StatusGridLD: string,
  FriendGridLD: string,
  GroupGridLD: string,
  TokenGridLD: string,
  NameLineGridLD: string,
  PhoneGridLD: string,
  ldName: string,
) {
  try {
    db.prepare(
      `
      UPDATE GridLD SET
          StatusAccGridLD = @accStatus,
          StatusGridLD = @status,
          FriendGridLD = @friends,
          GroupGridLD = @groups,
          TokenGridLD = @token,
          NameLineGridLD = @name,
          PhoneGridLD = @phone,
          DateTimeGridLD = datetime('now', 'localtime'),
          CreateAt = datetime('now', 'localtime')
      WHERE LDPlayerGridLD = @ldName
    `,
    ).run({
      accStatus: StatusAccGridLD,
      status: StatusGridLD,
      friends: FriendGridLD,
      groups: GroupGridLD,
      token: TokenGridLD,
      name: NameLineGridLD,
      phone: PhoneGridLD,
      ldName: ldName,
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
