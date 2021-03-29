const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('reminders.db');
const { Command } = require('discord-akairo');

class RemoveCommand extends Command {
  constructor() {
    super('remove', {
      aliases: ['remove', 'r'],
      description: "Removes a reminder",
    });
  }

  exec(message) {
    const args = message.content.split(" ").slice(1);
    db.run(`DELETE FROM reminders WHERE id=${parseInt(args[0])}`, err => {
      if (err) {
        return message.channel.send(`Error when deleting from database. ${err}`);
      }

      message.channel.send("Successfully removed reminder!");
    });

  }
}

module.exports = RemoveCommand;