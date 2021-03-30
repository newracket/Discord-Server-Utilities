const { CustomCommand } = require("../../modules/custommodules");

class KickCommand extends CustomCommand {
  constructor() {
    super('kick', {
      aliases: ['kick', 'k'],
      description: "Kicks users",
      usage: "kick <mention users> OR kick <user ids>",
      channel: "guild",
      category: "Moderation",
      userPermissions: ['ADMINISTRATOR']
    });
  }

  async exec(message) {
    await message.mentions.members.forEach(member => member.kick());
    message.channel.send(message.mentions.members.map(member => `<@${member.id}> has been kicked.`).join("\n"));
  }
}

module.exports = KickCommand;