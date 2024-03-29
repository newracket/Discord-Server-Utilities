const { CustomCommand } = require("../../modules/utils");

class EightBallCommand extends CustomCommand {
  constructor() {
    super('8ball', {
      aliases: ['8ball'],
      description: "8ball (totally not rigged)",
      usage: "8ball <question>",
      category: "Misc",
      slashCommand: true,
      args: [{
        id: "content",
        type: "string",
        match: "content",
        description: "Ask a question to the 8ball"
      }]
    });
  }

  async exec(message, args) {
    const casWords = ["cas", "bad", "garbage", "trash", "garbonzo", "dogshit", "unlucky"];
    const names = ["justin", "john", "alan", "achintya", "oscar", "aaron", "david", "gio", "eric"];
    const reverseWords = ["no", "not"];
    let messageToSend = true;

    if (message.member.user.username == "newracket") {
      messageToSend = true;
      if (this.includesWords(args.content, names)) {
        messageToSend = !messageToSend;
      }
      if (!this.includesWords(args.content, casWords)) {
        messageToSend = !messageToSend;
      }
      if (this.negatingWord(args.content, reverseWords)) {
        messageToSend = !messageToSend;
      }
    }
    else {
      messageToSend = false;
      if (args.content.includes("aniket")) {
        messageToSend = !messageToSend;
      }
      if (!this.includesWords(args.content, casWords)) {
        messageToSend = !messageToSend;
      }
      if (this.negatingWord(args.content, reverseWords)) {
        messageToSend = !messageToSend;
      }
    }

    const embedOutput = this.client.util.embed({
      title: args.content,
      color: "#0099ff",
      author: {
        name: message.member.displayName,
        icon_url: message.member.user.displayAvatarURL()
      }
    });

    embedOutput.setDescription(messageToSend ? "Yes" : "No");
    message.reply(embedOutput);
  };

  includesWords(input, words) {
    return words.filter(word => input.includes(word)).length > 0;
  };

  negatingWord(input, words) {
    if (input.split(" ").filter(word => words.includes(word)).length % 2 != 0) {
      return true;
    }
    return false;
  }
}

module.exports = EightBallCommand;