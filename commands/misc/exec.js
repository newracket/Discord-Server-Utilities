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
      args: [
        {
          id: "content",
          match: "content"
        }
      ]
    });
  }

  async exec(message, args) {
    exec(args.content, (error, data) => {
      if (error) {
        return message.channel.send(error.message);
      }
      
      message.channel.send(data.length > 0 ? data : "Empty");
    });
  }
}

module.exports = ExecCommand;