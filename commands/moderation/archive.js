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
      args: [{
        id: "content",
        match: "content"
      }]
    });
  }

  async exec(message, args) {
    const channels = await resolveChannels(args.content, message);

    channels.forEach(async channel => {
      await channel.setParent("649775722306732040");

      message.channel.send(`<#${channel.id}> has been archived.`);
    });
  }
}

module.exports = ArchiveCommand;