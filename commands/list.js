const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('reminders.db');

module.exports = {
  name: "list",
  description: "Lists reminders",
  aliases: ["l"],
  execute(message, args, client) {
    let outputText = "```\n";

    db.all(`SELECT * FROM reminders`, [], (err, rows) => {
      if (err) {
        message.channel.send(`Error when selecting reminders from database. ${err}`);
        return;
      }

      const reminderDateMaxLength = Math.max(...rows.map(row => new Date(row.date).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" }).length));

      rows.forEach((row, i) => {
        const reminderDate = new Date(row.date).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });

        outputText += `Reminder ${row.id}: ${reminderDate.padStart(reminderDateMaxLength)} | ${row.content}\n`;
      });

      outputText += "```";
      message.channel.send(outputText);
    });
  }
}