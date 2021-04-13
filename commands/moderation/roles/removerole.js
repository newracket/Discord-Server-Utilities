const { CustomCommand } = require("../../../modules/custommodules");

class RemoveRoleCommand extends CustomCommand {
  constructor() {
    super('removerole', {
      aliases: ['removerole', 'rr'],
      description: "Removes a role",
      usage: "removerole <role name>",
      category: "Moderation",
      channel: "guild",
      userPermissions: ['MANAGE_ROLES']
    });
  }

  async exec(message) {
    const roleName = message.content.split(" ").slice(1).join(" ");
    const role = message.guild.roles.cache.filter(role => role.name == roleName).array();

    if (!role) {
      return message.channel.send("This role does not exist.");
    }
    else if (role.length > 1) {
      const highestRole = message.member.roles.highest;
      if (highestRole.comparePositionTo(role) <= 0) return message.channel.send("The role you are trying to assign is higher than your highest role.");

      return message.channel.send("Multiple roles with this name exist.")
    }

    role[0].delete()
      .then(role => message.channel.send(`${role.name} has been deleted.`));
  }
}

module.exports = RemoveRoleCommand;