module.exports = (slashCommand, message) => {
  //handle the `/echo` slash command. We might have others assigned to this app too!
  // The rules are simple: If there is no text following the command, treat it as though they had requested "help"
  // Otherwise just echo back to them what they sent us.

  // if no text was supplied, treat it as a help command
  if (message.text === "" || message.text === "help") {
    slashCommand.replyPrivate(
      message,
      "I echo back what you tell me. " + "Try typing `/echo hello` to see."
    );
    return;
  }

  // If we made it here, just echo what the user typed back at them
  //TODO You do it!
  slashCommand.replyPublic(message, "1", function() {
    slashCommand
      .replyPublicDelayed(message, "2")
      .then(slashCommand.replyPublicDelayed(message, "3"));
  });
};
