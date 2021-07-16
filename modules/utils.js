const { Command, CommandHandler } = require('discord-akairo');
const { Structures, APIMessage, Message, CommandInteraction, Collection, MessageEmbed, TextChannel } = require("discord.js");

class CustomCommand extends Command {
  constructor(id, options = {}) {
    super(id, options);

    /**
     * Usage for commmands
     * @type {string}
     */
    this.usage = options.usage;

    /**
     * Roles required to execute command
     * @type {Snowflake|Snowflake[]|IgnoreCheckPredicate}
     */
    this.permittedRoles = options.permittedRoles;

    /**
     * Whether this command is a slash command or not
     * @type {boolean}
     */
    this.slashCommand = options.slashCommand;

    /**
     * Options for slash command
     */
    this.slashOptions = options.slashOptions;

    this.args = options.args;

    this.logCommand = options.logCommand;
  }
}

class CustomCommandHandler extends CommandHandler {
  /**
     * Runs inhibitors with the post type.
     * @param {Message} message - Message to handle.
     * @param {Command} command - Command to handle.
     * @returns {Promise<boolean>}
     */
  async runPostTypeInhibitors(message, command) {
    if (command.ownerOnly) {
      const isOwner = this.client.isOwner(message.author);
      if (!isOwner) {
        this.emit("messageBlocked", message, command, "owner");
        return true;
      }
    }

    if (command.channel === 'guild' && !message.guild) {
      this.emit("messageBlocked", message, command, "guild");
      return true;
    }

    if (command.channel === 'dm' && message.guild) {
      this.emit("messageBlocked", message, command, "dm");
      return true;
    }

    if (await this.runPermissionChecks(message, command)) {
      return true;
    }

    if (await this.runRolePermissionChecks(message, command)) {
      return true;
    }

    const reason = this.inhibitorHandler
      ? await this.inhibitorHandler.test('post', message, command)
      : null;

    if (reason != null) {
      this.emit("messageBlocked", message, command, reason);
      return true;
    }

    if (this.runCooldowns(message, command)) {
      return true;
    }

    return false;
  }

  /**
     * Runs role permission checks.
     * @param {Message} message - Message that called the command.
     * @param {Command} command - Command to cooldown.
     * @returns {Promise<boolean>}
     */
  async runRolePermissionChecks(message, command) {
    if (command.permittedRoles) {
      const ignorer = command.ignorePermissions || this.ignorePermissions;
      const isIgnored = Array.isArray(ignorer)
        ? ignorer.includes(message.author.id)
        : typeof ignorer === 'function'
          ? ignorer(message, command)
          : message.author.id === ignorer;
      const roles = await message.guild.roles.fetch();

      if (!isIgnored) {
        if (command.permittedRoles.filter(permittedRole => message.member.roles.cache.some(role => role.id == permittedRole || role.name == permittedRole)).length == 0) {
          this.emit("missingPermissions", message, command, 'role', command.permittedRoles.map(r => roles.find(role => role.name == r || role.id == r).name));
          return true;
        }
      }
    }

    return false;
  }
}

