const Discord = require("discord.js");
const { DiscordClient, Collections } = await import("../constants.js");
const LocalizedErrors = await import("../JsonFiles/errorMessages.json");
const LocalizedStrings = await import("../JsonFiles/stringMessages.json");

module.exports = {
    // Command's Name
    //     Can use sentence casing and spaces
    Name: "Command Name",

    // Command's Description
    Description: `Description`,

    // Command's Category
    Category: "GENERAL",

    // Context Command Type
    //     One of either Discord.ApplicationCommandType.Message, Discord.ApplicationCommandType.User
    CommandType: Discord.ApplicationCommandType.Message,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 3,

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "GUILD",



    /**
     * Returns data needed for registering Context Command onto Discord's API
     * @returns {Discord.ApplicationCommandData}
     */
    registerData()
    {
        /** @type {Discord.ApplicationCommandData} */
        const Data = {};

        Data.name = this.Name;
        Data.description = "";
        Data.type = this.CommandType;
    },



    /**
     * Executes the Context Command
     * @param {Discord.ContextMenuCommandInteraction} contextCommand 
     */
    async execute(contextCommand)
    {
        //.
    }
}
