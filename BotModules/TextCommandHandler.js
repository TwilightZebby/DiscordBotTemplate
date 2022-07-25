const Discord = require("discord.js");
const { PermissionFlagsBits } = require("discord.js");
const { DiscordClient, Collections } = await import("../constants.js");
const LocalizedStrings = await import("../JsonFiles/errorMessages.json");
const Config = await import("../config.js");

module.exports = {
    /**
     * Checks for a Text Command in a sent Message, and runs it if true
     * @param {Discord.Message} message Source Message that triggered this
     * @returns {Promise<Boolean|*>} False if not a Command
     */
    async Main(message)
    {
        // Check for Prefix (including @mention of the Bot itself)
        const EscapePrefix = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const PrefixRegex = new RegExp(`^(<@!?${DiscordClient.user.id}>|${EscapePrefix(Config.PREFIX)})\\s*`);

        if ( !PrefixRegex.text(message.content) )
        {
            // No prefix found, thus not an attempt to use a Text Command
            return false;
        }
        else
        {
            // Slice off Prefix and assemble command
            const [, MatchedPrefix] = message.content.match(PrefixRegex);
            const Arguments = message.content.slice(MatchedPrefix.length).trim().split(/ +/);
            const CommandName = Arguments.shift().toLowerCase();
            const Command = client.textCommands.get(CommandName);

            if ( !Command ) { return null; }

            // DM Usage
            if ( Command.Scope === 'DM' && !(message.channel instanceof Discord.DMChannel) )
            {
                return await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: LocalizedStrings["en-GB"].TEXT_COMMAND_DMS_ONLY });
            }

            // Guild Usage
            if ( Command.Scope === 'GUILD' && (message.channel instanceof Discord.DMChannel) )
            {
                return await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: LocalizedStrings["en-GB"].TEXT_COMMAND_GUILDS_ONLY });
            }


            // Command Permission Checks
            if ( Command.PermissionLevel )
            {
                switch ( Command.PermissionLevel )
                {
                    case "DEVELOPER":
                        // Bot's Dev
                        if ( message.author.id !== Config.BotDevID )
                        {
                            return await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: LocalizedStrings["en-GB"].TEXT_COMMAND_NO_PERMISSION_DEVELOPER });
                        }
                        break;

                    case "SERVER_OWNER":
                        // Bot's Dev, and Server Owners
                        if ( message.author.id !== Config.BotDevID && message.author.id !== message.guild.ownerId )
                        {
                            return await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: LocalizedStrings["en-GB"].TEXT_COMMAND_NO_PERMISSION_OWNER });
                        }
                        break;

                    case "ADMIN":
                        // Bot's Dev, Server Owners, and those with "ADMIN" Permission
                        if ( message.author.id !== Config.BotDevID && message.author.id !== message.guild.ownerId && !message.member.permissions.has(PermissionFlagsBits.Administrator) )
                        {
                            return await message.reply({ content: CONSTANTS.errorMessages.TEXT_COMMAND_NO_PERMISSION_ADMIN, allowedMentions: { parse: [], repliedUser: false } });
                        }
                        break;

                    case "MODERATOR":
                        // Bot's Dev, Server Owners, those with "ADMIN" Permission, and Server Moderators
                        if ( message.author.id !== Config.BotDevID && message.author.id !== message.guild.ownerId && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers) && !message.member.permissions.has(PermissionFlagsBits.KickMembers) && !message.member.permissions.has(PermissionFlagsBits.ManageChannels) && !message.member.permissions.has(PermissionFlagsBits.ManageGuild) && !message.member.permissions.has(PermissionFlagsBits.ManageMessages) && !message.member.permissions.has(PermissionFlagsBits.ManageRoles) && !message.member.permissions.has(PermissionFlagsBits.ManageThreads) && !message.member.permissions.has(PermissionFlagsBits.ModerateMembers) )
                        {
                            return await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: LocalizedStrings["en-GB"].TEXT_COMMAND_NO_PERMISSION_MODERATOR });
                        }
                        break;

                    case "EVERYONE":
                    default:
                        break;
                }
            }
        }
    }
}
