const parseReminder = require('parse-reminder');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('reminders.db');

module.exports = {
  name: "add",
  description: "Adds reminder",
  execute(message, args, client) {
    let remindObject;
    let messageType = "announcement";

    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS reminders (
        id int,
        who TEXT,
        date TEXT,
        content TEXT,
        messageType TEXT
      );`, err => {
        if (err) {
          message.channel.send(`Error when creating databse. ${err}`);
        }
      });

      if (args.includes("dm")) {
        messageType = "dm";
        args.splice(args.indexOf("dm"), 1);
      }

      if (args.join(" ").includes("me")) {
        remindObject = parseReminder(`remind ${args.join(" ")}`);
      }
      else {
        remindObject = parseReminder(`remind me ${args.join(" ")}`);
      }

      if (remindObject == null) {
        message.channel.send("Error.");
        return;
      }

      db.all(`SELECT * FROM reminders ORDER BY id DESC LIMIT 1`, [], (err, rows) => {
        if (err) {
          message.channel.send(`Error when selecting reminders from database. ${err}`);
          return;
        }

        if (rows.length == 0) {
          rows.push({ id: 0 });
        }

        db.run(`INSERT INTO reminders (id, who, date, content, messageType) VALUES (${rows[0].id + 1}, "${message.author.id}", "${new Date(remindObject.when).toString()}", "${remindObject.what}", "${messageType}")`, err => {
          if (err) {
            message.channel.send(`Error when adding reminder to database. ${err}`);
            return;
          }

          message.channel.send(`I will remind you to ${remindObject.what} on ${new Date(remindObject.when).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}. The message type is ${messageType}.`);
        });
      });
    });
  }
}