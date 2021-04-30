const { sweatranks, casranks } = require("../../../jsons/ranks.json");
const { CustomCommand } = require("../../../modules/custommodules");

class GiveCasCommand extends CustomCommand {
  constructor() {
    super('givecas', {
      aliases: ['givecas', 'gc'],
      description: "Gives cas role to a member",
      usage: "givecas <mention members> OR givecas <member nicknames>",
      category: "Sweatranks",
      channel: "guild",
      permittedRoles: ["726565862558924811", "820159352215961620"],
    });
  }

  exec(message) {
    const args = message.content.split(" ").slice(1);

    message.guild.members.fetch()
      .then(guildMembers => {
        const membersToModify = args.map(arg => guildMembers.find(member => member.displayName.toLowerCase() == arg.toLowerCase())).filter(e => e != undefined);
        [...Array.from(message.mentions.members, ([name, value]) => (value)), ...membersToModify].forEach(member => {
          const lastRank = casranks.filter(rank => member.roles.cache.map(role => role.name).includes(rank)).pop();

          if (casranks.indexOf(lastRank) == casranks.length - 1) {
            return message.channel.send(`This person is already ${lastRank} and cannot get any more cas roles.`);
          }
          else if (lastRank != undefined) {
            member.roles.add(message.guild.roles.cache.find(role => role.name == casranks[casranks.indexOf(lastRank) + 1]))
              .then(newMember => message.channel.send(`Successfully gave ${casranks[casranks.indexOf(lastRank) + 1]} to <@${newMember.id}>`));
          }
          else {
            const memberRoles = member.roles.cache.filter(role => !sweatranks.includes(role.name)).map(role => role.id);
            memberRoles.push(message.guild.roles.cache.find(role => role.name == "Cas").id);

            member.roles.set(memberRoles)
              .then(newMember => message.channel.send(`Successfully gave Cas to <@${newMember.id}>`));
          }
        });
      });
  }
}

module.exports = GiveCasCommand;