const { Listener } = require('discord-akairo');

class ReactionListener extends Listener {
  constructor() {
    super('messageReactionRemove', {
      emitter: 'client',
      event: 'messageReactionRemove'
    });
  }

  exec(reaction, user) {
    this.client.commandHandler.findCommand("createpoll").handleReaction(reaction, user, "remove");
  }
}

module.exports = ReactionListener;