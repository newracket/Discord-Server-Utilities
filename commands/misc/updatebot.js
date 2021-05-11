const { CustomCommand } = require("../../modules/utils");
const { exec } = require("child_process");
const { username, password } = require("../../config.json");

class UpdateBotCommand extends CustomCommand {
  constructor() {
    super('updatebot', {
      aliases: ['updatebot', 'ub'],
      description: "Updates the bot with code from github, and restarts bot automatically",
      usage: "updatebot",
      category: "Misc",
      ownerOnly: true
    });
  }

  async exec(message) {
    exec(`sudo git pull https://${username}:${password}@github.com/newracket/TTS-Bot.git`, (error, data) => {
      if (error) {
        return message.channel.send(error.message);
      }

      message.channel.send(data.length > 0 ? data : "Empty", { split: true });

      exec(`sudo pm2 restart 0`);
    });
  }
}

module.exports = UpdateBotCommand;