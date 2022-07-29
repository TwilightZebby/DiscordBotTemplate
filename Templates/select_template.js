const Discord = require("discord.js");
const { DiscordClient, Collections } = await import("../constants.js");
const LocalizedErrors = await import("../JsonFiles/errorMessages.json");
const LocalizedStrings = await import("../JsonFiles/stringMessages.json");

module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "select_custom_id",

    // Select's Description
    Description: `Description`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 3,



    /**
     * Executes the Select
     * @param {Discord.SelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        //.
    }
}
