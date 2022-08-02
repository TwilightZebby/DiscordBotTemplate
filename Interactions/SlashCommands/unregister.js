const Discord = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");
const LocalizedStrings = require("../../JsonFiles/stringMessages.json");

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "unregister",

    // Command's Description
    Description: `Unregisters an App Command from Discord's API for the Bot`,

    // Command's Category
    Category: "DEVELOPER",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 10,

    // Cooldowns for specific subcommands and/or subcommand-groups
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandCooldown: {
        "example": 3
    },

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "GUILD",



    /**
     * Returns data needed for registering Slash Command onto Discord's API
     * @returns {Discord.ChatInputApplicationCommandData}
     */
    registerData()
    {
        /** @type {Discord.ChatInputApplicationCommandData} */
        const Data = {};

        Data.name = this.Name;
        Data.description = this.Description;
        Data.type = Discord.ApplicationCommandType.ChatInput;
        Data.dmPermission = false;
        Data.options = [
            {
                type: Discord.ApplicationCommandOptionType.String,
                name: "command",
                description: "App Command to unregister",
                autocomplete: true,
                required: true
            }
        ];

        return Data;
    },



    /**
     * Executes the Slash Command
     * @param {Discord.ChatInputCommandInteraction} slashCommand 
     */
    async execute(slashCommand)
    {
        // Defer
        await slashCommand.deferReply({ ephemeral: true });

        // Grab Inputs
        const InputCommand = slashCommand.options.getString("command", true);
        const SplitInput = InputCommand.split("_");
        const CommandId = SplitInput.shift();
        const CommandName = SplitInput[1];
        const CommandGuildId = SplitInput.length === 3 ? SplitInput.pop() : null;
        
        const FetchedCommand = await DiscordClient.application.commands.fetch(CommandId);
        console.log(FetchedCommand);

        if ( CommandGuildId == null )
        {
            // Globally unregister
            return await DiscordClient.application.commands.delete(FetchedCommand.id)
            .then(async () => { return await slashCommand.editReply({ content: LocalizedStrings[slashCommand.locale].UNREGISTER_COMMAND_SUCCESS_GLOBAL.replace("{{COMMAND_NAME}}", CommandName) }); })
            .catch(async (err) => { return await slashCommand.editReply({ content: LocalizedStrings[slashCommand.locale].UNREGISTER_COMMAND_FAIL_GLOBAL.replace("{{COMMAND_NAME}}", CommandName) }); });
        }
        else
        {
            // Unregister on a per-Guild basis
            return await DiscordClient.application.commands.delete(FetchedCommand.id, CommandGuildId)
            .then(async () => { return await slashCommand.editReply({ content: LocalizedStrings[slashCommand.locale].UNREGISTER_COMMAND_SUCCESS_GUILD.replace("{{COMMAND_NAME}}", CommandName).replace("{{GUILD_ID}}", CommandGuildId) }); })
            .catch(async (err) => { return await slashCommand.editReply({ content: LocalizedStrings[slashCommand.locale].UNREGISTER_COMMAND_FAIL_GUILD.replace("{{COMMAND_NAME}}", CommandName).replace("{{GUILD_ID}}", CommandGuildId) }); });
        }
    },



    /**
     * Handles given Autocomplete Interactions for any Options in this Slash CMD that uses it
     * @param {Discord.AutocompleteInteraction} autocompleteInteraction 
     */
    async autocomplete(autocompleteInteraction)
    {
        // Fetch which option this Autocomplete is for
        const CurrentOption = autocompleteInteraction.options.getFocused(true);

        switch (CurrentOption.name)
        {
            case "command":
                return await this.autocompleteCommand(autocompleteInteraction);

            default:
                return await autocompleteInteraction.respond([{name: LocalizedErrors[autocompleteInteraction.locale].AUTOCOMPLETE_GENERIC_FAILED, value: "ERROR_FAILED" }]);
        }
    },



    /**
     * Handles Autocomplete for the Command Option
     * @param {Discord.AutocompleteInteraction} autocompleteInteraction 
     */
    async autocompleteCommand(autocompleteInteraction)
    {
        // Grab currently typed input
        const TypedInput = autocompleteInteraction.options.getFocused();
        // Grab copy of App Commands registered
        const RegisteredCommands = await DiscordClient.application.commands.fetch();
        /** @type {Array<Discord.ApplicationCommandOptionChoiceData>} */
        let filteredResults = [];

        // Confirm not blank input
        if ( !TypedInput || TypedInput == "" || TypedInput == " " )
        {
            // Blank Input, default to all commands
            RegisteredCommands.forEach(cmd => filteredResults.push({name: `${cmd.type === Discord.ApplicationCommandType.ChatInput ? "/" : ""}${cmd.name}${cmd.guild != null ? ` (G:${cmd.guild.id})` : ""}`, value: `${cmd.id}_${cmd.name}${cmd.guild != null ? `_${cmd.guild.id}` : ""}`}));
        }
        else
        {
            // Not a blank input, filter based on input
            let lowerCaseInput = TypedInput.toLowerCase();
            let filteredRegisteredCommands = RegisteredCommands.filter(cmd => cmd.name.toLowerCase().startsWith(lowerCaseInput) || cmd.name.toLowerCase().includes(lowerCaseInput) || cmd.id.match(TypedInput));
            // Add to results
            filteredRegisteredCommands.forEach(cmd => filteredResults.push({name: `${cmd.type === Discord.ApplicationCommandType.ChatInput ? "/" : ""}${cmd.name}${cmd.guild != null ? ` (G:${cmd.guild.id})` : ""}`, value: `${cmd.id}_${cmd.name}${cmd.guild != null ? `_${cmd.guild.id}` : ""}`}));
        }

        // Ensure below 25 option limit
        if ( filteredResults.length > 25 ) { filteredResults.slice(0, 24); }

        // Respond
        return await autocompleteInteraction.respond(filteredResults);
    }
}
