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
    const activeMembers = ["aniket", "aaron", "alan", "gio", "oscar", "david"];

    setInterval(async () => {
      const guildMembers = await guild.members.fetch();

      const randomNum = Math.floor(Math.random() * 20) + 1;
      const randomMemberIndex = Math.floor(Math.random() * activeMembers.length);
      const member = guildMembers.find(member => member.displayName == activeMembers[randomMemberIndex]);

      if (member) {
        if (randomNum <= 15) {
          new PromoteCommand().promoteMember({ guild: guild }, member, member.roles.cache.map(role => role.name), 1);
          me.send(`${member.displayName} has been promoted`);
        }
        else if (randomNum <= 19) {
          new DemoteCommand().demoteMember({ guild: guild }, member, member.roles.cache.map(role => role.name), 1);
          me.send(`${member.displayName} has been demoted`);
        }
        else {
          const lastRank = casranks.filter(rank => member.roles.cache.map(role => role.name).includes(rank)).pop();

          if (casranks.indexOf(lastRank) == casranks.length - 1) {
            return;
          }
          else if (lastRank != undefined) {
            member.roles.add(guild.roles.cache.find(role => role.name == casranks[casranks.indexOf(lastRank) + 1]));
          }
          else {
            const memberRoles = member.roles.cache.filter(role => !sweatranks.includes(role.name)).map(role => role.id);
            memberRoles.push(guild.roles.cache.find(role => role.name == "Cas").id);

            member.roles.set(memberRoles);
          }
          me.send(`${member.displayName} has been given cas`);
        }
      }
      else {
        me.send(`${activeMembers[randomMemberIndex]} not found.`);
      }
    }, 600000);
  }
}

module.exports = ReadyListener;