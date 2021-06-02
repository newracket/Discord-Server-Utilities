const { CustomCommand } = require("../../modules/utils");

class GioTTSCommand extends CustomCommand {
  constructor() {
    super('giotts', {
      aliases: ['giotts'],
      description: "Toggles gios perms to use tts bot",
      usage: "giotts <enable/disable [OPTIONAL]>",
      category: "Moderation",
      channel: "guild",
      args: [{
        id: "value",
        type: "string",
        match: "content"
      }]
    });
  }

  async exec(message, args) {
    if (message.author.id == "536324005276155904") return message.reply("You do not have perms to use this commmand.");

    if (args.value == "enable" || args.value == "disable") {
      this.client.giotts = args.value == "enable";
    }
    else {
      this.client.giotts = !this.client.giotts;
    }

    message.reply(`Gio is now ${this.client.giotts ? "allowed" : "not allowed"} to use the tts bot.`);
  }
}

module.exports = GioTTSCommand;