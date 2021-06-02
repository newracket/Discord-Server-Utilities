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
    if (!this.client.giotts && message.author.id == "536324005276155904") return message.reply("You do not have perms to use tts.");
    const nicks = nicksJSON.get();

    if (args.content.length < 0) {
      message.reply("No message to say.");
      return;
    }
    else if (args.content.length > 400) {
      message.reply("Message exceeds character limit of 400.");
      return;
    }
    else {
      if (!message.client.playing) {
        message.defer();
        message.client.playing = true;
        let voiceChannel;

        if (message.member.voice.channel) {
          voiceChannel = message.member.voice.channel;
        }
        else {
          voiceChannel = await resolveChannel("633161578363224070", message);
        }

        const nickname = nicks[message.author.id] != undefined ? nicks[message.author.id] : message.member.displayName;
        const speech = nickname + " says " + args.content.split(" ").map(e => {
          if (e[0] == "<" && e[1] == ":" && e[e.length - 1] == ">") {
            return e.split(":")[1];
          }
          return e;
        }).join(" ");
        const gtts = new gTTS(speech, "en");

        gtts.save("voice.mp3", err => { if (err) message.reply(err); });

        voiceChannel.join().then(connection => {
          const dispatcher = connection.play('./voice.mp3');

          dispatcher.on('finish', () => {
            connection.disconnect();
            message.client.playing = false;

            message.editReply(`Said the message "${args.content}" in ${voiceChannel.name}.`);
          });
        });
      }
      else {
        message.reply("Someone else is already using this.");
      }
    }
  }
}

module.exports = TtsCommand;