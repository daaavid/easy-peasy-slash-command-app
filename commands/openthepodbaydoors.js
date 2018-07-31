module.exports = (slashCommand, message) => {
  slashCommand.replyPublic(
    message,
    "I'm sorry Dave, I'm afraid I can't do that."
  );
};
