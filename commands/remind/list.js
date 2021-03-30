const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('reminders.db');
const { CustomCommand } = require("../../modules/custommodules");

class ListCommand extends CustomCommand {
  constructor() {
    super('list', {
      aliases: ['list', 'l'],
      description: "Lists reminders",
      usage: "list",
      category: "Remind"
    });
  }

  exec(message) {
    let outputTexts = [];

    db.all(`SELECT * FROM reminders`, [], (err, rows) => {
      if (err) {
        message.channel.send(`Error when selecting reminders from database. ${err}`);
        return;
      }

      const reminderDateMaxLength = Math.max(...rows.map(row => new Date(row.date).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" }).length));
      const reminderContentMaxLength = Math.max(...rows.map(row => row.content.length));
      let text = "```\n";

      rows.forEach((row, i) => {
        const reminderDate = new Date(row.date).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });

        if (text.length > 1700) {
          text += "```";
          outputTexts.push(text);
          text = "```\n";
        }

        text += `Reminder ${row.id.toString().padStart(2)}: ${reminderDate.padStart(reminderDateMaxLength)} | ${row.content.padEnd(reminderContentMaxLength)} | ${row.messageType}\n`;
      });

      text += "```";
      outputTexts.push(text);

      outputTexts.forEach(outputText => {
        message.channel.send(outputText);
      });
    });
  }
}

module.exports = ListCommand;