const { CustomCommand, resolveRole, resolveMembers } = require("../../../modules/utils");

class GrantRoleCommand extends CustomCommand {
  constructor() {
    super('grantrole', {
      aliases: ['grantrole', 'gr'],
      description: "Grants a role to a user",
      usage: "grantrole <role name, role id, or role ping> <user nickname, username, or ping>",
      category: "Moderation",
      channel: "guild",
      userPermissions: ['MANAGE_ROLES'],
      slashCommand: true,
      args: [{
        id: "role",
        type: "role",
        required: true,
        description: "Role to grant",
        match: "notLast"
      }, {
        id: "member",
        type: "member",
        required: true,
        description: "Member to grant role to",
        match: "last"
      }]
    });
  }

  async exec(message, args) {
    if (!args.role) return message.reply("Role not found.");
    if (!args.member) return message.reply("Member not found.");

    const highestRole = message.member.roles.highest;
    if (highestRole.comparePositionTo(args.role) <= 0) return message.reply("The role you are trying to assign is higher than your highest role.");

    args.member.roles.add(args.role);
    message.reply(`${args.role.name} has been given to: ${args.member}.`);
  }
}

module.exports = GrantRoleCommand;