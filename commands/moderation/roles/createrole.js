const { CustomCommand } = require("../../../modules/utils");

class CreateRoleCommand extends CustomCommand {
  constructor() {
    super('createrole', {
      aliases: ['createrole', 'cr'],
      description: "Creates a role",
      usage: "createrole <role name> <role color>",
      category: "Moderation",
      channel: "guild",
      userPermissions: ['MANAGE_ROLES'],
      slashCommand: true,
      args: [{
        id: "name",
        type: "string",
        description: "Name of role to create",
        required: true,
        match: "notLast"
      }, {
        id: "color",
        type: "string",
        description: "Color of role to create",
        required: true,
        match: "last"
      }]
    });
  }

  async exec(message, args) {
    const colorsList = ["default", "white", "aqua", "green", "blue", "yellow", "purple", "luminous_vivid_pink", "gold", "orange", "red", "grey", "darker_grey", "navy", "dark_aqua", "dark_green", "dark_blue", "dark_purple", "dark_vivid_pink", "dark_gold", "dark_orange", "dark_red", "dark_grey", "light_grey", "dark_navy", "blurple", "greyple", "dark_but_not_black", "not_quite_black", "random"];

    if (!new RegExp(/^#[0-9A-F]{6}$/i).test(args.color) && !colorsList.includes(args.color.toLowerCase())) {
      return message.reply("Error: No color specified. Use \"default\" if you want the role to have a default color.");
    }

    const role = await message.guild.roles.create({ name: args.name, color: args.color.toUpperCase() });
    message.reply(`<@&${role.id}> has been created.`);
  }
}

module.exports = CreateRoleCommand;