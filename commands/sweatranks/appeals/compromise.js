const { CustomCommand } = require("../../../modules/custommodules");
const JSONFileManager = require("../../../modules/jsonfilemanager");

const appealsJSON = new JSONFileManager("appeals");

class CompromiseCommand extends CustomCommand {
  constructor() {
    super('compromise', {
      aliases: ['compromise', 'comp'],
      description: "Compromises for an appeal",
      usage: "compromise <appeal number> <compromise text>",
      category: "Sweatranks",
      channel: "guild",
      permittedRoles: ["726565862558924811", "820159352215961620"],
      args: [{
        id: "appealNum"
      },
      {
        id: "reason",
        match: "restContent"
      }]
    });
  }

  exec(message, args) {
    const appealObj = appealsJSON.getValue(args.appealNum);

    message.guild.channels.cache.get(appealObj.channel).messages.fetch(appealObj.id).then(appealMessage => {
      const newEmbed = appealMessage.embeds[0]
        .setColor("#ffe436")
        .setTitle(`Appeal #${args.appealNum} - Compromised`)
        .addField(`Reasoning for compromise from ${message.member.nickname}`, args.reason ? args.reason : "None");
      appealMessage.edit(newEmbed).then(() => message.delete());
    });
  }
}

module.exports = CompromiseCommand;