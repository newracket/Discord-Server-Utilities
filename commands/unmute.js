const fs = require("fs");
const { Command } = require('discord-akairo');

class UnmuteCommand extends Command {
  constructor() {
    super('unmute', {
      aliases: ['unmute', 'u'],
      description: "Unmutes users",
      channel: "guild",
      userPermissions: ['ADMINISTRATOR']
    });
  }

  exec(message) {
    message.mentions.members.forEach(this.muteMember);
    message.channel.send(message.mentions.members.map(member => `<@${member.id}> has been unmuted.`).join("\n"));
  }

  async muteMember(member) {
    const roles = await member.guild.roles.fetch();
    await member.roles.remove(roles.cache.find(role => role.name == "Muted"));
    const mutedAdmins = JSON.parse(fs.readFileSync("muteadmin.json"));

    if (mutedAdmins.includes(member.id)) {
      fs.writeFileSync("muteadmin.json", JSON.stringify(mutedAdmins.filter(id => id != member.id)));
      await member.roles.add(roles.cache.find(role => role.name == "Admin"));
    }
  }
}

module.exports = UnmuteCommand;