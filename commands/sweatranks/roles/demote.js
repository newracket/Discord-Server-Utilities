const { sweatranks, casranks } = require("../../../jsons/ranks.json");
const { strikesChannelId } = require("../../../config.json");
const { CustomCommand, resolveMembers, resolveRole, resolveMessage, resolveChannel } = require("../../../modules/utils");
const JSONFileManager = require("../../../modules/jsonfilemanager");

const strikesJSON = new JSONFileManager("strikes");

class DemoteCommand extends CustomCommand {
  constructor() {
    super('demote', {
      aliases: ['demote', 'd'],
      description: "Demotes a member",
      usage: "demote <mention users> <amount> OR demote <user nicknames> <amount>",
      category: "Sweatranks",
      channel: "guild",
      permittedRoles: ["726565862558924811", "820159352215961620"],
      slashCommand: true,
      logCommand: true,
      args: [{
        id: "member",
        description: "Member to demote",
        type: "member",
        match: "words",
        required: true
      }, {
        id: "times",
        description: "Times to demote",
        type: "integer",
        match: "last",
        default: 1
      }]
    });

    this.messagesToSend = {};
  }

  async exec(message, args) {
    this.messagesToSend = {};

    if (!args.member) return message.reply("You didn't specify anyone to demote.");
    if (!args.times) {
      args.times = 1;
    }

    if (Array.isArray(args.member)) {
      args.member.forEach(member => {
        this.demoteMember(message, member, member.roles.cache.map(role => role.name), args.times);
      });
    }
    else {
      return this.demoteMember(message, args.member, args.member.roles.cache.map(role => role.name), args.times);
    }
  }

  async demoteMember(message, member, roles, repeatTimes) {
    if (repeatTimes == 0) {
      roles = await Promise.all(roles.map(async role => await resolveRole(role, message.guild.roles.cache)));

      await member.roles.set([...new Set(roles)]);
      if (message.channel) message.reply({ content: this.messagesToSend[member.displayName].join("\n"), split: true });
      return `${member.displayName} was successfuly demoted ${this.messagesToSend[member.displayName].length} time${this.messagesToSend[member.displayName].length > 1 ? "s" : ""}`;
    }

    if (!this.messagesToSend[member.displayName]) {
      this.messagesToSend[member.displayName] = [];
    }

    const lastRank = sweatranks.filter(rank => roles.includes(rank)).pop();
    if (lastRank != undefined) {
      if (lastRank == "Sweat") {
        this.messagesToSend[member.displayName].push(`${member} was demoted to Member.`);
      }
      else {
        this.messagesToSend[member.displayName].push(`${member} was demoted to ${sweatranks[sweatranks.indexOf(lastRank) - 1]}.`);
      }

      roles.splice(roles.indexOf(lastRank), 1)
      return this.demoteMember(message, member, roles, repeatTimes - 1);
    }
    else {
      const lastRank = casranks.filter(rank => roles.includes(rank)).pop();

      if (casranks.indexOf(lastRank) == casranks.length - 1) {
        this.messagesToSend[member.displayName].push("Error. This person is cannot be demoted any further.");
        return this.demoteMember(message, member, roles, 0);
      }

      if (strikesJSON.hasKey(member.id)) {
        const strikesMessage = await resolveMessage(strikesChannelId, strikesJSON.getValue(member.id).messageId, message);
        if (strikesJSON.getValue(member.id).value == 1) {
          strikesJSON.deleteKey(member.id);

          await strikesMessage.delete();
          this.messagesToSend[member.displayName].push(`One strike was removed. ${member} now has 0 strikes.`);
        }
        else {
          const currentValue = strikesJSON.getValue(member.id);
          currentValue.value--;
          strikesJSON.setValue(member.id, currentValue);

          strikesMessage.edit(`${member.displayName} - ${currentValue.value}`);
          this.messagesToSend[member.displayName].push(`One strike was removed. ${member} now has 1 strike.`);
        }
      }
      else {
        this.messagesToSend[member.displayName].push(`${member} was demoted to ${casranks[casranks.indexOf(lastRank) + 1]} with 2 strikes.`);
        roles.push(casranks[casranks.indexOf(lastRank) + 1]);

        const strikesChannel = await resolveChannel(strikesChannelId, message);
        const sentMessage = await strikesChannel.send(`${member.displayName} - 2`);
        strikesJSON.setValue(member.id, { messageId: sentMessage.id, value: 2 });
      }
    }

    return this.demoteMember(message, member, roles, repeatTimes - 1);
  }
}

module.exports = DemoteCommand;