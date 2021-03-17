const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('reminders.db');

module.exports = {
  name: "removecasopp",
  description: "Removes cas role opportunity from list",
  aliases: ["rco"],
  execute(message, args, client) {
    db.run(`DELETE FROM casroleopps WHERE id=${parseInt(args[0])}`, err => {
      if (err) {
        message.channel.send(`Error when deleting from database. ${err}`);
      }
    });

    message.channel.send("Successfully removed reminder!");
  }
}