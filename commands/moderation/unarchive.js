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
    await args.channel.setParent("633161578363224067");
    message.reply(`<#${args.channel.id}> has been unarchived.`);
  }
}

module.exports = UnarchiveCommand;