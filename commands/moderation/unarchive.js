const { CustomCommand, resolveChannels } = require("../../modules/utils");

class UnarchiveCommand extends CustomCommand {
  constructor() {
    super('unarchive', {
      aliases: ['unarchive'],
      description: "unarchives channel",
      usage: "unarchive <channel name> OR unarchive <channel id> OR unarchive <channel mention>",
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
      await channel.setParent("633161578363224067");

      message.channel.send(`<#${channel.id}> has been unarchived.`);
    });
  }
}

module.exports = UnarchiveCommand;