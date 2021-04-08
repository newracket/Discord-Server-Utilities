const { CustomCommand } = require("../../modules/custommodules");

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

  exec(message, args) {
    message.guild.roles.fetch().then(roles => {
      const role = roles.cache.find(role => role.name.toLowerCase() == args.role.toLowerCase() || role.id == args.role);
      if (!role) return message.channel.send("That role does not exist");

      const roleMembers = role.members.map(member => `${member.displayName} - ${member.user.username}#${member.user.discriminator}`);
      if (roleMembers.length == 0) return message.channel.send("No one has that role");

      message.channel.send(roleMembers.join("\n"));
    });
  }
}

module.exports = RoleMembersCommand;