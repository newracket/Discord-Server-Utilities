const { CustomCommand } = require("../../../modules/custommodules");
const JSONFileManager = require("../../../modules/jsonfilemanager");

const appealsJSON = new JSONFileManager("appeals");

class CounterCommand extends CustomCommand {
  constructor() {
    super('counter', {
      aliases: ['counter'],
      description: "Counters an appeal",
      usage: "counter <appeal number> <counter>",
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

  exec(message, args) {
    const appealObj = appealsJSON.getValue(args.appealNum);

    message.guild.channels.cache.get(appealObj.channel).messages.fetch(appealObj.id).then(appealMessage => {
      const newEmbed = appealMessage.embeds[0]
        .setColor("#abd5ff")
        .setTitle(`Appeal #${args.appealNum} - Awaiting Approval`)
        .addField(`Counter from ${message.member.nickname}`, args.counter ? args.counter : "None");

      appealMessage.edit(newEmbed).then(() => message.delete());
    });
  }
}

module.exports = CounterCommand;