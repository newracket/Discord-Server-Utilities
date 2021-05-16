const { CustomCommand } = require("../../modules/utils");

class RolesCommand extends CustomCommand {
  constructor() {
    super('roles', {
      aliases: ['roles'],
      description: "Displays the order of roles",
      usage: "roles",
      category: "Moderation",
      channel: "guild",
      slashCommand: true,
      args: []
    });
  }

  async exec(message) {
    const roles = (await message.guild.roles.fetch()).filter(role => role.position != 0);
    roles.sort((a, b) => b.comparePositionTo(a));

    const embeds = [];
    let currentEmbed = this.client.util.embed({
      title: `**__Roles List:__**`
    });
    let currentDescription = "";

    roles.forEach(role => {
      const roleItem = `${roles.size - role.position + 1}: ${role}\n`;

      if ((currentDescription + roleItem).length < 2048) {
        currentDescription += roleItem;
      }
      else {
        currentEmbed.setDescription(currentDescription);
        embeds.push(currentEmbed);

        currentEmbed = this.client.util.embed({});
        currentDescription = "";
      }
    });

    currentEmbed.setDescription(currentDescription);
    embeds.push(currentEmbed);
    embeds.forEach((embed, i) => {
      if (i == 0) {
        message.reply(embed);
      }
      else {
        if (message?.constructor?.name == "CommandInteraction") {
          message.followUp(embed);
        }
        else {
          message.channel.send(embed);
        }
      }
    });
  }
}

module.exports = RolesCommand;