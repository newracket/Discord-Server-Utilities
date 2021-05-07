const { Listener } = require('discord-akairo');
const JSONFileManager = require("../modules/jsonfilemanager");
const PromoteCommand = require("../commands/sweatranks/roles/promote");
const DemoteCommand = require("../commands/sweatranks/roles/demote");
const { sweatranks, casranks } = require("../jsons/ranks.json");

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

    process.env.TZ = "America/Los_Angeles";
    const checkReminders = require("../modules/checkreminders");
    const client = this.client;
    checkReminders.execute(client);
    setInterval(() => { checkReminders.execute(client) }, 60000);

    storedpollsJSON.get().filter(e => !e.ended).forEach(poll => {
      this.client.channels.cache.get(poll.channel).messages.fetch(poll.id).then(() => console.log("Message fetched"));
    });

    const guild = this.client.guilds.cache.get("633161578363224066");
    const me = await guild.members.fetch("301200493307494400");
    const activeMembers = ["aniket", "aaron", "alan", "gio", "oscar", "justin"];

    setInterval(async () => {
      const guildMembers = await guild.members.fetch();

      const randomNum = Math.floor(Math.random() * 20) + 1;
      const randomMemberIndex = Math.floor(Math.random() * activeMembers.length);
      const member = guildMembers.find(member => member.displayName == activeMembers[randomMemberIndex]);

      await member.fetch();

      if (member) {
        if (randomNum <= 16) {
          new PromoteCommand().promoteMember({ guild: guild }, member, member.roles.cache.map(role => role.name), 1);
          me.send(`${member.displayName} has been promoted`);
        }
        else {
          new DemoteCommand().demoteMember({ guild: guild }, member, member.roles.cache.map(role => role.name), 1);
          me.send(`${member.displayName} has been demoted`);
        }
      }
      else {
        me.send(`${activeMembers[randomMemberIndex]} not found.`);
      }
    }, 600000);
  }
}

module.exports = ReadyListener;