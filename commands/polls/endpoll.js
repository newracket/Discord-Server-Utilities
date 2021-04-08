const { CustomCommand } = require("../../modules/custommodules");
const JSONFileManager = require("../../modules/jsonfilemanager");

const storedpollsJSON = new JSONFileManager("storedpolls");

class CreatePollCommand extends CustomCommand {
  constructor() {
    super('endpoll', {
      aliases: ['endpoll', 'ep'],
      description: "Ends a poll",
      usage: "endpoll <poll number>",
      category: "Polls",
      args: [
        {
          id: "pollNum",
          type: "integer"
        }
      ]
    });
  }

  async exec(message, args) {
    const storedpolls = storedpollsJSON.get();
    storedpolls[args.pollNum - 1].ended = true;
    storedpollsJSON.set(storedpolls);

    const endedPollMessage = await message.guild.channels.cache.get(storedpolls[args.pollNum - 1].channel).messages.fetch(storedpolls[args.pollNum - 1].id);
    await endedPollMessage.reactions.removeAll();

    message.channel.send("The poll has been ended.");
  }
}

module.exports = CreatePollCommand;