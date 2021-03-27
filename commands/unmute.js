const fs = require("fs");

module.exports = {
  name: "unmute",
  description: "Unmutes users",
  aliases: ["u"],
  execute(message, args, client) {
    message.mentions.members.forEach(this.muteMember);
    message.channel.send(message.mentions.members.map(member => `<@${member.id}> has been unmuted.`).join("\n"));
  },
  async muteMember(member) {
    const roles = await member.guild.roles.fetch();
    await member.roles.remove(roles.cache.find(role => role.name == "Muted"));
    const mutedAdmins = JSON.parse(fs.readFileSync("muteadmin.json"));

    if (mutedAdmins.includes(member.id)) {
      fs.writeFileSync("muteadmin.json", JSON.stringify(mutedAdmins.filter(id => id != member.id)));
      await member.roles.add(roles.cache.find(role => role.name == "Admin"));
    }
  }
}