async function createSlashCommand(command, client) {
  command.aliases.forEach(async alias => {
    const commandOptions = {
      name: alias,
      description: command.description,
      options: command.args.map(arg => { arg.name = arg.id; arg.type = arg.type.toUpperCase().replace("MEMBER", "USER"); return arg; }),
      defaultPermission: false
    };

    let guild = client.guilds.cache.get("633161578363224066");
    if (!guild) {
      guild = await client.guilds.fetch("633161578363224066");
    }

    let existingCommands = guild.commands.cache;
    if (existingCommands.size == 0) {
      existingCommands = await guild.commands.fetch();
    }
    const matchedCommand = existingCommands.find(existingCommand => ["name", "description"].filter(key => existingCommand[key] == commandOptions[key]).length == 2);
    let matchedPerfectly = false;

    if (matchedCommand) {
      matchedPerfectly = true;

      if (matchedCommand.options.length == commandOptions.options.length) {
        commandOptions.options.forEach((option, i) => {
          if (["type", "name", "description", "required"].filter(key => option[key] == matchedCommand.options[i][key]).length != 4) {
            matchedPerfectly = false;
          }
        });
      }
      else {
        matchedPerfectly = false;
      }
    }

    if (!matchedPerfectly) {
      const commandCreated = await guild.commands.create(commandOptions);
      const permissions = [];

      if (command.permittedRoles) {
        command.permittedRoles.forEach(role => {
          permissions.push({ id: role, type: "ROLE", permission: true });
        });
      }
      if (permissions.length == 0) {
        permissions.push({ id: "775799853077758053", type: "ROLE", permission: true });
      }
      if (client.commandHandler.ignorePermissions.length > 0) {
        client.commandHandler.ignorePermissions.forEach(memberId => {
          permissions.push({ id: memberId, type: "USER", permission: true });
        });
      }
      if (command.ownerOnly) {
        permissions.splice(0, permissions.length);
        permissions.push({ id: client.ownerID, type: "USER", permission: true });
      }

      commandCreated.permissions.set({ permissions: permissions });
    }
  });
}

async function resolveRole(text, messageOrRoles, caseSensitive = false) {
  if (messageOrRoles == undefined) throw "Error when resolving: Message not defined";
  if (!(messageOrRoles instanceof Message) && !(messageOrRoles instanceof Collection) && !(messageOrRoles instanceof CommandInteraction)) return undefined;

  if (text.match(/<@&\d*>/g)) {
    text = text.match(/<@&\d*>/g)[0].replace(/[<@&>]/g, "");
  }

  if (messageOrRoles instanceof Message || messageOrRoles instanceof CommandInteraction) {
    messageOrRoles = await messageOrRoles.guild.roles.fetch();
  }

  if (caseSensitive) {
    return messageOrRoles.get(text) || messageOrRoles.find(role => [role.name, role.id].includes(text.trim()));
  }
  else {
    return messageOrRoles.get(text) || messageOrRoles.find(role => [role.name.toLowerCase(), role.id].includes(text.trim().toLowerCase()));
  }
}

async function resolveMember(text, messageOrMembers, caseSensitive = false) {
  if (messageOrMembers == undefined) throw "Error when resolving: Message not defined";
  if (!(messageOrMembers instanceof Message) && !(messageOrMembers instanceof Collection) && !(messageOrMembers instanceof CommandInteraction)) return undefined;

  if (text.match(/<@!\d*>/g)) {
    text = text.match(/<@!\d*>/g)[0].replace(/[<@!>]/g, "");
  }

  if (messageOrMembers instanceof Message || messageOrMembers instanceof CommandInteraction) {
    messageOrMembers = await messageOrMembers.guild.members.fetch();
  }

  if (caseSensitive) {
    return messageOrMembers.get(text) || messageOrMembers.find(member => [member.displayName, member.id].includes(text.trim()));
  }
  else {
    return messageOrMembers.get(text) || messageOrMembers.find(member => [member.displayName.toLowerCase(), member.id].includes(text.trim().toLowerCase()));
  }
}

async function resolveMembers(text, messageOrMembers, caseSensitive = false) {
  const members = [];

  for (const word of text.split(" ")) {
    const member = await resolveMember(word, messageOrMembers, caseSensitive);

    if (member) {
      members.push(member);
    }
  }

  return members;
}

