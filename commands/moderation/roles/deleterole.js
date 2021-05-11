const { CustomCommand, resolveRole } = require("../../../modules/utils");

class RemoveRoleCommand extends CustomCommand {
  constructor() {
    super('deleterole', {
      aliases: ['deleterole', 'dr'],
      description: "Deletes a role",
      usage: "deleterole <role name>",
      category: "Moderation",
      channel: "guild",
      userPermissions: ['MANAGE_ROLES'],
      args: [{
        id: "roleName",
        match: "content"
      }]
    });
  }

  async exec(message, args) {
    const role = await resolveRole(args.roleName, message);

    if (!role) {
      return message.channel.send("This role does not exist.");
    }
    else if (role.length > 1) {
      const highestRole = message.member.roles.highest;
      if (highestRole.comparePositionTo(role) <= 0) return message.channel.send("The role you are trying to assign is higher than your highest role.");

      return message.channel.send("Multiple roles with this name exist.")
    }

    await role.delete();
    message.channel.send(`${role.name} has been deleted.`);
  }
}

module.exports = RemoveRoleCommand;