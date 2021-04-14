const { CustomCommand } = require("../../../modules/custommodules");

class GrantRoleCommand extends CustomCommand {
  constructor() {
    super('grantrole', {
      aliases: ['grantrole', 'gr'],
      description: "Grants a role to a user",
      usage: "grantrole <role name, role id, or role ping> <user nicknames, usernames, or pings>",
      category: "Moderation",
      channel: "guild",
      userPermissions: ['MANAGE_ROLES'],
      args: [{
        id: "args",
        match: "content"
      }]
    });
  }

  async exec(message, args) {
    const words = args.args.split(" ");
    let currentRoleName = "";
    const roles = await message.guild.roles.fetch();
    const members = await message.guild.members.fetch();

    for (const [i, word] of words.entries()) {
      currentRoleName += `${word} `;
      const role = roles.cache.find(role => role.name.toLowerCase() == currentRoleName.trim().toLowerCase());
      if (role) {
        const highestRole = message.member.roles.highest;
        if (highestRole.comparePositionTo(role) <= 0) return message.channel.send("The role you are trying to assign is higher than your highest role.");

        const users = words.splice(i + 1);
        const membersToModify = [...message.mentions.members.array(), ...users.map(user => members.find(m => [m.id, m.nickname, m.user.username].includes(user))).filter(e => e)];
        membersToModify.forEach(async member => {
          await member.roles.add(role);
        });

        if (membersToModify.length == 0) return message.channel.send("No users found.");
        return message.channel.send(`${role.name} has been given to: ${membersToModify.join(", ")}.`);
      }
    };

    message.channel.send("No role found with that name");
  }
}

module.exports = GrantRoleCommand;