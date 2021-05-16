const { CustomCommand } = require("../../modules/utils");
const { exec } = require("child_process");

class ExecCommand extends CustomCommand {
  constructor() {
    super('exec', {
      aliases: ['exec'],
      description: "Executes a linux command",
      usage: "exec <linux code>",
      category: "Misc",
      ownerOnly: true,
      slashCommand: true,
      args: [{
          id: "code",
          match: "content",
          type: "string",
          description: "Linux code to execute",
          required: true
        }]
    });
  }

  async exec(message, args) {
    exec(args.code, (error, data) => {
      if (error) {
        return message.reply(error.message);
      }

      message.reply(data.length > 0 ? data : "Empty");
    });
  }
}

module.exports = ExecCommand;