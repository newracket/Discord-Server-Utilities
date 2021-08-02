const { CustomCommand, resolveRole, resolveMembers } = require("../../../modules/utils");
const { Message } = require("discord.js");

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
    if (message instanceof Message) {
      const words = message.content.split(" ").slice(1);
      const roles = await message.guild.roles.fetch();

      let currentRoleName = "";
      for (const [i, word] of words.entries()) {
        currentRoleName += `${word} `;
        const role = await resolveRole(currentRoleName, roles);

        if (role) {
          const highestRole = message.member.roles.highest;
          if (highestRole.comparePositionTo(role) <= 0) return message.reply("The role you are trying to remove is higher than your highest role.");

          const members = await resolveMembers(words.slice(i + 1).join(" ").trim(), message);
          members.forEach(m => {
            m.roles.remove(role);
            message.reply(`${role.name} has been removed from: ${m}.`);
          });

          break;
        }
      }
    } else {
      if (!args.role) return message.reply("Role not found.");
      if (!args.member) return message.reply("Member not found.");

      const highestRole = message.member.roles.highest;
      if (highestRole.comparePositionTo(args.role) <= 0) return message.reply("The role you are trying to remove is higher than your highest role.");

      args.member.roles.remove(args.role);
      message.reply(`${args.role.name} has been removed from: ${args.member}.`);
    }
  }
}

module.exports = GrantRoleCommand;