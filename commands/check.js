const checkReminders = require('../modules/checkReminders');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('reminders.db');

module.exports = {
  name: "check",
  description: "Checks reminders (DEBUGGING ONLY)",
  execute(message, args, client) {
    checkReminders.execute(client);

    message.channel.send("Successfully checked!");
  }
}