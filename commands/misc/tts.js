const gTTS = require("gtts");
const JSONFileManager = require("../../modules/jsonfilemanager");
const { CustomCommand, resolveChannel } = require("../../modules/utils");

const nicksJSON = new JSONFileManager("nicks");

class TtsCommand extends CustomCommand {
  constructor() {
    super('tts', {
      aliases: ['tts'],
      description: "Converts text message to speech and sends in voice channel",
      usage: "tts <message>",
      category: "Misc",
      slashCommand: true,
      args: [{
        id: "content",
        type: "string",
        match: "content",
        description: "Text to conver to speech",
        required: true
      }]
    });
  }

  async exec(message, args) {
    const nicks = nicksJSON.get();

    if (args.content.length < 0) {
      message.channel.send("No message to say.");
      return;
    }
    else if (args.content.length > 400) {
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

        const nickname = nicks[message.member.user.id] != undefined ? nicks[message.member.user.id] : message.member.displayName;
        const speech = nickname + " says " + args.content.split(" ").map(e => {
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

            if (message?.constructor?.name == "CommandInteraction") {
              message.defer();
            }
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