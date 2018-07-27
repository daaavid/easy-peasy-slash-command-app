const Sheet = require("../models/sheet");
const first = require("lodash/first");

const sheets = {};

const signupFor = (command, message) => {
  if (sheets[message.text]) {
    sheets[message.text].members.push(message.user_name);
  } else {
    sheets[message.text] = new Sheet(message.text, [message.user_name]);
  }

  return signupStatus(command, message);
};

const signupStatus = (command, message) => {
  const sheet = sheets[message.text];

  if (sheet) {
    command.replyPublic(message, sheet.toMessage());
  } else {
    command.replyPublic(
      message,
      `I'm sorry, I couldn't find a matching sheet for ${message.text}.`
    );
  }
};

module.exports = (command, message) => {
  if (!message.text) {
    command.replyPublic(
      message,
      "Please specify what you'd like to sign up for!"
    );
  }

  const [action, ...body] = message.text.split(" ");

  if (action === "for") {
    signupFor(command, {
      ...message,
      text: body
    });
  } else if (action === "status") {
    signupStatus(command, {
      ...message,
      text: body
    });
  }
};
