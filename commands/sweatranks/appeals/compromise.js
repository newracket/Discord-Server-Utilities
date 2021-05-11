const { CustomCommand, resolveMessage } = require("../../../modules/utils");
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

  async exec(message, args) {
    const appealObj = appealsJSON.getValue(args.appealNum);

    const appealMessage = await resolveMessage(appealObj.channel, appealObj.id, message);
    const newEmbed = appealMessage.embeds[0]
      .setColor("#ffe436")
      .setTitle(`Appeal #${args.appealNum} - Compromised`)
      .addField(`Reasoning for compromise from ${message.member.nickname}`, args.reason ? args.reason : "None");
    await appealMessage.edit(newEmbed)
    message.delete();
  }
}

module.exports = CompromiseCommand;