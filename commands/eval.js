const { Command } = require('discord-akairo');

class EvalCommand extends Command {
  constructor() {
    super('eval', {
      aliases: ['eval', 'e'],
      description: "Evaluates a command",
      ownerOnly: true,
      args: [
        {
          id: "message",
          match: "content"
        }
      ]
    });
  }

  exec(message, args) {
    let output = eval(args.message);
    if (output == undefined) {
      return message.channel.send("Output is undefined");
    }
    if (typeof output != "string") {
      output = output.toString();
    }
    const outputTexts = output.match(/.{1,1900}/g);

    outputTexts.forEach(outputText => {
      message.channel.send(outputText);
    });
  }
}

module.exports = EvalCommand;