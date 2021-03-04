const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('reminders.db');

module.exports = {
  name: "checkReminders",
  execute(client) {
    const announcementsChannel = client.channels.cache.find(channel => channel.id == "633820399922315275");
    const today = new Date();
    today.setHours(today.getHours() - 8);

    db.all(`SELECT * FROM reminders`, [], (err, rows) => {
      if (err) {
        message.channel.send(`Error when selecting reminders from database. ${err}`);
        return;
      }

      rows.forEach((row, i) => {
        if (new Date() > new Date(row.date)) {
          if (row.messageType == "announcement") {
            announcementsChannel.send(row.content);
          }
          else if (row.messageType == "dm") {
            client.guilds.cache.find(guild => guild.id == '633161578363224066').members.cache.find(member => member.id == row.who).send(row.content);
          }

          // db.run(`DELETE FROM reminders WHERE id=${parseInt(row.id)}`, err => {
          //   if (err) {
          //     return console.log(err);
          //   }
          // });
        }
      });
    });
  }
}