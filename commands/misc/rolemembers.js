const { CustomCommand, resolveRole } = require("../../modules/utils");

class RoleMembersCommand extends CustomCommand {
  constructor() {
    super('rolemembers', {
      aliases: ['rolemembers', 'rm'],
      description: "Lists all members with specific role",
      usage: "rolemembers <role name>",
      category: "Misc",
      slashCommand: true,
      args: [{
        id: "role",
        type: "role",
        description: "Role to list members for",
        required: true,
        match: "content"
      }]
    });
  }

  async exec(message, args) {
    if (!args.role) return message.reply("Role not found.");

    const roleMembers = args.role.members.array();
    if (roleMembers.length == 0) return message.reply("No one has that role");

    const embed = this.client.util.embed({
      color: args.role.hexColor,
      title: `Members with ${args.role.name} role`,
      description: roleMembers.join(" ")
    });

    message.reply(embed);
  }
}

module.exports = RoleMembersCommand;