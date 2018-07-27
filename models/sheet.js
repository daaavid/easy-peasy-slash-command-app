const moment = require("moment");
const query = require("../utils/db-query");
const uuid = require("../utils/uuid");

module.exports = class Sheet {
  // members = [];
  // date = "";
  // status (going, not going, maybe)
  // location (actual location) (should be an array)
  // additional fields (username, alias, class, whatever)

  constructor(name, members, date) {
    this.name = name;
    this.members = members;
    this.date = date;
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
        text: `${this.members.map(member => `- @${member}\n`)}`
      });
    } else {
      attachments.push({
        title: "Members",
        text: "(No members yet)"
      });
    }

    return { attachments };
  }

  static insert = sheet => {
    const insertQueryString = `
      INSERT INTO \`sheets\` (
        \`id\` = ?,
        \`name\` = ?,
        \`date\` = ?
        \`members\` = ?
        \`created_at\`
      )
      VALUES (?, ?, ?, ?, NOW());
    `;

    return query(insertQueryString, [
      uuid(),
      sheet.name,
      sheet.date,
      sheet.members
    ]);
  };

  static update = sheet => {
    const updateQueryString = `
      UPDATE \`sheets\` SET
        \`name\` = ?,
        \`date\` = ?
        \`members\` = ?
      WHERE 
        \`id\` = ?
    `;

    return query(updateQueryString, [
      sheet.name,
      sheet.date,
      sheet.members,
      sheet.id
    ]);
  };

  static select = id => {
    const selectQueryString = `
      SELECT *
      FROM \`sheets\` as \`s\`
      WHERE \`s\`.\`id\` = ?
    `;

    return query(selectQueryString, [id]);
  };

  static upsert = sheet => {
    return this.select(sheet.id)
      .then(() => this.update(sheet))
      .catch(() => this.insert(sheet));
  };
};
