const { CommandInteraction } = require("discord.js");
const { CustomCommand, resolveRole } = require("../../../modules/utils");

class ModifyRoleCommand extends CustomCommand {
  constructor() {
    super('modifyrole', {
      aliases: ['modifyrole', 'mr'],
      description: "Modifies role",
      usage: "modifyrole <role name or id> <modify type> <new value>",
      category: "Moderation",
      channel: "guild",
      slashCommand: true,
      args: [{
        type: "sub_command",
        id: "name",
        description: "Modifies the name of a role",
        options: [{
          name: "role",
          type: "ROLE",
          description: "Role to modify",
          required: true
        }, {
          name: "value",
          type: "STRING",
          description: "New value",
          required: true
        }]
      }, {
        type: "sub_command",
        id: "color",
        description: "Modifies the color of a role",
        options: [{
          name: "role",
          type: "ROLE",
          description: "Role to modify",
          required: true
        }, {
          name: "value",
          type: "STRING",
          description: "New value",
          required: true
        }]
      }],
      userPermissions: ['MANAGE_ROLES']
    });
  }

  async exec(message, args) {
    if (message instanceof CommandInteraction) {
      this.modify(args.role, args.type, args.value, message);
    }
    else {
      const words = message.content.split(" ").slice(1);
      const roles = await message.guild.roles.fetch();

      let currentRoleName = "";
      for (const [i, word] of words.entries()) {
        currentRoleName += `${word} `;
        const role = await resolveRole(currentRoleName, roles);

        if (role) {
          const modifyType = words[i + 1];
          const newValue = words.slice(i + 2).join(" ");

          if (!modifyType) return message.reply("Modify type not specified.");
          if (newValue.length == 0) return message.reply("New value not specified.");

          this.modify(role, modifyType, newValue, message);
        }
      }
    }
  }

  checkIfValidColor(color) {
    const colorsList = ["default", "white", "aqua", "green", "blue", "yellow", "purple", "luminous_vivid_pink", "gold", "orange", "red", "grey", "darker_grey", "navy", "dark_aqua", "dark_green", "dark_blue", "dark_purple", "dark_vivid_pink", "dark_gold", "dark_orange", "dark_red", "dark_grey", "light_grey", "dark_navy", "blurple", "greyple", "dark_but_not_black", "not_quite_black", "random"];

    if (!new RegExp(/^#[0-9A-F]{6}$/i).test(color) && !colorsList.includes(color.toLowerCase())) {
      return false;
    }

    return true;
  }

  async modify(role, type, value, message) {
    switch (type.toLowerCase()) {
      case "name":
        role.setName(value);
        return message.reply(`The new name of your role is ${value}`);
      case "color":
        if (!this.checkIfValidColor(value)) return message.reply("Color format is invalid.");
        await role.setColor(value.toUpperCase());
        return message.reply(`The new color of ${role.name} is ${role.hexColor}`);
      default:
        return message.reply("Modify type is invalid.");
    }
  }
}

module.exports = ModifyRoleCommand;