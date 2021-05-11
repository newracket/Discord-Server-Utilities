const { CustomCommand, resolveMessage } = require("../../modules/utils");
const JSONFileManager = require("../../modules/jsonfilemanager");

const storedpollsJSON = new JSONFileManager("storedpolls");

class EndPollCommand extends CustomCommand {
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

    const endedPollMessage = await resolveMessage(storedpolls[args.pollNum - 1].channel, storedpolls[args.pollNum - 1].id, message);
    await endedPollMessage.reactions.removeAll();

    message.channel.send("The poll has been ended.");
  }
}

module.exports = EndPollCommand;