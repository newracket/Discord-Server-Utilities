const { CustomCommand, resolveRole } = require("../../../modules/utils");

class HoistCommand extends CustomCommand {
  constructor() {
    super('hoist', {
      aliases: ['hoist'],
      description: "Hoists a role (displays separately from other roles)",
      usage: "hoist <role name or id>",
      category: "Moderation",
      channel: "guild",
      slashCommand: true,
      args: [{
        id: "role",
        match: "content",
        type: "role",
        description: "Role to hoist",
        required: true
      }],
      userPermissions: ['MANAGE_ROLES']
    });
  }

  async exec(message, args) {
    if (!args.role) return message.reply("Role not found.");
    await args.role.setHoist(!args.role.hoist);
    message.reply("Success");
  }
}

module.exports = HoistCommand;