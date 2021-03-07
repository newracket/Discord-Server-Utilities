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

    // if (!["greektoxic", "newracket"].includes(message.author.username)) {
    //   return message.channel.send("You do not have permissions to promote someone.");
    // }

    if (!isNaN(parseInt(args[0]))) {
      repeatTimes = parseInt(args[0]);
    }
    else if (!isNaN(parseInt(args.slice(-1)))) {
      repeatTimes = parseInt(args.slice(-1));
    }

    const membersToModify = args.map(arg => message.guild.members.cache.find(member => member.nickname == arg)).filter(e => e != undefined);
    [...Array.from(message.mentions.members, ([name, value]) => (value)), ...membersToModify].forEach(member => {
      this.messagesToSend[member.nickname] = [];
      this.promoteMember(message, member, repeatTimes);
    });
  },
  promoteMember(message, member, repeatTimes) {
    if (repeatTimes == 0) {
      return message.channel.send(this.messagesToSend[member.nickname].join("\n"));
    }

    const lastRank = sweatranks.filter(rank => member.roles.cache.map(role => role.name).includes(rank)).pop();

    if (lastRank != undefined) {
      member.roles.remove(message.guild.roles.cache.find(role => role.name == lastRank))
        .then(newMember => this.promoteMember(message, newMember, repeatTimes - 1));

      if (lastRank == "Sweat") {
        this.messagesToSend[member.nickname].push(`${member.nickname} was demoted to Member.`);
      }
      else {
        this.messagesToSend[member.nickname].push(`${member.nickname} was demoted to ${sweatranks[sweatranks.indexOf(lastRank) - 1]}.`);
      }
    }
    else {
      const lastRank = casranks.filter(rank => member.roles.cache.map(role => role.name).includes(rank)).pop();

      if (casranks.indexOf(lastRank) == casranks.length - 1) {
        return this.messagesToSend[member.nickname].push("Error. This person is cannot be demoted any further.");
      }
      else {
        member.roles.add(message.guild.roles.cache.find(role => role.name == casranks[casranks.indexOf(lastRank) + 1]))
          .then(newMember => this.promoteMember(message, newMember, repeatTimes - 1));

        this.messagesToSend[member.nickname].push(`${member.nickname} was demoted to ${casranks[casranks.indexOf(lastRank) + 1]}.`);
      }
    }
  }
}