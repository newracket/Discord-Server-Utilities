const { sweatranks, casranks } = require("../ranks.json");

module.exports = {
  name: "givecas",
  description: "Gives cas role to a member",
  aliases: ["gc"],
  execute(message, args, client) {
    if (!["greektoxic", "newracket"].includes(message.author.username)) {
      return message.channel.send("You do not have permissions to promote someone.");
    }

    const membersToModify = args.map(arg => message.guild.members.cache.find(member => member.nickname == arg)).filter(e => e != undefined);
    [...Array.from(message.mentions.members, ([name, value]) => (value)), ...membersToModify].forEach(member => {
      const memberRoles = member.roles.cache.map(role => role.name);
      const lastRank = casranks.filter(rank => member.roles.cache.map(role => role.name).includes(rank)).pop();

      if (casranks.indexOf(lastRank) == casranks.length - 1) {
        return message.channel.send(`This person is already ${lastRank} and cannot get any more cas roles.`);
      }
      else if (lastRank != undefined) {
        member.roles.add(message.guild.roles.cache.find(role => role.name == casranks[casranks.indexOf(lastRank) + 1]))
          .then(newMember => message.channel.send(`Successfully gave ${casranks[casranks.indexOf(lastRank) + 1]} to ${newMember.nickname}`));
      }
      else {
        sweatranks.forEach(sweatRank => {
          if (memberRoles.includes(sweatRank)) {
            member.roles.remove(member.roles.cache.find(role => role.name == sweatRank));
          }
        });

        member.roles.add(message.guild.roles.cache.find(role => role.name == "Cas"))
          .then(newMember => message.channel.send(`Successfully gave Cas to ${newMember.nickname}`));
      }
    });
  }
}