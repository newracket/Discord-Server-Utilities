const gTTS = require("gtts");
const JSONFileManager = require("../../modules/jsonfilemanager");
const { CustomCommand, resolveChannel } = require("../../modules/utils");

const nicksJSON = new JSONFileManager("nicks");

class TtsCommand extends CustomCommand {
  constructor() {
    super('tts', {
      aliases: ['tts', 't'],
      description: "Converts text message to speech and sends in voice channel",
      usage: "tts <message>",
      category: "Misc",
      args: [
        {
          id: "content",
          match: "content"
        }
      ]
    });
  }

  async exec(message, args) {
    const nicks = nicksJSON.get();

    args = args.content.split(" ");

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
          voiceChannel = await resolveChannel("633161578363224070", message);
        }

        const nickname = nicks[message.author.id] != undefined ? nicks[message.author.id] : message.member.displayName;
        const speech = nickname + " says " + args.map(e => {
          if (e[0] == "<" && e[1] == ":" && e[e.length - 1] == ">") {
            return e.split(":")[1];
          }
          return e;
        }).join(" ");
        const gtts = new gTTS(speech, "en");

        gtts.save("voice.mp3", err => { if (err) message.channel.send(err); });

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