const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('reminders.db');
const { announcementsChannelId } = require("../config.json");

module.exports = {
  name: "checkReminders",
  execute(client) {
    const announcementsChannel = client.channels.cache.find(channel => channel.id == announcementsChannelId);

    db.all(`SELECT * FROM reminders`, [], (err, rows) => {
      if (err) {
        return console.log(err);
      }

      rows.forEach((row, i) => {
        if (new Date() > new Date(row.date)) {
          const matchingRole = client.guilds.cache.find(guild => guild.id == '633161578363224066').roles.cache.find(role => role.name.toLowerCase() == row.messageType.toLowerCase());

          if (row.messageType == "dm") {
            client.guilds.cache.find(guild => guild.id == '633161578363224066').members.cache.find(member => member.id == row.who).send(row.content);
          }
          else if (row.messageType == "everyone") {
            announcementsChannel.send(`@everyone ${row.content}`)
          }
          else if (matchingRole != undefined) {
            announcementsChannel.send(`<@&${matchingRole.id}> ${row.content}`);
          }
          else {
            announcementsChannel.send(row.content);
          }

          db.run(`DELETE FROM reminders WHERE id=${parseInt(row.id)}`, err => {
            if (err) {
              return console.log(err);
            }
          });
        }
      });
    });
  }
}