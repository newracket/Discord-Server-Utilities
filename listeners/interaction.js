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
    if (!this.client.slashDisabled) {
      const command = this.client.commandHandler.findCommand(interaction.commandName);

      if (command) {
        if (command.userPermissions && command.userPermissions.filter(permission => interaction.member.permissions.has(permission)).length == 0) {
          return interaction.reply(`You do not have permissions to do that. Permissions required: ${command.userPermissions.join(", ")}`);
        }

        if (interaction.options[0].options) {
          command.exec(interaction, interaction.options[0].options.reduce((args, currentOption) => { args[currentOption.name] = resolveInteractionValue(currentOption); return args; }, { type: interaction.options[0].name }));
        }
        else {
          command.exec(interaction, interaction.options.reduce((args, currentOption) => { args[currentOption.name] = resolveInteractionValue(currentOption); return args; }, {}));
        }
      }
    }
  }
}

module.exports = InteractionListener;