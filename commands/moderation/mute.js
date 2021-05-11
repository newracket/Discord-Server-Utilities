const JSONFileManager = require("../../modules/jsonfilemanager");
const { CustomCommand, resolveMembers, resolveRole } = require("../../modules/utils");

const muteAdminJSON = new JSONFileManager("muteadmin");

class MuteCommand extends CustomCommand {
  constructor() {
    super('mute', {
      aliases: ['mute', 'm'],
      description: "Mutes users",
      usage: "mute <mention users> OR mute <user ids>",
      category: "Moderation",
      channel: "guild",
      userPermissions: ['ADMINISTRATOR'],
      args: [{
        id: "members",
        match: "content"
      }]
    });
  }

  async exec(message, args) {
    const membersToModify = await resolveMembers(args.members, message);
    membersToModify.forEach(async member => {
      await member.roles.add(await resolveRole("Muted", message));

      if (member.roles.cache.find(role => role.name == "Admin")) {
        const mutedAdmins = muteAdminJSON.get();
        mutedAdmins.push(member.id);
        muteAdminJSON.set(mutedAdmins);

        await member.roles.remove(await resolveRole("Admin", message));
      }
    });

    message.channel.send(membersToModify.map(member => `<@${member.id}> has been muted.`).join("\n"));
  }
}

module.exports = MuteCommand;