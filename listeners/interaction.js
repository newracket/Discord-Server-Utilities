const { Listener } = require('discord-akairo');
const { resolveInteractionValue } = require("../modules/utils");

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
      command.exec(interaction, interaction.options.reduce((args, currentOption) => { args[currentOption.name] = resolveInteractionValue(currentOption); return args; }, {}));
    }
  }
}

module.exports = InteractionListener;