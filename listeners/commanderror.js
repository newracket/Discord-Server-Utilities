const { Listener } = require('discord-akairo');

class CommandErrorListener extends Listener {
  constructor() {
    super('error', {
      emitter: 'commandHandler',
      event: 'error'
    });
  }

  exec(error, message, command) {
    message.channel.send(`Error: ${error}`);
  }
}

module.exports = CommandErrorListener;