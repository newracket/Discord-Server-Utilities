const { Listener } = require('discord-akairo');

class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    });
  }

  exec() {
    console.log('Ready!');

    process.env.TZ = "America/Los_Angeles";
    const checkReminders = require("../modules/checkreminders");
    checkReminders.execute(this.client);
    const _this = this;
    setInterval(function () { checkReminders.execute(_this.client) }, 60000);
  }
}

module.exports = ReadyListener;