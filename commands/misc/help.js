const { CustomCommand } = require("../../modules/custommodules");

class HelpCommand extends CustomCommand {
  constructor() {
    super('help', {
      aliases: ['help', 'h'],
      description: "Help command",
      usage: "help OR help <category name> OR help <command name>",
      category: "Misc",
      args: [{
        id: "category",
        type: "string"
      }]
    });
  }

  exec(message, args) {
    let embedOutput;

    if (args.category) {
      let commandsObject = this.handler.categories.find(category => category.id.toLowerCase() == args.category.toLowerCase());

      if (!commandsObject) {
        commandsObject = this.handler.modules.filter(command => command.id.toLowerCase() == args.category.toLowerCase() || command.aliases.map(e => e.toLowerCase()).includes(args.category.toLowerCase()));

        if (commandsObject.size == 0) return message.channel.send("There is no command or category with that name");
      }

      embedOutput = this.client.util.embed({ color: '#0099ff', title: `Server Helper Bot ${commandsObject.first().categoryID} Commands`, footer: { text: `Do ${this.handler.prefix}help <category name> or ${this.handler.prefix}help <command name> to get more details` } });

      commandsObject.forEach(command => {
        embedOutput.addField(`${command.id}`, `
          Description: \`${command.description}\`
          Usage: \`${command.usage.replace(new RegExp(command.id, "g"), command.handler.prefix + command.id)}\`
          Aliases: \`${command.aliases.join(", ")}\``);
      });
    }
    else {
      embedOutput = this.client.util.embed({ color: '#0099ff', title: "Server Helper Bot Commands", footer: { text: `Do ${this.handler.prefix}help <category name> or ${this.handler.prefix}help <command name> to get more details` } });
      this.handler.categories.forEach(category => {
        embedOutput.addField(`${category.id}`, category.map(command => `\`${command.id}\``).join(" "));
      });
    }

    message.channel.send(embedOutput);
  }
}

module.exports = HelpCommand;