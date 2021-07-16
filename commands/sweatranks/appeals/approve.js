const { CustomCommand, resolveMessage } = require("../../../modules/utils");
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

  async exec(message, args) {
    const appealObj = appealsJSON.getValue(args.appealNum);

    const appealMessage = await resolveMessage(appealObj.channel, appealObj.id, message);
    const newEmbed = appealMessage.embeds[0]
      .setColor("#42f563")
      .setTitle(`Appeal #${args.appealNum} - Approved`)
      .addField(`Reasoning for approval from ${message.member.nickname}`, args.reason ? args.reason : "None");
      
    await appealMessage.edit(newEmbed);
    message.delete();
  }
}

module.exports = ApproveCommand;