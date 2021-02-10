const gTTS = require("gtts");
const say = require("say");
const fs = require("fs");

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
        const guild = client.guilds.cache.find(guild => guild.id === '633161578363224066');
        const voiceChannel = guild.channels.cache.find(channel => channel.id == "633161578363224070");

        const nicks = JSON.parse(fs.readFileSync("nicks.json"));
        const nickname = nicks[message.author.id] != undefined ? nicks[message.author.id] : guild.member(message.author).nickname;
        const speech = nickname + " says " + args.join(" ");
        const gtts = new gTTS(speech, "en");

        gtts.save("voice.mp3", function (err, result) { console.log(err) });

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
