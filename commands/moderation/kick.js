const { CustomCommand } = require("../../modules/utils");

class KickCommand extends CustomCommand {
  constructor() {
    super('kick', {
      aliases: ['kick', 'k'],
      description: "Kicks users",
      usage: "kick <mention users> OR kick <user ids>",
      channel: "guild",
      category: "Moderation",
      userPermissions: ['KICK_MEMBERS'],
      args: [{
        id: "members",
        match: "content"
      }]
    });
  }

  async exec(message, args) {
    const membersToModify = await resolveMembers(args.members, message);
    membersToModify.forEach(member => member.kick());

    message.channel.send(membersToModify.map(member => `<@${member.id}> has been kicked.`).join("\n"));
  }
}

module.exports = KickCommand;