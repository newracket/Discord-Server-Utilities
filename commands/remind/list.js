const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('reminders.db');
const { CustomCommand } = require("../../modules/utils");

class ListCommand extends CustomCommand {
  constructor() {
    super('list', {
      aliases: ['list', 'l'],
      description: "Lists reminders",
      usage: "list",
      category: "Remind"
    });
  }

  async exec(message) {
    db.all(`SELECT * FROM reminders`, [], (err, rows) => {
      if (err) {
        message.channel.send(`Error when selecting reminders from database. ${err}`);
        return;
      }

      const reminderDateMaxLength = Math.max(...rows.map(row => new Date(row.date).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" }).length));
      const reminderContentMaxLength = Math.max(...rows.map(row => row.content.length));
      let text = "```\n";

      rows.forEach(row => {
        const reminderDate = new Date(row.date).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });

        text += `Reminder ${row.id.toString().padStart(2)}: ${reminderDate.padStart(reminderDateMaxLength)} | ${row.content.padEnd(reminderContentMaxLength)} | ${row.messageType}\n`;
      });

      message.channel.send(text + "```", { split: { prepend: "```\n", append: "```" } });
    });
  }
}

module.exports = ListCommand;