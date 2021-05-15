const { Listener } = require('discord-akairo');
const { resolveRole } = require('../modules/utils');

class InteractionListener extends Listener {
  constructor() {
    super('interaction', {
      emitter: 'client',
      event: 'interaction'
    });
  }

  async exec(interaction) {
    const command = this.client.commandHandler.findCommand(interaction.commandName);

    if (command) {
      command.exec(interaction);
    }
  }
}

module.exports = InteractionListener;