const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('reminders.db');
const { CustomCommand } = require("../../modules/utils");

class RemoveCommand extends CustomCommand {
  constructor() {
    super('remove', {
      aliases: ['remove', 'r'],
      description: "Removes a reminder",
      usage: "remove <reminder id>",
      category: "Remind",
      args: [{
        id: "reminderId",
        type: "integer"
      }]
    });
  }

  async exec(message, args) {
    db.run(`DELETE FROM reminders WHERE id=${args.reminderId}`, err => {
      if (err) {
        return message.channel.send(`Error when deleting from database. ${err}`);
      }

      message.channel.send("Successfully removed reminder!");
    });
  }
}

module.exports = RemoveCommand;