const { sweatranks, casranks } = require("../../../jsons/ranks.json")
const JSONFileManager = require("../../../modules/jsonfilemanager");
const { CustomCommand } = require("../../../modules/custommodules");

const strikesJSON = new JSONFileManager("strikes");

class ResetToMemberCommand extends CustomCommand {
  constructor() {
    super('resettomember', {
      aliases: ['resettomember', 'rtm'],
      description: "Removes all sweat roles and cas roles from a member",
      usage: "resettomember <mention users> OR resettomember <user nicknames>",
      category: "Sweatranks",
      channel: "guild",
      permittedRoles: ["726565862558924811", "820159352215961620"],
    });

    this.messagesToSend = {};
  }

  async exec(message) {
    const args = message.content.split(" ").slice(1);

    this.messagesToSend = {};
    const guildMembers = await message.guild.members.fetch();

    if (message.mentions.everyone || args.includes("everyone")) {
      guildMembers.filter(member => !member.user.bot && member.roles.cache.has("775799853077758053")).forEach(async member => {
        this.messagesToSend[member.nickname] = [];
        await member.fetch(true);
        this.resetToMember(message, member);
      });
    }
    else {
      const membersToModify = args.map(arg => guildMembers.find(member => member.displayName.toLowerCase() == arg.toLowerCase())).filter(e => e != undefined);
      [...Array.from(message.mentions.members, ([name, value]) => (value)), ...membersToModify].forEach(async member => {
        await member.fetch(true);
        await this.resetToMember(message, member);
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