const { CustomCommand } = require("../../modules/custommodules");

class RemoveRoleCommand extends CustomCommand {
  constructor() {
    super('removerole', {
      aliases: ['removerole', 'rr'],
      description: "Removes a role",
      usage: "removerole <role name>",
      category: "Moderation",
      channel: "guild",
      userPermissions: ['ADMINISTRATOR']
    });
  }

  async exec(message) {
    const roleName = message.content.split(" ").slice(1).join(" ");
    const role = message.guild.roles.cache.filter(role => role.name == roleName).array();

    if (!role) {
      return message.channel.send("This role does not exist.");
    }
    else if (role.length > 1) {
      return message.channel.send("Multiple roles with this name exist.")
    }

    role[0].delete()
      .then(role => message.channel.send(`${role.name} has been deleted.`));
  }
}

module.exports = RemoveRoleCommand;