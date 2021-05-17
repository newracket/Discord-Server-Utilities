const { CustomCommand, resolveRole } = require("../../../modules/utils");

class RolePositionCommand extends CustomCommand {
  constructor() {
    super('roleposition', {
      aliases: ['roleposition', 'rp'],
      description: "Sets the position of a role",
      usage: "roleposition <role name or id> <new position>",
      category: "Moderation",
      channel: "guild",
      slashCommand: true,
      args: [{
        id: "role",
        type: "role",
        description: "Role to set position of",
        match: "notLast",
        required: true
      },
      {
        id: "position",
        type: "integer",
        description: "New position of role",
        match: "last",
        required: true
      }],
      userPermissions: ['MANAGE_ROLES']
    });
  }

  async exec(message, args) {
    const newRole = await args.role.setPosition(message.guild.roles.cache.size - args.position);
    message.reply("The new position of your role is: " + (message.guild.roles.cache.size - newRole.position));
  }
}

module.exports = RolePositionCommand;