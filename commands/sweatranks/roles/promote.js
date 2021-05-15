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
      slashOptions: [{
        name: "member",
        description: "Member to promote",
        type: "USER",
        required: true
      }, {
        name: "times",
        description: "Times to promote",
        type: "INTEGER"
      }],
      args: [{
        id: "content",
        match: "content"
      }]
    });

    this.messagesToSend = {};
  }

  async exec(message, args) {
    if (message?.constructor?.name == "CommandInteraction") {
      const member = message.options[0].member;
      const repeatTimes = message.options.length > 1 ? message.options[1].value : 1;
      await member.fetch(true);
      this.promoteMember(message, member, member.roles.cache.map(role => role.name), repeatTimes);
    }
    else {
      args = args.content.split(" ");
      let repeatTimes = 1;

      if (!isNaN(parseInt(args[0]))) {
        repeatTimes = parseInt(args[0]);
      }
      else if (!isNaN(parseInt(args.slice(-1)))) {
        repeatTimes = parseInt(args.slice(-1));
      }

      this.messagesToSend = {};
      const guildMembers = await message.guild.members.fetch();

      if (message.mentions.everyone || args.includes("everyone")) {
        guildMembers.filter(member => !member.user.bot && member.roles.cache.has("775799853077758053")).forEach(async member => {
          this.messagesToSend[member.displayName] = [];
          await member.fetch(true);
          this.promoteMember(message, member, member.roles.cache.map(role => role.name), repeatTimes);
        });
      }
      else {
        const membersToModify = await resolveMembers(args.join(" "), guildMembers);

        membersToModify.forEach(async member => {
          await member.fetch(true);
          this.promoteMember(message, member, member.roles.cache.map(role => role.name), repeatTimes);
        });
      }
    }
  }

  async promoteMember(message, member, roles, repeatTimes) {
    const strikes = strikesJSON.get();

    if (repeatTimes == 0) {
      roles = await Promise.all(roles.map(async role => await resolveRole(role, message.guild.roles.cache)));

      member.roles.set(roles);

      if (message?.constructor?.name == "CommandInteraction") {
        return message.reply(this.messagesToSend[member.displayName].join("\n"));
      }
      else {
        if (message.channel) message.channel.send(this.messagesToSend[member.displayName].join("\n"), { split: true });
        return;
      }
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