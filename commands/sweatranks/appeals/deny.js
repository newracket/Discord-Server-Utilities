const { CustomCommand, resolveMessage } = require("../../../modules/utils");
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
      .setColor("#ff1212")
      .setTitle(`Appeal #${args.appealNum} - Denied`)
      .addField(`Reasoning for denial from ${message.member.nickname}`, args.reason ? args.reason : "None");

    await appealMessage.edit(newEmbed);
    message.delete();
  }
}

module.exports = DenyCommand;