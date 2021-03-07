module.exports = {
  name: "help",
  description: "Help command",
  aliases: ["h"],
  execute(message, args, client) {
    let outputText = "```\nList of commands:\n\n";

    client.commands.forEach(command => {
      outputText += command.name + ": ";
      outputText += command.description + "\n";
    });

    outputText += "```";
    message.channel.send(outputText);
  }
}