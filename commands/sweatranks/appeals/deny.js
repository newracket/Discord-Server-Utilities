const { CustomCommand } = require("../../../modules/custommodules");
const JSONFileManager = require("../../../modules/jsonfilemanager");

const appealsJSON = new JSONFileManager("appeals");

class DenyCommand extends CustomCommand {
  constructor() {
    super('deny', {
      aliases: ['deny', 'reject'],
      description: "Denies an appeal",
      usage: "deny <appeal number> <reason>",
      category: "Sweatranks",
      channel: "guild",
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
        .setColor("#ff1212")
        .setTitle(`Appeal #${args.appealNum} - Denied`)
        .spliceFields(0, 25)
        .addField(`Reasoning from ${message.member.nickname}`, args.reason ? args.reason : "None");
      appealMessage.edit(newEmbed);
    });
  }
}

module.exports = DenyCommand;