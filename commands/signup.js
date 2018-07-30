const Sheet = require("../models/sheet");

const signupFor = async (command, message) => {
  let sheet;

  try {
    sheet = await Sheet.select({ name: message.text });
  } catch (error) {
    sheet = new Sheet({
      name: message.text,
      members: []
    });
  }

  sheet.members.push(message.user_name);

  Sheet.upsert(sheet);

  return command.replyPublic(message, sheet.toMessage());
};

const signupStatus = async (command, message) => {
  try {
    const sheet = await Sheet.select({ name: message.text });
    command.replyPublic(message, sheet.toMessage());
  } catch (error) {
    command.replyPublic(
      message,
      `I'm sorry, I couldn't find a matching sheet for ${message.text}.`
    );
  }
};

module.exports = (command, message) => {
  const respondWithError = () => {
    command.replyPublic(
      message,
      "Please specify what you'd like to sign up for!"
    );
  };

  if (!message.text) {
    respondWithError();
  }

  const [action, ...body] = message.text.split(" ");

  if (action === "for") {
    signupFor(command, Object.assign(message, { text: body }));
  } else if (action === "status") {
    signupStatus(command, Object.assign(message, { text: body }));
  } else {
    respondWithError();
  }
};
