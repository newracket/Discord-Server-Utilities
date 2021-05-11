const { CustomCommand, resolveRole } = require("../../../modules/utils");

class HoistCommand extends CustomCommand {
  constructor() {
    super('hoist', {
      aliases: ['hoist'],
      description: "Hoists a role (displays separately from other roles)",
      usage: "hoist <role name or id>",
      category: "Moderation",
      channel: "guild",
      args: [{
        id: "role",
        match: "content"
      }],
      userPermissions: ['MANAGE_ROLES']
    });
  }

  async exec(message, args) {
    const role = await resolveRole(args.role, message);

    if (!role) return message.channel.send("Role not found.");
    await role.setHoist(!role.hoist);
    message.channel.send("Success");
  }
}

module.exports = HoistCommand;