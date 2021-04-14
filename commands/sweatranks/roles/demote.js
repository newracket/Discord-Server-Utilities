const { sweatranks, casranks } = require("../../../jsons/ranks.json")
const { CustomCommand } = require("../../../modules/custommodules");

class DemoteCommand extends CustomCommand {
  constructor() {
    super('demote', {
      aliases: ['demote', 'd'],
      description: "Demotes a member",
      usage: "demote <mention users> <amount> OR demote <user nicknames> <amount>",
      category: "Sweatranks",
      channel: "guild",
      permittedRoles: ["726565862558924811", "820159352215961620"],
    });
  }

  exec(message) {
    const args = message.content.split(" ").slice(1);
    let repeatTimes = 1;

    if (!isNaN(parseInt(args[0]))) {
      repeatTimes = parseInt(args[0]);
    }
    else if (!isNaN(parseInt(args.slice(-1)))) {
      repeatTimes = parseInt(args.slice(-1));
    }

    this.messagesToSend = {};
    message.guild.members.fetch()
      .then(guildMembers => {
        const membersToModify = args.map(arg => guildMembers.find(member => member.nickname == arg)).filter(e => e != undefined);
        [...Array.from(message.mentions.members, ([name, value]) => (value)), ...membersToModify].forEach(member => {
          this.messagesToSend[member.nickname] = [];
          this.demoteMember(message, member, member.roles.cache.map(role => role.name), repeatTimes);
        });
      });
  }

  demoteMember(message, member, roles, repeatTimes) {
    if (repeatTimes == 0) {
      const rolesDir = message.guild.roles.cache.map(role => { return { name: role.name, id: role.id } });
      roles = roles.map(role => rolesDir.find(r => r.name == role).id);

      return member.roles.set(roles).then(newMember => message.channel.send(this.messagesToSend[newMember.nickname].join("\n")));
    }

    const lastRank = sweatranks.filter(rank => roles.includes(rank)).pop();
    if (lastRank != undefined) {
      if (lastRank == "Sweat") {
        this.messagesToSend[member.nickname].push(`<@${member.id}> was demoted to Member.`);
      }
      else {
        this.messagesToSend[member.nickname].push(`<@${member.id}> was demoted to ${sweatranks[sweatranks.indexOf(lastRank) - 1]}.`);
      }

      roles.splice(roles.indexOf(lastRank), 1)
      return this.demoteMember(message, member, roles, repeatTimes - 1);
    }
    else {
      const lastRank = casranks.filter(rank => roles.includes(rank)).pop();

      if (casranks.indexOf(lastRank) == casranks.length - 1) {
        this.messagesToSend[member.nickname].push("Error. This person is cannot be demoted any further.");
        return this.demoteMember(message, member, roles, 0);
      }
      else {
        this.messagesToSend[member.nickname].push(`<@${member.id}> was demoted to ${casranks[casranks.indexOf(lastRank) + 1]}.`);

        roles.push(casranks[casranks.indexOf(lastRank) + 1])
        return this.demoteMember(message, member, roles, repeatTimes - 1);
      }
    }
  }
}

module.exports = DemoteCommand;