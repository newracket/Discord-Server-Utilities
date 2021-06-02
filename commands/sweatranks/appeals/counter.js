const { CustomCommand, resolveMessage } = require("../../../modules/utils");
const JSONFileManager = require("../../../modules/jsonfilemanager");

const appealsJSON = new JSONFileManager("appeals");

class CounterCommand extends CustomCommand {
  constructor() {
    super('counter', {
      aliases: ['counter'],
      description: "Counters an appeal",
      usage: "counter <appeal number> <argument>",
      category: "Sweatranks",
      channel: "guild",
      args: [{
        id: "appealNum"
      },
      {
        id: "counter",
        match: "restContent"
      }]
    });
  }

  async exec(message, args) {
    const appealObj = appealsJSON.getValue(args.appealNum);

    const appealMessage = await resolveMessage(appealObj.channel, appealObj.id, message);
    const newEmbed = appealMessage.embeds[0]
      .setColor("#abd5ff")
      .setTitle(`Appeal #${args.appealNum} - Awaiting Approval`)
      .addField(`Counter from ${message.member.nickname}`, args.counter ? args.counter : "None");

    await appealMessage.edit(newEmbed)
    message.delete();
  }
}

module.exports = CounterCommand;