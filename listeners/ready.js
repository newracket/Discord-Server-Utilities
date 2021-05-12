const { Listener } = require('discord-akairo');
const JSONFileManager = require("../modules/jsonfilemanager");

const storedpollsJSON = new JSONFileManager("storedpolls");

class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    });
  }

  async exec() {
    console.log('Ready!');

    this.client.user.setActivity("aniket is cas");

    process.env.TZ = "America/Los_Angeles";
    const checkReminders = require("../modules/checkreminders");
    const client = this.client;
    checkReminders.execute(client);
    setInterval(() => { checkReminders.execute(client) }, 60000);

    storedpollsJSON.get().filter(e => !e.ended).forEach(poll => {
      this.client.channels.cache.get(poll.channel).messages.fetch(poll.id).then(() => console.log("Message fetched"));
    });
  }
}

module.exports = ReadyListener;