const gTTS = require("gtts");
const say = require("say");

module.exports = {
  name: "tts",
  execute(message, args, client) {
    if (args.length < 0) {
      message.channel.send("No message to say.");
      return;
    }
    else if (args.join(" ").length > 400) {
      message.channel.send("Message exceeds character limit of 400.");
      return;
    }
    else {
      if (!client.playing) {
        client.playing = true;
        const speech = args.join(" ");
        const gtts = new gTTS(speech, "en");

        gtts.save("voice.mp3", function (err, result) { console.log(err) });

        const guild = client.guilds.cache.find(guild => guild.id === '633161578363224066');
        const voiceChannel = guild.channels.cache.find(channel => channel.id == "633161578363224070");

        voiceChannel.join().then(connection => {
          const dispatcher = connection.play('./voice.mp3');

          dispatcher.on('finish', () => {
            connection.disconnect();
            client.playing = false;
          });
        });
      }
      else {
        message.channel.send("Someone else is already using this.");
      }
    }
  }
}
