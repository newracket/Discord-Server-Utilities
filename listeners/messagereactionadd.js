const { Listener } = require('discord-akairo');

class ReactionListener extends Listener {
  constructor() {
    super('messageReactionAdd', {
      emitter: 'client',
      event: 'messageReactionAdd'
    });
  }

  exec(reaction, user) {
    this.client.commandHandler.findCommand("createpoll").handleReaction(reaction, user, "add");
  }
}

module.exports = ReactionListener;