const Discord = require("discord.js");
const { DiscordClient, Collections } = await import("../constants.js");
const LocalizedErrors = await import("../JsonFiles/errorMessages.json");
const LocalizedStrings = await import("../JsonFiles/stringMessages.json");

module.exports = {
    // Modal's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "modal_custom_id",

    // Modal's Description
    Description: `Description`,



    /**
     * Executes the Modal
     * @param {Discord.ModalSubmitInteraction} modalInteraction 
     */
    async execute(modalInteraction)
    {
        //.
    }
}
