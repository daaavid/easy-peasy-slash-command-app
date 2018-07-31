/*
var { BitlyClient } = require("bitly");
var bitly = new BitlyClient("99ef55e577455d92ac5fa0ffecbed9bf274aa1d3", {});

module.exports = (slashCommand, message) => {
  console.log(message.text);
  // if (message.token !== process.env.VERIFICATION_TOKEN) return;

  var long_url = message.text;

  if (!~long_url.indexOf("http")) {
    console.log("does not contain");
    long_url = "http://" + long_url;
    console.log(long_url);
  }

  if (long_url.length < 25) {
    slashCommand.replyPrivate(message, "No. That's short enough.");
    console.log(long_url.length);
    return;
  }

  bitly.shorten(long_url).then(
    response => {
      if (response.data.url) {
        slashCommand.replyPrivate(message, response.data.url);
      } else {
        slashCommand.replyPrivate(message, "Is that even a real url?");
      }
      console.log(response.data.url);
    },
    error => {
      console.log(error);
      slashCommand.replyPrivate(message, "Sorry, there was a problem.");
      throw error;
    }
  );
};

*/

module.exports = () => {}