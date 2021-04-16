const { sweatranks, casranks } = require("../../../jsons/ranks.json");
const { strikesChannelId } = require("../../../config.json");
const JSONFileManager = require("../../../modules/jsonfilemanager");
const { CustomCommand } = require("../../../modules/custommodules");

const strikesJSON = new JSONFileManager("strikes");

class PromoteCommand extends CustomCommand {
  constructor() {
    super('promote', {
      aliases: ['promote', 'p'],
      description: "Promotes a member",
      usage: "promote <mention members> <amount> OR promote <member nicknames> <amount>",
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
          this.promoteMember(message, member, member.roles.cache.map(role => role.name), repeatTimes);
        });
      });
  }

  promoteMember(message, member, roles, repeatTimes) {
    const strikes = strikesJSON.get();

    if (repeatTimes == 0) {
      const rolesDir = message.guild.roles.cache.map(role => { return { name: role.name, id: role.id } });
      roles = roles.map(role => rolesDir.find(r => r.name == role).id);

      return member.roles.set(roles).then(newMember => message.channel.send(this.messagesToSend[newMember.nickname].slice(-1)[0]))
        .catch(err => message.channel.send(`Error: ${err}`));
    }

    if (casranks.filter(rank => roles.includes(rank)).length > 0) {
      const lastRank = casranks.filter(rank => roles.includes(rank)).pop();

      if (strikes[member.id] == undefined) {
        return message.guild.channels.cache.find(channel => channel.id == strikesChannelId).send(`${member.nickname} - 1`)
          .then(newMessage => {
            strikes[member.id] = { "messageId": newMessage.id, "value": 1 };
            this.messagesToSend[member.nickname].push(`<@${member.id}> was given his first strike.`);

            strikesJSON.set(strikes);

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
              strikesJSON.set(strikes);

              return this.promoteMember(message, member, roles, repeatTimes - 1);
            }
            else {
              newMessage.edit(`${member.nickname} - ${strikes[member.id].value}`);
              this.messagesToSend[member.nickname].push(`<@${member.id}> was given his second strike.`);
              strikesJSON.set(strikes);

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
        return this.promoteMember(message, member, roles, 0);
      }
    }
  }
}

module.exports = PromoteCommand;