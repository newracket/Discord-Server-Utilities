const fs = require("fs");
const { sweatranks, casranks } = require("../ranks.json");
const { strikesChannelId } = require("../config.json");
const strikes = JSON.parse(fs.readFileSync("./strikes.json"));

module.exports = {
  name: "promote",
  description: "Promotes a member",
  aliases: ["p"],
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

    const membersToModify = args.map(arg => message.guild.members.cache.find(member => member.nickname == arg)).filter(e => e != undefined);
    [...Array.from(message.mentions.members, ([name, value]) => (value)), ...membersToModify].forEach(member => {
      this.messagesToSend[member.nickname] = [];
      this.promoteMember(message, member, member.roles.cache.map(role => role.name), repeatTimes);
    });
  },
  promoteMember(message, member, roles, repeatTimes) {
    if (repeatTimes == 0) {
      const rolesDir = message.guild.roles.cache.map(role => { return { name: role.name, id: role.id } });
      roles = roles.map(role => rolesDir.find(r => r.name == role).id);

      return member.roles.set(roles).then(newMember => message.channel.send(this.messagesToSend[newMember.nickname].join("\n")));
    }

    if (casranks.filter(rank => roles.includes(rank)).length > 0) {
      const lastRank = casranks.filter(rank => roles.includes(rank)).pop();

      if (strikes[member.id] == undefined) {
        return message.guild.channels.cache.find(channel => channel.id == strikesChannelId).send(`${member.nickname} - 1`)
          .then(newMessage => {
            strikes[member.id] = { "messageId": newMessage.id, "value": 1 };
            this.messagesToSend[member.nickname].push(`<@${member.id}> was given his first strike.`);

            fs.writeFileSync("strikes.json", JSON.stringify(strikes));

            return this.promoteMember(message, member, roles, repeatTimes - 1);
          });
      }
      else if (strikes[member.id].value < 3) {
        message.guild.channels.cache.find(channel => channel.id == strikesChannelId).messages.fetch(strikes[member.id].messageId)
          .then(newMessage => {
            strikes[member.id].value += 1;

            if (strikes[member.id].value == 3) {
              newMessage.edit(`${member.nickname} - ${strikes[member.id].value} (Removed ${lastRank} Role)`);
              this.messagesToSend[member.nickname].push(`<@${member.id}> was given his last strike. He has now been promoted.`);

              roles.splice(roles.indexOf(lastRank), 1);
              delete strikes[member.id];
              fs.writeFileSync("strikes.json", JSON.stringify(strikes));

              return this.promoteMember(message, member, roles, repeatTimes - 1);
            }
            else {
              newMessage.edit(`${member.nickname} - ${strikes[member.id].value}`);
              this.messagesToSend[member.nickname].push(`<@${member.id}> was given his second strike.`);
              fs.writeFileSync("strikes.json", JSON.stringify(strikes));

              return this.promoteMember(message, member, roles, repeatTimes - 1);
            }
          });
      }
    }
    else {
      const lastRank = sweatranks.filter(rank => roles.includes(rank)).pop();

      if (sweatranks.indexOf(lastRank) != sweatranks.length - 1) {
        roles.push(sweatranks[sweatranks.indexOf(lastRank) + 1]);

        if (member.id == "301200493307494400") {
          this.messagesToSend[member.nickname].push(`<@${member.id}> was promoted to ${sweatranks[sweatranks.indexOf(lastRank) + 1]}. This is a cap promotion.`);
        }
        else {
          this.messagesToSend[member.nickname].push(`<@${member.id}> was promoted to ${sweatranks[sweatranks.indexOf(lastRank) + 1]}.`);
        }
        return this.promoteMember(message, member, roles, repeatTimes - 1);
      }
      else {
        this.promoteMember(message, member, roles, 0);
        return message.channel.send("Error. This person is already maximum sweat.");
      }
    }
  }
}