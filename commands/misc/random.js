const { CustomCommand } = require("../../modules/custommodules");

class RandomCommand extends CustomCommand {
  constructor() {
    super('random', {
      aliases: ['random', 'rand'],
      description: "Randomly chooses selection from given choices",
      usage: "random <options to randomly choose from, separated by spaces or commas>",
      category: "Misc",
      args: [
        {
          id: "options",
          match: "content"
        }
      ]
    });
  }

  exec(message, args) {
    let randomOptions = args.options.split(",");
    if (args.options == "all") {
      randomOptions = ["aniket", "aaron", "achintya", "alan", "david", "eric", "gio", "john", "justin", "mena", "oscar", "skyler"];
    }
    else if (!args.options.includes(",")) {
      randomOptions = args.options.split(" ");
    }
    const randomIndex = Math.floor(Math.random() * randomOptions.length);

    message.channel.send(`Your random selection is: ${randomOptions[randomIndex].trim()}`);
  }
}

module.exports = RandomCommand;