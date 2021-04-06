const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('reminders.db');
const { CustomCommand } = require("../../../modules/custommodules");

class RemoveCasOpp extends CustomCommand {
  constructor() {
    super('removecasopp', {
      aliases: ['removecasopp', 'rco'],
      description: "Removes cas role opportunity from list",
      usage: "removecasopp <id>",
      category: "Sweatranks",
      permittedRoles: ["King of Sweats", "Royal Advisor"]
    });
  }

  exec(message) {
    const args = message.content.split(" ").slice(1);
    db.run(`DELETE FROM casroleopps WHERE id=${parseInt(args[0])}`, err => {
      if (err) {
        message.channel.send(`Error when deleting from database. ${err}`);
      }
    });

    message.channel.send("Successfully removed reminder!");
  }
}

module.exports = RemoveCasOpp;