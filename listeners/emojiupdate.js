const { Listener } = require('discord-akairo');
const { announcementsChannelId } = require("../config.json");

class EmojiUpdateListener extends Listener {
  constructor() {
    super('emojiUpdate', {
      emitter: 'client',
      event: 'emojiUpdate'
    });
  }

  async exec(oldEmoji, newEmoji) {
    if (newEmoji.id == "823701647267594261" && newEmoji.id != "aniketcas") {
      newEmoji.edit({ name: "aniketcas" });

      const auditLogs = await newEmoji.guild.fetchAuditLogs();
      const auditLog = auditLogs.entries.first();

      if (auditLog.action == "EMOJI_UPDATE" && auditLog.changes[0].old == "aniketcas") {
        newEmoji.guild.channels.cache.get(announcementsChannelId).send(`${auditLog.executor}, you cannot change this emote name.`)
      }
    }
  }
}

module.exports = EmojiUpdateListener;