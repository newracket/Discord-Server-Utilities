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
    const messageToSend = roles.map(role => `${role.position}: ${role.name}`);

    const messages = [];
    let currentMessage = "";

    messageToSend.forEach(m => {
      if (currentMessage.length < 1950 - m.length) {
        currentMessage += m + "\n";
      }
      else {
        messages.push(currentMessage);
        currentMessage = "";
      }
    });
    messages.push(currentMessage);

    messages.forEach(m => {
      message.channel.send(m);
    });
  }
}

module.exports = RoleOrderCommand;