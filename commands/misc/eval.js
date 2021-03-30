const { CustomCommand } = require("../../modules/custommodules");

class EvalCommand extends CustomCommand {
  constructor() {
    super('eval', {
      aliases: ['eval', 'e'],
      description: "Evaluates a command",
      usage: "eval <nodejs code>",
      category: "Misc",
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