const JSONFileManager = require("../../modules/jsonfilemanager");
const { CustomCommand, resolveMembers, resolveRole } = require("../../modules/utils");

const muteAdminJSON = new JSONFileManager("muteadmin");

class MuteCommand extends CustomCommand {
  constructor() {
    super('mute', {
      aliases: ['mute', 'm'],
      description: "Mutes users",
      usage: "mute <mention member/member id/member nickname>",
      category: "Moderation",
      channel: "guild",
      userPermissions: ['ADMINISTRATOR'],
      slashCommand: true,
      args: [{
        id: "member",
        match: "content",
        type: "member",
        required: true,
        description: "Member to mute"
      }]
    });
  }

  async exec(message, args) {
    if (!args.member) return message.reply("Member not found.");

    const mutedID = "806387819432902656";
    const adminID = "633163401907929088";
    await args.member.roles.add(mutedID);

    if (args.member.roles.cache.has(adminID)) {
      const mutedAdmins = muteAdminJSON.get();
      mutedAdmins.push(args.member.id);
      muteAdminJSON.set(mutedAdmins);

      await args.member.roles.remove(adminID);
    }

    message.reply(`${args.member} has been muted.`);
  }
}

module.exports = MuteCommand;