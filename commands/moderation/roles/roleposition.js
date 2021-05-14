const { CustomCommand, resolveRole } = require("../../../modules/utils");

class RolePositionCommand extends CustomCommand {
  constructor() {
    super('roleposition', {
      aliases: ['roleposition', 'rp'],
      description: "Sets the position of a role",
      usage: "roleposition <role name or id> <new position>",
      category: "Moderation",
      channel: "guild",
      args: [{
        id: "content",
        match: "restContent"
      },
      {
        id: "position",
        type: "integer"
      }],
      userPermissions: ['MANAGE_ROLES']
    });
  }

  async exec(message, args) {
    const role = await resolveRole(args.content.split(" ").slice(0, -1).join(" "), message);

    const newRole = await role.setPosition(message.guild.roles.cache.size - args.position);
    message.channel.send("The new position of your role is: " + newRole.position);
  }
}

module.exports = RolePositionCommand;