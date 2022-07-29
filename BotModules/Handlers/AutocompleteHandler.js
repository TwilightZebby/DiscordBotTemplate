const Discord = require("discord.js");
const { DiscordClient, Collections } = await import("../../constants.js");
const LocalizedErrors = await import("../../JsonFiles/errorMessages.json");
const Config = await import("../../config.js");

module.exports = {
    /**
     * Handles and runs received Autocomplete Interactions
     * @param {Discord.AutocompleteInteraction} autocompleteInteraction 
     */
    async Main(autocompleteInteraction)
    {
        // Find Slash Command with matching name
        const SlashCommand = Collections.SlashCommands.get(autocompleteInteraction.commandName);
        if ( !SlashCommand ) { return await autocompleteInteraction.respond([{name: LocalizedErrors[autocompleteInteraction.locale].AUTOCOMPLETE_GENERIC_FAILED, value: "ERROR_FAILED"}]); }

        // Pass to Command's Autocomplete Method
        return await SlashCommand.autocomplete(autocompleteInteraction);
    }
}
