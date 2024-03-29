const { CustomCommand } = require("../../../modules/utils");
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
        match: "content"
      }]
    });
  }

  async exec(message, args) {
    const embedOutput = this.client.util.embed({
      color: '#abd5ff',
      title: `Appeal #${appealsJSON.numKeys() + 1} - Awaiting Approval`,
      author: {
        name: message.member.displayName,
        icon_url: message.author.displayAvatarURL()
      },
      description: args.appealText
    });

    if (message.attachments.size > 0) {
      embedOutput.setImage(message.attachments.first().proxyURL);
    }

    const newMessage = await message.channel.send(embedOutput)
    appealsJSON.setValue(appealsJSON.numKeys() + 1, { channel: newMessage.channel.id, id: newMessage.id });
    message.delete();
  }
}

module.exports = AppealCommand;