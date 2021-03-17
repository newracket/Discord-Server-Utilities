const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('reminders.db');

module.exports = {
  name: "listcasopp",
  description: "Lists all cas role opportunity available",
  aliases: ["lco"],
  execute(message, args, client) {
    let outputTexts = [];

    db.all(`SELECT * FROM casroleopps`, [], (err, rows) => {
      if (err) {
        message.channel.send(`Error when selecting reminders from database. ${err}`);
        return;
      }

      let outputText = "```\n";
      const maxLength = Math.max(...rows.map(row => row.casroleopp.length));

      rows.forEach(row => {
        if (outputText.length > 1700) {
          outputText += "```";
          outputTexts.push(outputText);
        }
        outputText += `${row.id} | ${row.casroleopp.padEnd(maxLength)} | ${row.daysLimit != 0 ? row.daysLimit : "infinite"} days\n`;
      });

      outputText += "```";
      outputTexts.push(outputText);

      outputTexts.forEach(text => {
        message.channel.send(text);
      });
    });
  }
}