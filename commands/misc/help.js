const { CustomCommand } = require("../../modules/custommodules");

class HelpCommand extends CustomCommand {
  constructor() {
    super('help', {
      aliases: ['help', 'h'],
      description: "Help command",
      usage: "help OR help <category name>",
      category: "Misc",
      args: [{
        id: "category",
        type: "string"
      }]
    });
  }

  exec(message, args) {
    let commands;

    if (args.category) {
      commands = this.handler.categories.find(category => category.id.toLowerCase() == args.category.toLowerCase());
      if (!commands) {
        commands = this.handler.modules;
      }
    }
    else {
      commands = this.handler.modules;
    }

    const embedOutput = this.client.util.embed({ color: '#0099ff', title: "Server Helper Bot Commands" });
    commands.forEach(command => {
      embedOutput.addField(`${command.categoryID} - ${command.id}`, `${command.description}\n${command.handler.prefix}${command.usage}`);
    });

    message.channel.send(embedOutput);
  }
}

module.exports = HelpCommand;