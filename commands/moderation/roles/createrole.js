const { CustomCommand } = require("../../../modules/custommodules");

class CreateRoleCommand extends CustomCommand {
  constructor() {
    super('createrole', {
      aliases: ['createrole', 'cr'],
      description: "Creates a role",
      usage: "createrole <role name> <role color>",
      category: "Moderation",
      channel: "guild",
      userPermissions: ['MANAGE_ROLES']
    });
  }

  async exec(message) {
    const roleColor = message.content.split(" ").slice(-1)[0].toUpperCase();
    const roleName = message.content.split(" ").slice(1, -1).join(" ");

    message.guild.roles.create({ data: { name: roleName, color: roleColor } })
      .then(role => message.channel.send(`<@&${role.id}> has been created.`));
  }
}

module.exports = CreateRoleCommand;