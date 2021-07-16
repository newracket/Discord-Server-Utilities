const { CustomCommand, resolveMember } = require("../../modules/utils");
const { Message } = require("discord.js");

class ChangeNickCommand extends CustomCommand {
  constructor() {
    super('changenick', {
      aliases: ['changenick', 'cn'],
      description: "Changes the nickname of a member",
      usage: "changenick <mention members> <new nickname> OR changenick <member nicknames> <new nicknames>",
      category: "Moderation",
      channel: "guild",
      permittedRoles: ["726565862558924811", "820159352215961620"],
      slashCommand: true,
      logCommand: true,
      args: [{
        id: "member",
        description: "Member to promote",
        type: "member",
        required: true
      }, {
        id: "nick",
        description: "New nickname",
        type: "string",
        required: true
      }],
      userPermissions: ["MANAGE_NICKNAMES"]
    });

    this.messagesToSend = {};
  }

  async exec(message, args) {
    if (message instanceof Message) {
    const words = message.content.split(" ").slice(1);

      let currentName = "";
      for (const [i, word] of words.entries()) {
        currentName += `${word} `;
        const member = await resolveMember(currentName, message);

        if (member) {
          args.member = member;
          args.nick = words.slice(i + 1).join(" ");
          break;
        }
      }
    }

    if (!args.member) return message.reply("Member not found.");
    if (!args.nick) return message.reply("You didn't specify the new nickname.");

    args.member.setNickname(args.nick == "default" ? null : args.nick);
    message.reply(`Nickname changed for ${args.member}. New nickname is ${args.nick}.`);
  }
}

module.exports = ChangeNickCommand;