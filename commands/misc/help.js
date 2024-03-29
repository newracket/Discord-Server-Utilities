const { CustomCommand } = require("../../modules/utils");

class HelpCommand extends CustomCommand {
  constructor() {
    super('help', {
      aliases: ['help', 'h'],
      description: "Help command",
      usage: "help OR help <category name> OR help <command name>",
      category: "Misc",
      slashCommand: true,
      args: [{
        id: "command",
        type: "string",
        description: "Command name or category name to get help for"
      }]
    });
  }

  async exec(message, args) {
    let embedOutput;

    if (args.command) {
      let commandsObject = this.handler.categories.find(category => category.id.toLowerCase() == args.command.toLowerCase());

      if (!commandsObject) {
        commandsObject = this.handler.modules.filter(command => command.id.toLowerCase() == args.command.toLowerCase() || command.aliases.map(e => e.toLowerCase()).includes(args.command.toLowerCase()));

        if (commandsObject.size == 0) return message.reply("There is no command or category with that name");
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

    message.reply(embedOutput);
  }
}

module.exports = HelpCommand;