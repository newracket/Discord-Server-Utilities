const { CustomCommand } = require("../../modules/utils");

class BanCommand extends CustomCommand {
  constructor() {
    super('ban', {
      aliases: ['ban', 'b'],
      description: "Bans users",
      usage: "ban <mention users> OR ban <user ids>",
      category: "Moderation",
      channel: "guild",
      userPermissions: ['BAN_MEMBERS'],
      args: [{
        id: "members",
        match: "content"
      }]
    });
  }

  async exec(message, args) {
    const membersToModify = await resolveMembers(args.members, message);
    membersToModify.forEach(member => member.ban());

    message.channel.send(membersToModify.map(member => `<@${member.id}> has been banned.`).join("\n"));
  }
}

module.exports = BanCommand;