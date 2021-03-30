const gTTS = require("gtts");
const fs = require("fs");
const { CustomCommand } = require("../../modules/custommodules");

class TtsCommand extends CustomCommand {
  constructor() {
    super('tts', {
      aliases: ['tts', 't'],
      description: "Converts text message to speech and sends in voice channel",
      usage: "tts <message>",
      category: "Misc",
      args: [
        {
          id: "message",
          match: "content"
        }
      ]
    });
  }

  exec(message, args) {
    args = args.message.split(" ");
    if (args[0].includes("tts")) {
      args.splice(0, 1);
    }
    if (args.length < 0) {
      message.channel.send("No message to say.");
      return;
    }
    else if (args.join(" ").length > 400) {
      message.channel.send("Message exceeds character limit of 400.");
      return;
    }
    else {
      if (!message.client.playing) {
        message.client.playing = true;
        let voiceChannel;

        if (message.member.voice.channel) {
          voiceChannel = message.member.voice.channel;
        }
        else {
          voiceChannel = message.guild.channels.cache.find(channel => channel.id == "633161578363224070");
        }

        const nicks = JSON.parse(fs.readFileSync("nicks.json"));
        const nickname = nicks[message.author.id] != undefined ? nicks[message.author.id] : guild.member(message.author).nickname;
        const speech = nickname + " says " + args.map(e => {
          if (e[0] == "<" && e[1] == ":" && e[e.length - 1] == ">") {
            return e.split(":")[1];
          }
          return e;
        }).join(" ");
        const gtts = new gTTS(speech, "en");

        gtts.save("voice.mp3", function (err, result) { if (err) { console.log(err); } });

        voiceChannel.join().then(connection => {
          const dispatcher = connection.play('./voice.mp3');

          dispatcher.on('finish', () => {
            connection.disconnect();
            message.client.playing = false;
          });
        });
      }
      else {
        message.channel.send("Someone else is already using this.");
      }
    }
  }
}

module.exports = TtsCommand;