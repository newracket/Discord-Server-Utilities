const { sweatranks, casranks } = require("../../../jsons/ranks.json");
const { CustomCommand, resolveMembers } = require("../../../modules/utils");

class GiveCasCommand extends CustomCommand {
  constructor() {
    super('givecas', {
      aliases: ['givecas', 'gc'],
      description: "Gives cas role to a member",
      usage: "givecas <mention members> OR givecas <member nicknames>",
      category: "Sweatranks",
      channel: "guild",
      permittedRoles: ["726565862558924811", "820159352215961620"],
      args: [{
        id: "members",
        match: "content"
      }]
    });
  }

  async exec(message, args) {
    const guildMembers = await message.guild.members.fetch();

    if (message.mentions.everyone || args.members.includes("everyone")) {
      guildMembers.filter(member => !member.user.bot && member.roles.cache.has("775799853077758053")).forEach(async member => {
        this.messagesToSend[member.nickname] = [];
        await member.fetch(true);
        this.giveCas(message, member);
      });
    }
    else {
      const membersToModify = await resolveMembers(args.members, guildMembers);

      membersToModify.forEach(async member => {
        await member.fetch(true);
        this.giveCas(message, member);
      });
    }
  }

  async giveCas(message, member) {
    const lastRank = casranks.filter(rank => member.roles.cache.map(role => role.name).includes(rank)).pop();

    if (casranks.indexOf(lastRank) == casranks.length - 1) {
      return message.channel.send(`This person is already ${lastRank} and cannot get any more cas roles.`);
    }
    else if (lastRank != undefined) {
      await member.roles.add(message.guild.roles.cache.find(role => role.name == casranks[casranks.indexOf(lastRank) + 1]))
      message.channel.send(`Successfully gave ${casranks[casranks.indexOf(lastRank) + 1]} to <@${member.id}>`);
    }
    else {
      const memberRoles = member.roles.cache.filter(role => !sweatranks.includes(role.name)).map(role => role.id);
      memberRoles.push(message.guild.roles.cache.find(role => role.name == "Cas").id);

      await member.roles.set(memberRoles)
      message.channel.send(`Successfully gave Cas to <@${member.id}>`);
    }
  }
}

module.exports = GiveCasCommand;