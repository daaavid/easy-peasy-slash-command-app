const moment = require("moment");
const dbQuery = require("../utils/db-query");
const uuid = require("../utils/uuid");

module.exports = class Sheet {
  // members = [];
  // date = "";
  // status (going, not going, maybe)
  // location (actual location) (should be an array)
  // additional fields (username, alias, class, whatever)

  constructor(obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.date = obj.date;

    if (!obj.members) {
      this.members = [];
    } else if (typeof obj.members === "string") {
      this.members = JSON.parse(obj.members);
    } else {
      this.members = obj.members;
    }
  }

  toMessage() {
    let attachments = [];

    attachments.push({ title: `Event: ${this.name}` });

    if (this.date) {
      attachments.push({
        title: `Date: ${moment(this.date).format("MMM dd YYYY")}`
      });
    }

    if (this.members.length) {
      attachments.push({
        title: `Members`,
        text: `${this.members.map(member => `- <@${member}>`).join("\n")}`
      });
    } else {
      attachments.push({
        title: "Members",
        text: "(No members yet)"
      });
    }

    return { attachments };
  }

  static insert(sheet) {
    const insertQueryString = `
      INSERT INTO sheets (id, name, date, members, created_at)
      VALUES (?, ?, ?, ?, NOW());
    `;

    return dbQuery(insertQueryString, [
      uuid(),
      sheet.name,
      sheet.date,
      JSON.stringify(sheet.members)
    ]);
  }

  static update(sheet) {
    const updateQueryString = `
      UPDATE sheets SET name = ?, date = ?, members = ?
      WHERE id = ?
    `;

    return dbQuery(updateQueryString, [
      sheet.name,
      sheet.date,
      JSON.stringify(sheet.members),
      sheet.id
    ]);
  }

  static select(params) {
    const { keys, values } = Object;
    const selectQueryString = `SELECT * FROM sheets WHERE `;
    const wheres = keys(params)
      .map(key => `${key} = ?`)
      .join(" AND ");

    return dbQuery(selectQueryString + wheres, values(params), true).then(
      result => {
        return new Sheet(result);
      }
    );
  }

  static upsert(sheet) {
    return this.select({ id: sheet.id })
      .then(() => this.update(sheet))
      .catch(() => this.insert(sheet));
  }

  static delete(params) {}
};
