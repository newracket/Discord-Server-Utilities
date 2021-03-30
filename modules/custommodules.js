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

      if (!isIgnored) {
        if (command.permittedRoles.filter(permittedRole => message.member.roles.cache.some(role => role.id == permittedRole || role.name == permittedRole)).length == 0) {
          this.emit("missingPermissions", message, command, 'role', command.permittedRoles);
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = {
  CustomCommand: CustomCommand,
  CustomCommandHandler: CustomCommandHandler
};