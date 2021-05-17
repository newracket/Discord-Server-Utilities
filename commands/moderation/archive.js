const { CustomCommand, resolveChannels } = require("../../modules/utils");

class ArchiveCommand extends CustomCommand {
  constructor() {
    super('archive', {
      aliases: ['archive'],
      description: "Archives channel",
      usage: "archive <channel name> OR archive <channel id> OR archive <channel mention>",
      category: "Moderation",
      channel: "guild",
      userPermissions: ['MANAGE_CHANNELS'],
      slashCommand: true,
      args: [{
        id: "channel",
        type: "channel",
        required: true,
        description: "Channel to archive."
      }]
    });
  }

  async exec(message, args) {
    await args.channel.setParent("649775722306732040");
    message.reply(`<#${args.channel.id}> has been archived.`);
  }
}

module.exports = ArchiveCommand;