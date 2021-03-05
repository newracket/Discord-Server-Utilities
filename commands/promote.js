const fs = require("fs");
const { sweatranks, casranks } = require("../ranks.json");
const strikes = JSON.parse(fs.readFileSync("./strikes.json"));

module.exports = {
  name: "promote",
  description: "Checks reminders (DEBUGGING ONLY)",
  execute(message, args, client) {
    if (!["greentoxic", "newracket"].includes(message.author.username)) {
      return message.channel.send("You do not have permissions to promote someone.");
    }

    message.mentions.members.forEach(member => {
      if (casranks.filter(rank => member.roles.cache.map(role => role.name).includes(rank)).length > 0) {
        const lastRank = casranks.filter(rank => member.roles.cache.map(role => role.name).includes(rank)).pop();

        if (strikes[member.id] == undefined) {
          message.guild.channels.cache.find(channel => channel.id == "633171389159047169").send("1")
            .then(newMessage => {
              strikes[member.id] = { "messageId": newMessage.id, "value": 1 };

              fs.writeFileSync("strikes.json", JSON.stringify(strikes));
            });
        }
        else if (strikes[member.id].value < 3) {
          message.guild.channels.cache.find(channel => channel.id == "633171389159047169").messages.fetch(strikes[member.id].messageId)
            .then(newMessage => {
              strikes[member.id].value += 1;
              newMessage.edit(strikes[member.id].value);

              if (strikes[member.id].value == 3) {
                member.roles.remove(message.guild.roles.cache.find(role => role.name == lastRank));
                delete strikes[member.id];
              }

              fs.writeFileSync("strikes.json", JSON.stringify(strikes));
            });
        }
      }
      else {
        const lastRank = sweatranks.filter(rank => member.roles.cache.map(role => role.name).includes(rank)).pop();

        if (sweatranks.indexOf(lastRank) != sweatranks.length - 1) {
          member.roles.add(message.guild.roles.cache.find(role => role.name == sweatranks[sweatranks.indexOf(lastRank) + 1]));
        }
        else {
          message.channel.send("Error. This person is already maximum sweat.");
        }
      }
    });
  }
}