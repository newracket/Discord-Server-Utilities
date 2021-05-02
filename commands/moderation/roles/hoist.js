const { CustomCommand } = require("../../../modules/custommodules");

class RolePositionCommand extends CustomCommand {
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
    const roles = (await message.guild.roles.fetch()).cache;
    const role = roles.find(r => [r.id, r.name.toLowerCase()].includes(args.role.trim().toLowerCase()));

    role.setHoist(!role.hoist)
      .then(newRole => message.channel.send("Success"))
      .catch(err => message.channel.send("Error: " + err));
  }
}

module.exports = RolePositionCommand;