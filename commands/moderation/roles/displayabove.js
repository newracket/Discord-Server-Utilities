const { CustomCommand, resolveRole } = require("../../../modules/utils");
const { Message, Role } = require("discord.js");

class DisplayAboveCommand extends CustomCommand {
  constructor() {
    super('displayabove', {
      aliases: ['displayabove', 'da'],
      description: "Displays a role above a different role",
      usage: "displayabove <role name or id> <role name or id>",
      category: "Moderation",
      channel: "guild",
      slashCommand: true,
      args: [{
        id: "roleone",
        type: "role",
        description: "Role to display above other role",
        required: true
      }, {
        id: "roletwo",
        type: "role",
        description: "Role that other role will be displayed above.",
        required: true
      }],
      userPermissions: ['MANAGE_ROLES']
    });
  }

  async exec(message, args) {
    if (message instanceof Message) {
      const words = message.content.split(" ").slice(1);
      const roles = await message.guild.roles.fetch();

      let currentRoleName = "";
      for (const [i, word] of words.entries()) {
        currentRoleName += `${word} `;
        const role = await resolveRole(currentRoleName, roles);

        if (role) {
          const roletwo = words.slice(i + 1).join(" ").trim();
          console.log(roletwo);
          
          args.roleone = role;
          args.roletwo = await resolveRole(roletwo, roles);
          console.log(args.roletwo);
          break;
        }
      }
    }

    if (!args.roleone) return message.reply("Role to display above not specified.");
    if (!args.roletwo) return message.reply("Second role not specified");

    args.roleone.setHoist(true);
    if (Role.comparePositions(args.roleone, args.roletwo) < -1) {
      args.roleone.setPosition(args.roletwo.position + 1);
    }

    message.reply(`${args.roleone.name} will now be displayed above ${args.roletwo.name}.`);
  }
}

module.exports = DisplayAboveCommand;