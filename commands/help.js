// const { Command } = require('discord-akairo');

// class HelpCommand extends Command {
//   constructor() {
//     super('help', {
//       aliases: ['help', 'h'],
//       description: "Help command",
//     });
//   }

//   exec(message) {
//     let outputText = "```\nList of commands:\n\n";

//     message.client.commands.forEach(command => {
//       outputText += command.name + ": ";
//       outputText += command.description + "\n";
//     });

//     outputText += "```";
//     message.channel.send(outputText);
//   }
// }

// module.exports = HelpCommand;