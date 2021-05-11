const { Command, CommandHandler } = require('discord-akairo');

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
          this.emit("missingPermissions", message, command, 'role', command.permittedRoles.map(r => roles.cache.find(role => role.name == r || role.id == r).name));
          return true;
        }
      }
    }

    return false;
  }
}

async function resolveRole(text, messageOrRoles, caseSensitive = false) {
  const classType = messageOrRoles?.constructor?.name;

  if (!["Message", "Collection"].includes(classType)) return undefined;

  if (text.match(/<@&\d*>/g)) {
    text = text.match(/<@&\d*>/g)[0].replace(/[<@&>]/g, "");
  }

  if (classType == "Message") {
    messageOrRoles = (await messageOrRoles.guild.roles.fetch()).cache;
  }

  if (caseSensitive) {
    return messageOrRoles.get(text) || messageOrRoles.find(role => [role.name, role.id].includes(text.trim()));
  }
  else {
    return messageOrRoles.get(text) || messageOrRoles.find(role => [role.name.toLowerCase(), role.id].includes(text.trim().toLowerCase()));
  }
}

async function resolveMember(text, messageOrMembers, caseSensitive = false) {
  const classType = messageOrMembers?.constructor?.name;

  if (!["Message", "Collection"].includes(classType)) return undefined;

  if (text.match(/<@!\d*>/g)) {
    text = text.match(/<@!\d*>/g)[0].replace(/[<@!>]/g, "");
  }

  if (classType == "Message") {
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
  const classType = messageOrChannels?.constructor?.name;

  if (!["Message", "Collection"].includes(classType)) return undefined;

  if (text.match(/<#\d*>/g)) {
    text = text.match(/<#\d*>/g)[0].replace(/[<#>]/g, "");
  }

  if (classType == "Message") {
    messageOrChannels = await messageOrChannels.guild.channels.cache;
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
  if (channel?.constructor?.name != "TextChannel") {
    channel = await resolveChannel(channel, messageOrChannels);
  }

  const message = await channel.messages.fetch(messageId);
  return message;
}

module.exports = {
  CustomCommand: CustomCommand,
  CustomCommandHandler: CustomCommandHandler,
  resolveRole: resolveRole,
  resolveMember: resolveMember,
  resolveMembers: resolveMembers,
  resolveChannel: resolveChannel,
  resolveChannels: resolveChannels,
  resolveMessage: resolveMessage
};