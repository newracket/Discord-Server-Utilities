const { AkairoClient, ListenerHandler } = require("discord-akairo");
const { CustomCommandHandler, createCustomStructures } = require("./modules/utils");
const { prefix, token } = require("./config.json");

class ServerHelperClient extends AkairoClient {
  constructor() {
    super({
      ownerID: "301200493307494400",
      intents: ["GUILDS", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_VOICE_STATES", "DIRECT_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_EMOJIS"]
    });

    this.commandHandler = new CustomCommandHandler(this, {
      directory: "./commands",
      prefix: prefix,
      allowMention: true,
      ignorePermissions: this.ownerID
    });

    this.listenerHandler = new ListenerHandler(this, {
      directory: "./listeners"
    });

    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler
    });

    this.commandHandler.loadAll();
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.loadAll();
  }
}

createCustomStructures();
const client = new ServerHelperClient();
client.login(token);