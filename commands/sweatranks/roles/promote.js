const { sweatranks, casranks } = require("../../../jsons/ranks.json");
const { strikesChannelId } = require("../../../config.json");
const JSONFileManager = require("../../../modules/jsonfilemanager");
const { CustomCommand, resolveMembers, resolveRole, resolveChannel, resolveMessage } = require("../../../modules/utils");

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
      slashCommand: true,
      args: [{
        id: "member",
        description: "Member to promote",
        type: "member",
        required: true
      }, {
        id: "times",
        description: "Times to promote",
        type: "integer",
        default: 1
      }]
    });

    this.messagesToSend = {};
  }

  async exec(message, args) {
    this.messagesToSend = {};
    console.log(args);
    this.promoteMember(message, args.member, args.member.roles.cache.map(role => role.name), args.times);
  }

  async promoteMember(message, member, roles, repeatTimes) {
    const strikes = strikesJSON.get();

    if (repeatTimes == 0) {
      roles = await Promise.all(roles.map(async role => await resolveRole(role, message.guild.roles.cache)));

      member.roles.set(roles);
      return message.reply(this.messagesToSend[member.displayName].join("\n"));
    }

    if (!this.messagesToSend[member.displayName]) {
      this.messagesToSend[member.displayName] = [];
    }

    if (casranks.filter(rank => roles.includes(rank)).length > 0) {
      const lastRank = casranks.filter(rank => roles.includes(rank)).pop();
      const strikesChannel = await resolveChannel(strikesChannelId, message);

      if (strikes[member.id] == undefined) {
        const newMessage = await strikesChannel.send(`${member.displayName} - 1`)
        strikes[member.id] = { "messageId": newMessage.id, "value": 1 };
        this.messagesToSend[member.displayName].push(`<@${member.id}> was given his first strike.`);

        strikesJSON.set(strikes);
        return this.promoteMember(message, member, roles, repeatTimes - 1);
      }
      else if (strikes[member.id].value < 3) {
        const strikesMessage = await resolveMessage(strikesChannel, strikes[member.id].messageId);
        strikes[member.id].value += 1;

        if (strikes[member.id].value == 3) {
          await strikesMessage.edit(`${member.displayName} - ${strikes[member.id].value} (Removed ${lastRank} Role)`);
          this.messagesToSend[member.displayName].push(`<@${member.id}> was given his last strike. He has now been promoted.`);

          roles.splice(roles.indexOf(lastRank), 1);
          delete strikes[member.id];
          strikesJSON.set(strikes);

          return this.promoteMember(message, member, roles, repeatTimes - 1);
        }
        else {
          await strikesMessage.edit(`${member.displayName} - ${strikes[member.id].value}`);
          this.messagesToSend[member.displayName].push(`<@${member.id}> was given his second strike.`);
          strikesJSON.set(strikes);

          return this.promoteMember(message, member, roles, repeatTimes - 1);
        }
      }
    }
    else {
      const lastRank = sweatranks.filter(rank => roles.includes(rank)).pop();

      if (sweatranks.indexOf(lastRank) != sweatranks.length - 1) {
        roles.push(sweatranks[sweatranks.indexOf(lastRank) + 1]);

        if (member.id == "301200493307494400") {
          this.messagesToSend[member.displayName].push(`<@${member.id}> was promoted to ${sweatranks[sweatranks.indexOf(lastRank) + 1]}. This is a cap promotion.`);
        }
        else {
          this.messagesToSend[member.displayName].push(`<@${member.id}> was promoted to ${sweatranks[sweatranks.indexOf(lastRank) + 1]}.`);
        }
        return this.promoteMember(message, member, roles, repeatTimes - 1);
      }
      else {
        this.messagesToSend[member.displayName].push("Error. This person is already maximum sweat.");
        return this.promoteMember(message, member, roles, 0);
      }
    }
  }
}

module.exports = PromoteCommand;