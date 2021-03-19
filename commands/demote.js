const fs = require("fs");
const { sweatranks, casranks } = require("../ranks.json");
const strikes = JSON.parse(fs.readFileSync("./strikes.json"));

module.exports = {
  name: "demote",
  description: "Demotes a member",
  aliases: ["d"],
  messagesToSend: {},
  execute(message, args, client) {
    let repeatTimes = 1;

    if (!["greektoxic", "newracket", "Fury"].includes(message.author.username)) {
      return message.channel.send("You do not have permissions to promote someone.");
    }

    if (!isNaN(parseInt(args[0]))) {
      repeatTimes = parseInt(args[0]);
    }
    else if (!isNaN(parseInt(args.slice(-1)))) {
      repeatTimes = parseInt(args.slice(-1));
    }

    message.guild.members.fetch()
      .then(guildMembers => {
        const membersToModify = args.map(arg => guildMembers.find(member => member.nickname == arg)).filter(e => e != undefined);
        [...Array.from(message.mentions.members, ([name, value]) => (value)), ...membersToModify].forEach(member => {
          this.messagesToSend[member.nickname] = [];
          this.promoteMember(message, member, member.roles.cache.map(role => role.name), repeatTimes);
        });
      });
  },
  promoteMember(message, member, roles, repeatTimes) {
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
      return this.promoteMember(message, member, roles, repeatTimes - 1);
    }
    else {
      const lastRank = casranks.filter(rank => roles.includes(rank)).pop();

      if (casranks.indexOf(lastRank) == casranks.length - 1) {
        this.messagesToSend[member.nickname].push("Error. This person is cannot be demoted any further.");
        return this.promoteMember(message, member, roles, 0);
      }
      else {
        this.messagesToSend[member.nickname].push(`<@${member.id}> was demoted to ${casranks[casranks.indexOf(lastRank) + 1]}.`);

        roles.push(casranks[casranks.indexOf(lastRank) + 1])
        return this.promoteMember(message, member, roles, repeatTimes - 1);
      }
    }
  }
}