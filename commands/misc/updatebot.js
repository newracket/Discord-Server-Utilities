const { CustomCommand } = require("../../modules/custommodules");
const { exec } = require("child_process");
const { username, password } = require("../../config.json");

class UpdateBotCommand extends CustomCommand {
  constructor() {
    super('updatebot', {
      aliases: ['updatebot', 'ub'],
      description: "Updates the bot with code from github",
      usage: "updatebot",
      category: "Misc",
      ownerOnly: true,
      args: [
        {
          id: "message",
          match: "content"
        }
      ]
    });
  }

  exec(message, args) {
    exec(`sudo git pull https://${username}:${password}@github.com/newracket/TTS-Bot.git`, (error, data) => {
      if (error) {
        return message.channel.send(error.message);
      }
      message.channel.send(data.length > 0 ? data : "Empty");
    });
  }
}

module.exports = UpdateBotCommand;