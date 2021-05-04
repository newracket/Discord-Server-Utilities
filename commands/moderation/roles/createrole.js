const { CustomCommand } = require("../../../modules/custommodules");

class CreateRoleCommand extends CustomCommand {
  constructor() {
    super('createrole', {
      aliases: ['createrole', 'cr'],
      description: "Creates a role",
      usage: "createrole <role name> <role color>",
      category: "Moderation",
      channel: "guild",
      userPermissions: ['MANAGE_ROLES']
    });
  }

  async exec(message) {
    const colorsList = ["default", "white", "aqua", "green", "blue", "yellow", "purple", "luminous_vivid_pink", "gold", "orange", "red", "grey", "darker_grey", "navy", "dark_aqua", "dark_green", "dark_blue", "dark_purple", "dark_vivid_pink", "dark_gold", "dark_orange", "dark_red", "dark_grey", "light_grey", "dark_navy", "blurple", "greyple", "dark_but_not_black", "not_quite_black", "random"];
    const roleColor = message.content.split(" ").slice(-1)[0].toUpperCase();
    let roleName = message.content.split(" ").slice(1, -1).join(" ");

    if (!new RegExp(/^#[0-9A-F]{6}$/i).test(roleColor) && !colorsList.includes(roleColor.toLowerCase())) {
      message.channel.send("No color specified, will use default color");
      message.content.split(" ").slice(1).join(" ");
    }

    message.guild.roles.create({ data: { name: roleName, color: roleColor } })
      .then(role => message.channel.send(`<@&${role.id}> has been created.`));
  }
}

module.exports = CreateRoleCommand;