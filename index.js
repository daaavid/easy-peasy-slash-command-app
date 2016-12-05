/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ______    ______    ______   __  __    __    ______
 /\  == \  /\  __ \  /\__  _\ /\ \/ /   /\ \  /\__  _\
 \ \  __<  \ \ \/\ \ \/_/\ \/ \ \  _"-. \ \ \ \/_/\ \/
 \ \_____\ \ \_____\   \ \_\  \ \_\ \_\ \ \_\   \ \_\
 \/_____/  \/_____/    \/_/   \/_/\/_/  \/_/    \/_/


 This is a sample Slack Button application that provides a custom
 Slash command.

 This bot demonstrates many of the core features of Botkit:

 *
 * Authenticate users with Slack using OAuth
 * Receive messages using the slash_command event
 * Reply to Slash command both publicly and privately

 # RUN THE BOT:

 Create a Slack app. Make sure to configure at least one Slash command!

 -> https://api.slack.com/applications/new

 Run your bot from the command line:

 clientId=<my client id> clientSecret=<my client secret> PORT=3000 node bot.js

 Note: you can test your oauth authentication locally, but to use Slash commands
 in Slack, the app must be hosted at a publicly reachable IP or host.


 # EXTEND THE BOT:

 Botkit is has many features for building cool and useful bots!

 Read all about it here:

 -> http://howdy.ai/botkit

 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/* Uses the slack button feature to offer a real time bot to multiple teams */
var Botkit = require('botkit');

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.PORT || !process.env.VERIFICATION_TOKEN) {
    console.log('Error: Specify CLIENT_ID, CLIENT_SECRET, VERIFICATION_TOKEN and PORT in environment');
    process.exit(1);
}

var config = {}
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: './db_slackbutton_slash_command/',
    };
}

var controller = Botkit.slackbot(config).configureSlackApp(
    {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        scopes: ['commands'],
    }
);

controller.setupWebserver(process.env.PORT, function (err, webserver) {
    controller.createWebhookEndpoints(controller.webserver);

    controller.createOauthEndpoints(controller.webserver, function (err, req, res) {
        if (err) {
            res.status(500).send('ERROR: ' + err);
        } else {
            res.send('Success!');
        }
    });
});


//
// BEGIN EDITING HERE!
//

var Bitly = require('bitly')
var bitly = new Bitly('99ef55e577455d92ac5fa0ffecbed9bf274aa1d3');

function openThePodBayDoors(slashCommand, message) {
    slashCommand.replyPublic(message, "I'm sorry Dave, I'm afraid I can't do that.")
}

function deg(slashCommand, message) {
    slashCommand.replyPublic(message, "( ͡° ͜ʖ ͡°)")
}

function shortenURL(slashCommand, message) {
    console.log(message.text)
            // if (message.token !== process.env.VERIFICATION_TOKEN) return;

    var long_url = message.text

    if (!~long_url.indexOf('http')) {
        console.log('does not contain')
        long_url = "http:\/\/" + long_url
        console.log(long_url)
    }

    if (long_url.length < 25) {
        slashCommand.replyPrivate(message, "No. That's short enough.");
        console.log(long_url.length)
        return;
    }

    bitly.shorten(long_url).then(function(response) {
        if (response.data.url) {
            slashCommand.replyPrivate(message, response.data.url);
        } else {
            slashCommand.replyPrivate(message, "Is that even a real url?")
        }
        console.log(response.data.url)
        
        }, function(error) {
        slashCommand.replyPrivate(message, 'Sorry, there was a problem.');
        throw error
    });
}

function echo(slashCommand, message) {
    //handle the `/echo` slash command. We might have others assigned to this app too!
    // The rules are simple: If there is no text following the command, treat it as though they had requested "help"
    // Otherwise just echo back to them what they sent us.

    // but first, let's make sure the token matches!
    if (message.token !== process.env.VERIFICATION_TOKEN) return; //just ignore it.

    // if no text was supplied, treat it as a help command
    if (message.text === "" || message.text === "help") {
        slashCommand.replyPrivate(message,
            "I echo back what you tell me. " +
            "Try typing `/echo hello` to see.");
        return;
    }

    // If we made it here, just echo what the user typed back at them
    //TODO You do it!
    slashCommand.replyPublic(message, "1", function() {
        slashCommand.replyPublicDelayed(message, "2").then(slashCommand.replyPublicDelayed(message, "3"));
    });
}

controller.on('slash_command', function (slashCommand, message) {

    console.log(message.user_name);
    console.log(message.text)

    switch (message.command) {

        

        case "/open_the_pod_bay_doors":
            openThePodBayDoors(slashCommand, message)
        break;

        case "/deg":
            deg(slashCommand, message)
        break;

        case "/shorturl":
            shortenURL(slashCommand, message)
        break;

        case "/echo": 
            echo(slashCommand, message)
        break;

        case "/makemeasandwich":
            slashCommand.replyPublic(message, "Make it yourself.")
        break;

        case "/sudomakemeasandwich":
            slashCommand.replyPublic(message, "Okay. :sandwich:")
        break;

        default:
            slashCommand.replyPublic(message, "I'm sorry Dave, I'm afraid I can't do that.")
        }

})
;

