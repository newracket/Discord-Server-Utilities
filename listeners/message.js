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
        return this.client.commandHandler.findCommand("tts").exec(message, { "message": message.content });
      }
      catch (error) {
        return message.channel.send("Error: " + error);
      }
    }
  }
}

module.exports = MessageListener;