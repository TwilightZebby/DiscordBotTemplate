const Discord = require("discord.js");
const { DiscordClient, Collections } = await import("../constants.js");
const LocalizedErrors = await import("../JsonFiles/errorMessages.json");
const Config = await import("../config.js");

module.exports = {
    /**
     * Handles and runs received Slash Commands
     * @param {Discord.ChatInputCommandInteraction} slashInteraction 
     * @returns {Promise<*>}
     */
    async Main(slashInteraction)
    {
        const SlashCommand = Collections.SlashCommands.get(slashInteraction.commandName);

        if ( !SlashCommand )
        {
            // Couldn't find the file for this Slash Command
            return await slashInteraction.reply({ ephemeral: true, content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_GENERIC_FAILED_RARE });        }
    }
}
