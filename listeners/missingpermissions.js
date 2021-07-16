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
      case "role": {
        if (message.channel.id == "828155824966205440") {
          message.author.send(`You are missing permissions. Roles required: ${missing.join(", ")}`);
          message.delete();
        }
        else {
          message.reply(`You are missing permissions. Roles required: ${missing.join(", ")}`);
        }
        break;
      };
      case "client": return message.reply("This bot is missing permissions to do that");
      case "user": return message.reply(`You do not have permissions to do that. Permissions required: ${missing.join(", ")}`);
    }

    message.reply(`${message.author.username} was blocked from using ${command.id} because of ${reason}!`);
  }
}

module.exports = MissingPermissionsListener;