const { Listener } = require("discord-akairo");
const { Message } = require("discord.js");
const { logsChannelId } = require("../config.json");
const { resolveChannel } = require("../modules/utils");

class CommandFinishedListener extends Listener {
  constructor() {
    super("commandFinished", {
      emitter: "commandHandler",
      event: "commandFinished"
    });
  }

  async exec(message, command, args, returnValue) {
    if (command.logCommand && returnValue && !(returnValue instanceof Message)) {
      const channel = await resolveChannel(logsChannelId, message);
      const embedOutput = this.client.util.embed({
        color: "#0cb334",
        title: `${command.id.charAt(0).toUpperCase() + command.id.slice(1)} Command Executed Successfully`,
        author: {
          name: message.member.displayName,
          icon_url: message.author.displayAvatarURL()
        },
        description: `Command: \`${message.content}\`\nOutput: \`${returnValue}\``
      });

      channel.send(embedOutput);
    }
  }
}

module.exports = CommandFinishedListener;