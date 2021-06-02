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
      args: [{
        id: "member",
        type: "member",
        description: "Member to display roles of. If omitted, will display all roles. ",
        match: "content"
      }]
    });
  }

  async exec(message, args) {
    let roles;
    if (!args.member) {
      roles = (await message.guild.roles.fetch()).filter(role => role.position != 0);
      roles.sort((a, b) => b.comparePositionTo(a));
    }
    else {
      roles = await args.member.roles.cache.filter(role => role.position != 0); ;
      roles.sort((a, b) => b.comparePositionTo(a));
    }

    const embeds = [];
    let currentEmbed = this.client.util.embed({
      title: `**__Roles list for ${args.member ? args.member.displayName : "this server"}:__**`
    });
    let currentDescription = "";

    roles.forEach(role => {
      const roleItem = `${role.position}: ${role}\n`;

      if ((currentDescription + roleItem).length > 2048) {
        currentEmbed.setDescription(currentDescription);
        embeds.push(currentEmbed);

        currentEmbed = this.client.util.embed({});
        currentDescription = "";
      }
      currentDescription += roleItem;
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