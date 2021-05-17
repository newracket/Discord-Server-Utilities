const { CustomCommand, resolveRole, resolveMembers } = require("../../../modules/utils");

class GrantRoleCommand extends CustomCommand {
  constructor() {
    super('removerole', {
      aliases: ['removerole', 'rr'],
      description: "Removes a role from a user",
      usage: "removerole <role name, role id, or role ping> <user nickname, username, or ping>",
      category: "Moderation",
      channel: "guild",
      userPermissions: ['MANAGE_ROLES'],
      slashCommand: true,
      args: [{
        id: "role",
        type: "role",
        required: true,
        description: "Role to remove",
        match: "notLast"
      }, {
        id: "member",
        type: "member",
        required: true,
        description: "Member to remove role to",
        match: "last"
      }]
    });
  }

  async exec(message, args) {
    if (!args.role) return message.reply("Role not found.");
    if (!args.member) return message.reply("Member not found.");

    const highestRole = message.member.roles.highest;
    if (highestRole.comparePositionTo(args.role) <= 0) return message.reply("The role you are trying to remove is higher than your highest role.");

    args.member.roles.remove(args.role);
    message.reply(`${args.role.name} has been removed from: ${args.member}.`);
  }
}

module.exports = GrantRoleCommand;