async function resolveChannel(text, messageOrChannels, caseSensitive = false) {
  if (messageOrChannels == undefined) throw "Error when resolving: Message not defined";
  if (!(messageOrChannels instanceof Message) && !(messageOrChannels instanceof Collection) && !(messageOrChannels instanceof CommandInteraction)) return undefined;

  if (text.match(/<#\d*>/g)) {
    text = text.match(/<#\d*>/g)[0].replace(/[<#>]/g, "");
  }

  if (messageOrChannels instanceof Message || messageOrChannels instanceof CommandInteraction) {
    messageOrChannels = messageOrChannels.guild.channels.cache;
  }

  if (caseSensitive) {
    return messageOrChannels.get(text) || messageOrChannels.find(channel => [channel.name, channel.id].includes(text.trim()));
  }
  else {
    return messageOrChannels.get(text) || messageOrChannels.find(channel => [channel.name.toLowerCase(), channel.id].includes(text.trim().toLowerCase()));
  }
}

async function resolveChannels(text, messageOrChannels, caseSensitive = false) {
  const channels = [];

  for (const word of text.split(" ")) {
    const channel = await resolveChannel(word, messageOrChannels, caseSensitive);

    if (channel) {
      channels.push(channel);
    }
  }

  return channels;
}

async function resolveMessage(channel, messageId, messageOrChannels) {
  if (!(channel instanceof TextChannel)) {
    channel = await resolveChannel(channel, messageOrChannels);
  }

  const message = await channel.messages.fetch(messageId);
  return message;
}

function resolveInteractionValue(interaction) {
  switch (interaction.type) {
    case "USER": return interaction.member;
    case "ROLE": return interaction.role;
    case "CHANNEL": return interaction.channel;
    default: return interaction.value;
  }
}

function createCustomStructures() {
  Structures.extend("CommandInteraction", CommandInteraction => {
    return class CustomCommandInteraction extends CommandInteraction {
      constructor(client, data) {
        super(client, data);

        this.author = this.member.user;
      }

      async reply(content, options) {
        if (content instanceof MessageEmbed) {
          content = { embeds: [content] };
        }
        else if (typeof content == "number") {
          content = content.toString();
        }

        if (!options?.split) return super.reply(content, options);

        const apiMessage = content instanceof APIMessage ? content : APIMessage.create(this, content, options);
        const { data } = apiMessage.resolveData();

        delete options["split"];
        data.content.forEach((splitContent, i) => {
          if (i == 0) {
            super.reply(splitContent, options);
          }
          else {
            this.followUp(splitContent, options);
          }
        });
      }

      async followUp(options) {
        if (options instanceof MessageEmbed) {
          options = { embeds: [options] };
        }
        else if (typeof options == "number") {
          options = options.toString();
        }

        super.followUp(options);
      }
    }
  });

  Structures.extend("Message", Message => {
    return class CustomMessage extends Message {
      constructor(client, data, channel) {
        super(client, data, channel);

        this.replies = [];

        if (this.reference) {
          const channel = this.guild.channels.cache.get(this.reference.channelID);

          if (channel) {
            const message = channel.messages.cache.get(this.reference.messageID);

            if (message) {
              message.replies.push(this);
            }
          }
        }
      }

      defer() {

      }

      editReply(content, options) {

      }

      reply(options) {
        if (options instanceof MessageEmbed) {
          options = { embeds: [options] };
        }
        else if (typeof options == "number") {
          options = options.toString();
        }

        super.reply(options);
      }

      edit(options) {
        if (options instanceof MessageEmbed) {
          options = { embeds: [options] };
        }
        else if (typeof options == "number") {
          options = options.toString();
        }

        super.edit(options);
      }
    }
  });

  Structures.extend("TextChannel", TextChannel => {
    return class CustomTextChannel extends TextChannel {
      send(options) {
        if (options instanceof MessageEmbed) {
          options = { embeds: [options] };
        }
        else if (typeof options == "number") {
          options = options.toString();
        }

        return super.send(options);
      }
    }
  });
}

module.exports = {
  CustomCommand,
  CustomCommandHandler,
  resolveRole,
  resolveMember,
  resolveMembers,
  resolveChannel,
  resolveChannels,
  resolveMessage,
  resolveInteractionValue,
  createSlashCommand,
  createCustomStructures
};