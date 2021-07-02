const { Listener } = require('discord-akairo');

class MessageListener extends Listener {
  constructor() {
    super('message', {
      emitter: 'client',
      event: 'message'
    });
  }

  exec(message) {
    if (message.channel.id == "819649988757291015" && message.author != message.client.user) {
      try {
        // return this.client.commandHandler.findCommand("tts").exec(message, { "content": message.content });
      }
      catch (error) {
        return message.channel.send("Error: " + error);
      }
    }
    else if (message.channel.id == "828155824966205440" && message.author != this.client.user && !["appeal", "approve", "accept", "compromise", "comp", "deny", "reject"].includes(message.content.split(" ")[0].slice(1))) {
      message.delete().then(() => message.author.send(`Your message was deleted due to it not being an appeal command. Your message was: ${message.content}`));
    }
  }
}

module.exports = MessageListener;