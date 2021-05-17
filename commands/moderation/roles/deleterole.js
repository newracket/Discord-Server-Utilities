const { CustomCommand, resolveRole } = require("../../../modules/utils");

class RemoveRoleCommand extends CustomCommand {
  constructor() {
    super('deleterole', {
      aliases: ['deleterole', 'dr'],
      description: "Deletes a role",
      usage: "deleterole <role name>",
      category: "Moderation",
      channel: "guild",
      userPermissions: ['MANAGE_ROLES'],
      slashCommand: true,
      args: [{
        id: "role",
        type: "role",
        required: true,
        description: "Role to delete"
      }]
    });
  }

  async exec(message, args) {
    if (!args.role) {
      return message.reply("This role does not exist.");
    }
    else if (args.role.length > 1) {
      const highestRole = message.member.roles.highest;
      if (highestRole.comparePositionTo(args.role) <= 0) return message.reply("The role you are trying to assign is higher than your highest role.");

      return message.reply("Multiple roles with this name exist.")
    }

    await args.role.delete();
    message.reply(`${args.role.name} has been deleted.`);
  }
}

module.exports = RemoveRoleCommand;