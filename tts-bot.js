const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client({ ws: { intents: ['GUILDS', 'GUILD_PRESENCES', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'] } });
const { token, prefix } = require("./config.json");

process.env.TZ = 'America/Los_Angeles';

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log('Ready!');
  client.playing = false;

  const checkReminders = require("./modules/checkReminders");
  checkReminders.execute(client);
  setInterval(function() { checkReminders.execute(client) }, 60000);
});

client.on('message', message => {
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (!message.content.startsWith(prefix)) return;

  let commandObject = client.commands.get(command) || client.commands.find(c => c.aliases && c.aliases.includes(command));
  if (commandObject) {
    try {
      commandObject.execute(message, args, client);
    }
    catch {
      message.channel.send("Error");
    }
  }
  else {
    message.channel.send("The command was not recognized.");
  }
});

client.login(token);