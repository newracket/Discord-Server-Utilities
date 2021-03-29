const { Listener } = require('discord-akairo');

class CommandBlockedListener extends Listener {
  constructor() {
    super('commandBlocked', {
      emitter: 'commandHandler',
      event: 'commandBlocked'
    });
  }

  exec(message, command, reason) {
    switch (reason) {
      case "guild": return message.channel.send("You may only use this command in discord servers");
      case "owner": return message.channel.send("Only the owner may use this command");
    }

    message.channel.send(`${message.author.username} was blocked from using ${command.id} because of ${reason}!`);
  }
}

module.exports = CommandBlockedListener;