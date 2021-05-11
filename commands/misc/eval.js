const { CustomCommand } = require("../../modules/utils");

class EvalCommand extends CustomCommand {
  constructor() {
    super('eval', {
      aliases: ['eval'],
      description: "Evaluates a command",
      usage: "eval <nodejs code>",
      category: "Misc",
      ownerOnly: true,
      args: [
        {
          id: "content",
          match: "content"
        }
      ]
    });
  }

  async exec(message, args) {
    let output = eval(args.content);

    if (output == undefined) {
      return message.channel.send("Output is undefined");
    }
    if (typeof output != "string") {
      output = output.toString();
    }

    message.channel.send(output, { split: true });
  }
}

module.exports = EvalCommand;