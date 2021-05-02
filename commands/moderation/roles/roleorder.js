const { CustomCommand } = require("../../../modules/custommodules");

class RoleOrderCommand extends CustomCommand {
  constructor() {
    super('roleorder', {
      aliases: ['roleorder', 'ro'],
      description: "Displays the order of roles",
      usage: "roleorder",
      category: "Moderation",
      channel: "guild"
    });
  }

  async exec(message) {
    const roles = (await message.guild.roles.fetch()).cache.filter(role => role.position != 0);
    roles.sort((a, b) => b.comparePositionTo(a));
    const messageToSend = roles.map(role => `${role.position}: ${role.name} - ${role.hexColor}`);

    message.channel.send(messageToSend.join("\n"), { split: true });
  }
}

module.exports = RoleOrderCommand;