const parseReminder = require('parse-reminder');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('reminders.db');
const { CustomCommand } = require("../../modules/utils");

class AddCommand extends CustomCommand {
  constructor() {
    super('add', {
      aliases: ['add', 'remind'],
      description: "Adds reminder",
      usage: "add <reminder type (dm, everyone, role name, none)> <reminder date> <reminder content>",
      category: "Remind",
      args: [{
        id: "content",
        match: "content"
      }]
    });
  }

  async exec(message, args) {
    args = args.content.split(" ");
    let remindObject;
    let messageType = "none";

    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS reminders (
        id int,
        who TEXT,
        date TEXT,
        content TEXT,
        messageType TEXT
      );`, err => { if (err) return message.channel.send(`Error when creating databse. ${err}`); });

      const matchingRole = message.guild.roles.cache.find(role => role.name.toLowerCase() == args[0].toLowerCase() || role.id == args[0]);

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
        message.channel.send("Error when parsing.");
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

module.exports = AddCommand;