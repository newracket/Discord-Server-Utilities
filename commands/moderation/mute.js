const JSONFileManager = require("../../modules/jsonfilemanager");
const { CustomCommand } = require("../../modules/custommodules");

const muteAdminJSON = new JSONFileManager("muteadmin");

class MuteCommand extends CustomCommand {
  constructor() {
    super('mute', {
      aliases: ['mute', 'm'],
      description: "Mutes users",
      usage: "mute <mention users> OR mute <user ids>",
      category: "Moderation",
      channel: "guild",
      userPermissions: ['ADMINISTRATOR']
    });
  }

  exec(message) {
    message.mentions.members.forEach(this.muteMember);
    message.channel.send(message.mentions.members.map(member => `<@${member.id}> has been muted.`).join("\n"));
  }

  async muteMember(member) {
    const roles = await member.guild.roles.fetch();
    await member.roles.add(roles.cache.find(role => role.name == "Muted"));

    if (member.roles.cache.find(role => role.name == "Admin")) {
      const mutedAdmins = muteAdminJSON.get();
      mutedAdmins.push(member.id);
      muteAdminJSON.set(mutedAdmins);

      await member.roles.remove(roles.cache.find(role => role.name == "Admin"));
    }
  }
}

module.exports = MuteCommand;