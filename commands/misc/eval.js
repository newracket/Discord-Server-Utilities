const { CustomCommand } = require("../../modules/utils");

class EvalCommand extends CustomCommand {
  constructor() {
    super('eval', {
      aliases: ['eval'],
      description: "Evaluates a command",
      usage: "eval <nodejs code>",
      category: "Misc",
      ownerOnly: true,
      slashCommand: true,
      args: [{
        id: "content",
        match: "content",
        type: "string",
        description: "Nodejs code to evaluate",
        required: true
      }]
    });
  }

  async exec(message, args) {
    if (!args) {
      args = { content: message.options[0].value };
    }
    let output = eval(args.content);

    if (output == undefined) {
      return message.channel.send("Output is undefined");
    }
    if (typeof output != "string") {
      output = output.toString();
    }

    message.reply(output);
  }
}

module.exports = EvalCommand;