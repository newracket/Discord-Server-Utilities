const { CustomCommand } = require("../../../modules/custommodules");

class RolePositionCommand extends CustomCommand {
  constructor() {
    super('roleposition', {
      aliases: ['roleposition', 'rp'],
      description: "Sets the position of a role",
      usage: "roleposition <role name or id> <new position>",
      category: "Moderation",
      channel: "guild",
      args: [{
        id: "message",
        match: "content"
      }]
    });
  }

  async exec(message, args) {
    const roles = (await message.guild.roles.fetch()).cache;
    const role = roles.find(r => [r.id, r.name].includes(args.message.split(" ").slice(0, -1).join(" ").trim()));

    role.setPosition(parseInt(args.message.split(" ").slice(-1)[0]))
      .then(newRole => message.channel.send("The new position of your role is: " + newRole.position))
      .catch(err => message.channel.send("Error: " + err));
  }
}

module.exports = RolePositionCommand;