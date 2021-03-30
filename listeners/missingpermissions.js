const { Listener } = require('discord-akairo');

class MissingPermissionsListener extends Listener {
  constructor() {
    super('missingPermissions', {
      emitter: 'commandHandler',
      event: 'missingPermissions'
    });
  }

  exec(message, command, reason, missing) {
    switch (reason) {
      case "role": return message.channel.send(`You are missing permissions. Roles required: ${missing.join(", ")}`);
      case "client": return message.channel.send("This bot is missing permissions to do that");
      case "user": return message.channel.send(`You do not have permissions to do that. Permissions required: ${missing.join(", ")}`);
    }

    message.channel.send(`${message.author.username} was blocked from using ${command.id} because of ${reason}!`);
  }
}

module.exports = MissingPermissionsListener;