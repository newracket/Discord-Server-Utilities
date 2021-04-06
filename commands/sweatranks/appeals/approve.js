const { CustomCommand } = require("../../../modules/custommodules");
const JSONFileManager = require("../../../modules/jsonfilemanager");

const appealsJSON = new JSONFileManager("appeals");

class ApproveCommand extends CustomCommand {
  constructor() {
    super('approve', {
      aliases: ['approve', 'accept'],
      description: "Approves an appeal",
      usage: "approve <appeal number> <reason>",
      category: "Sweatranks",
      channel: "guild",
      permittedRoles: ["King of Sweats", "Royal Advisor"],
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
        .setColor("#42f563")
        .setTitle(`Appeal #${args.appealNum} - Approved`)
        .spliceFields(0, 25)
        .addField(`Reasoning from ${message.member.nickname}`, args.reason ? args.reason : "None");
      appealMessage.edit(newEmbed).then(() => message.delete());
    });
  }
}

module.exports = ApproveCommand;