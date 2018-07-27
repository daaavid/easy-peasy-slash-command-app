const moment = require("moment");

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
};
