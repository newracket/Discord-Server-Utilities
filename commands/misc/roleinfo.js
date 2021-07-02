const { CustomCommand } = require("../../modules/utils");

class RoleInfoCommand extends CustomCommand {
  constructor() {
    super('roleinfo', {
      aliases: ['roleinfo', 'ri'],
      description: "Displays role info",
      usage: "roleinfo <role>",
      category: "Misc",
      slashCommand: true,
      args: [{
        id: "role",
        match: "content",
        type: "role",
        description: "Role to display info for",
        required: true
      }]
    });
  }

  async exec(message, args) {
    if (!args.role) return message.reply("Role not specified.");

    const embedOutput = this.client.util.embed({
      title: `${args.role.name} role info`,
      color: args.role.color,
      fields: [{
        name: "**ID                                               **",
        value: args.role.id,
        inline: true
      }, {
        name: "**Color            **",
        value: args.role.hexColor,
        inline: true
      }, {
        name: "**Hoisted      **",
        value: args.role.hoist ? "Yes" : "No",
        inline: true
      }, {
        name: "**Mention**",
        value: `\`<@&${args.role.id}>\``,
        inline: true
      }, {
        name: "**Position    **",
        value: args.role.position.toString(),
        inline: true
      }]
    });

    message.reply(embedOutput);
  }
}

module.exports = RoleInfoCommand;