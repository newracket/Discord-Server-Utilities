const { CustomCommand } = require("../../modules/utils");
const mathjs = require("mathjs");

class MathCommand extends CustomCommand {
  constructor() {
    super('math', {
      aliases: ['math'],
      description: "Solves math problems. For log, use the format log(number, base).",
      usage: "math <problem>",
      category: "Misc",
      slashCommand: true,
      args: [{
        id: "content",
        type: "string",
        match: "content",
        description: "Math problem problems. For log, use the format log(number, base)."
      }]
    });
  }

  async exec(message, args) {
    const output = mathjs.evaluate(args.content);

    message.reply(output);
  };
}

module.exports = MathCommand;