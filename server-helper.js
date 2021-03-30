const { AkairoClient, ListenerHandler } = require("discord-akairo");
const { CustomCommandHandler } = require("./modules/custommodules");
const { prefix, token } = require("./config.json");

class ServerHelperClient extends AkairoClient {
  constructor() {
    super({
      ownerID: "301200493307494400"
    }, {
      ws: {
        intents: ["GUILDS", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_VOICE_STATES", "DIRECT_MESSAGES"]
      }
    });

    this.commandHandler = new CustomCommandHandler(this, {
      directory: "./commands",
      prefix: prefix,
      allowMentions: true,
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

const client = new ServerHelperClient();
client.login(token);