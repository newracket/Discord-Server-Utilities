const { sweatranks, casranks } = require("../../../jsons/ranks.json")
const JSONFileManager = require("../../../modules/jsonfilemanager");
const { CustomCommand, resolveMembers } = require("../../../modules/utils");

class ResetToMemberCommand extends CustomCommand {
  constructor() {
    super('resettomember', {
      aliases: ['resettomember', 'rtm'],
      description: "Removes all sweat roles and cas roles from a member",
      usage: "resettomember <mention users> OR resettomember <user nicknames>",
      category: "Sweatranks",
      channel: "guild",
      permittedRoles: ["726565862558924811", "820159352215961620"],
      args: [{
        id: "members",
        match: "content"
      }]
    });

    this.messagesToSend = {};
  }

  async exec(message, args) {
    this.messagesToSend = {};
    const guildMembers = await message.guild.members.fetch();

    if (message.mentions.everyone || args.members.includes("everyone")) {
      guildMembers.filter(member => !member.user.bot && member.roles.cache.has("775799853077758053")).forEach(async member => {
        this.messagesToSend[member.nickname] = [];
        await member.fetch(true);
        this.resetToMember(message, member);
      });
    }
    else {
      const membersToModify = await resolveMembers(args.members, guildMembers);

      membersToModify.forEach(async member => {
        await member.fetch(true);
        this.resetToMember(message, member);
      });
    }
  }

  async resetToMember(message, member) {
    const rolesToRemove = [...casranks, ...sweatranks];
    const roles = member.roles.cache.filter(role => !rolesToRemove.includes(role.name));

    await member.roles.set(roles);
    return message.channel.send(`${member} has been reset to member`);
  }
}

module.exports = ResetToMemberCommand;