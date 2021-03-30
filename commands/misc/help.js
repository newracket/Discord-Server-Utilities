const { CustomCommand } = require("../../modules/custommodules");

class HelpCommand extends CustomCommand {
  constructor() {
    super('help', {
      aliases: ['help', 'h'],
      description: "Help command",
      usage: "help",
      category: "Misc"
    });
  }

  exec(message) {
    // let outputText = "```\nList of commands:\n\n";
    const embedOutput = this.client.util.embed({ color: '#0099ff', title: "Server Helper Bot Commands" });
    this.handler.modules.forEach(command => {
      // outputText += command.id + ": ";
      // outputText += command.description + "\n";
      embedOutput.addField(command.id, `${command.description}\n${command.handler.prefix}${command.usage}`);
    });

    // outputText += "```";
    // message.channel.send(outputText);
    message.channel.send(embedOutput);
  }
}

module.exports = HelpCommand;