const JSONFileManager = require("../../modules/jsonfilemanager");
const { CustomCommand, resolveMembers, resolveRole } = require("../../modules/utils");

const muteAdminJSON = new JSONFileManager("muteadmin");

class UnmuteCommand extends CustomCommand {
  constructor() {
    super('unmute', {
      aliases: ['unmute', 'u'],
      description: "Unmutes users",
      usage: "unmute <mention member/member id/member nickname>",
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
    await args.member.roles.remove(mutedID);

    const mutedAdmins = muteAdminJSON.get();

    if (mutedAdmins.includes(args.member.id)) {
      muteAdminJSON.set(mutedAdmins.filter(id => id != args.member.id));
      await args.member.roles.add(adminID);
    }

    message.reply(`${args.member} has been unmuted.`);
  }
}

module.exports = UnmuteCommand;