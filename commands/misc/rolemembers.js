const { CustomCommand, resolveRole } = require("../../modules/utils");

class RoleMembersCommand extends CustomCommand {
  constructor() {
    super('rolemembers', {
      aliases: ['rolemembers', 'rm'],
      description: "Lists all members with specific role",
      usage: "rolemembers <role name>",
      category: "Misc",
      args: [
        {
          id: "role",
          match: "content"
        }
      ]
    });
  }

  async exec(message, args) {
    if (!args.role) return message.channel.send("Role not specified.");

    const role = await resolveRole(args.role, message);

    if (!role) return message.channel.send("Role not found.");

    const roleMembers = role.members.array();
    if (roleMembers.length == 0) return message.channel.send("No one has that role");

    const embed = this.client.util.embed({
      color: role.hexColor,
      title: `Members with ${role.name} role`,
      description: roleMembers.join(" ")
    });

    message.channel.send(embed);
  }
}

module.exports = RoleMembersCommand;