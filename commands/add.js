const parseReminder = require('parse-reminder');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('reminders.db');

module.exports = {
  name: "add",
  description: "Adds reminder. Format: .add [role name (only if one word), role id (if multiple words), everyone (pings everyone), dm (dms you), or ignore (will just normally send message)] [message/date any format].",
  execute(message, args, client) {
    let remindObject;
    let messageType = "none";

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

      const matchingRole = client.guilds.cache.find(guild => guild.id == '633161578363224066').roles.cache.find(role => role.name.toLowerCase() == args[0].toLowerCase() || role.id == args[0]);
      if (args[0] == "dm") {
        messageType = "dm";
        args.splice(0, 1);
      }
      else if (args[0] == "everyone") {
        messageType = "everyone";
        args.splice(0, 1);
      }
      else if (matchingRole != undefined) {
        messageType = matchingRole.name;
        args.splice(0, 1);
      }

      args = args.filter(w => w != "in");

      if (args.includes("me")) {
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