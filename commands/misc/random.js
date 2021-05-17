const { CustomCommand } = require("../../modules/utils");

class RandomCommand extends CustomCommand {
  constructor() {
    super('random', {
      aliases: ['random', 'rand'],
      description: "Randomly chooses selection from given choices",
      usage: "random <options to randomly choose from, separated by spaces or commas>",
      category: "Misc",
      slashCommand: true,
      args: [{
        id: "options",
        match: "content",
        type: "string",
        required: true,
        description: "Options to randomly select from"
      }]
    });
  }

  async exec(message, args) {
    if (!args.options) args.options = "all";
    console.log(args);

    let randomOptions = args.options.split(",");
    if (args.options.trim() == "all") {
      randomOptions = ["aniket", "aaron", "achintya", "alan", "david", "eric", "gio", "john", "justin", "mena", "oscar"];
    }
    else if (!args.options.includes(",")) {
      randomOptions = args.options.split(" ");
    }
    const randomIndex = Math.floor(Math.random() * randomOptions.length);

    message.reply(`Your random selection is: ${randomOptions[randomIndex].trim()}`);
  }
}

module.exports = RandomCommand;