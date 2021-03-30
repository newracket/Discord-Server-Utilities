const { CustomCommand } = require("../../modules/custommodules");

class BanCommand extends CustomCommand {
  constructor() {
    super('ban', {
      aliases: ['ban', 'b'],
      description: "Bans users",
      usage: "ban <mention users> OR ban <user ids>",
      category: "Moderation",
      channel: "guild",
      userPermissions: ['ADMINISTRATOR']
    });
  }

  async exec(message) {
    await message.mentions.members.forEach(member => member.ban());
    message.channel.send(message.mentions.members.map(member => `<@${member.id}> has been banned.`).join("\n"));
  }
}

module.exports = BanCommand;