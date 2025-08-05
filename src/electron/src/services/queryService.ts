import db from "./sqliteService.js";

export function queryTableGetToken(
  StatusAccGridLD: string,
  StatusGridLD: string,
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
