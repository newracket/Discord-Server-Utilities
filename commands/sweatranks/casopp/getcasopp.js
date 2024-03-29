const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('reminders.db');
const { CustomCommand } = require("../../../modules/utils");

class GetCasOppCommand extends CustomCommand {
  constructor() {
    super('getcasopp', {
      aliases: ['getcasopp', 'gco'],
      description: "Gets random cas role opportunity from list",
      usage: "getcasopp",
      category: "Sweatranks",
    });
  }

  exec(message) {
    db.all(`SELECT * FROM casroleopps`, [], (err, rows) => {
      if (err) {
        message.channel.send(`Error when selecting reminders from database. ${err}`);
        return;
      }

      const randomIndex = Math.floor(Math.random() * rows.length);
      message.channel.send(`Your cas role opportunity is to ${rows[randomIndex].casroleopp} in ${rows[randomIndex].daysLimit != 0 ? rows[randomIndex].daysLimit : "infinite"} days. Good luck!`);
    });
  }
}

module.exports = GetCasOppCommand;