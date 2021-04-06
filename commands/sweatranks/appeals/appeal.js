const { CustomCommand } = require("../../../modules/custommodules");
const JSONFileManager = require("../../../modules/jsonfilemanager");

const appealsJSON = new JSONFileManager("appeals");

class AppealCommand extends CustomCommand {
  constructor() {
    super('appeal', {
      aliases: ['appeal'],
      description: "Creates an appeal",
      usage: "appeal <appeal text>",
      category: "Sweatranks",
      channel: "guild",
      args: [{
        id: "appealText",
        type: "string",
        match: "content"
      }]
    });
  }

  exec(message, args) {
    const embedOutput = this.client.util.embed({
      color: '#abd5ff',
      title: `Appeal #${appealsJSON.numKeys() + 1} - Awaiting Approval`,
      author: {
        name: message.member.displayName,
        icon_url: message.author.displayAvatarURL()
      },
      description: args.appealText
    });

    message.channel.send(embedOutput).then(newMessage => appealsJSON.setValue(appealsJSON.numKeys() + 1, { channel: newMessage.channel.id, id: newMessage.id }))
      .then(() => message.delete());
  }
}

module.exports = AppealCommand;