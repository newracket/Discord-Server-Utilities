const JSONFileManager = require("../../modules/jsonfilemanager");
const { CustomCommand, resolveMembers, resolveRole } = require("../../modules/utils");

const muteAdminJSON = new JSONFileManager("muteadmin");

class UnmuteCommand extends CustomCommand {
  constructor() {
    super('unmute', {
      aliases: ['unmute', 'u'],
      description: "Unmutes users",
      usage: "unmute <mention users> OR unmute <user ids>",
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
      await member.roles.remove(await resolveRole("Muted", message));
      const mutedAdmins = muteAdminJSON.get();

      if (mutedAdmins.includes(member.id)) {
        muteAdminJSON.set(mutedAdmins.filter(id => id != member.id));
        await member.roles.add(await resolveRole("Admin", message));
      }
    });

    message.channel.send(membersToModify.map(member => `<@${member.id}> has been unmuted.`).join("\n"));
  }
}

module.exports = UnmuteCommand;