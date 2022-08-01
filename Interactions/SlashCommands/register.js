const Discord = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");
const LocalizedStrings = require("../../JsonFiles/stringMessages.json");

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "register",

    // Command's Description
    Description: `Registers an App Command to Discord's API for the Bot`,

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
                description: "App Command to register",
                autocomplete: true,
                required: true
            },
            {
                type: Discord.ApplicationCommandOptionType.String,
                name: "scope",
                description: "Where to register command",
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
        //.
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

            case "scope":
                return await this.autocompleteScope(autocompleteInteraction);

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
        // Grab copy of App Commands on Bot
        const SlashCommands = Collections.SlashCommands;
        const ContextCommands = Collections.ContextCommands;
        /** @type {Array<Discord.ApplicationCommandOptionChoiceData>} */
        let filteredResults = [];

        // Confirm not blank input
        if ( !TypedInput || TypedInput == "" || TypedInput == " " )
        {
            // Blank Input, default to all commands
            SlashCommands.forEach(cmd => filteredResults.push({name: `/${cmd.Name}`, value: `slash_${cmd.name}`}));
            ContextCommands.forEach(cmd => filteredResults.push({name: `${cmd.Name}`, value: `context_${cmd.Name.toLowerCase()}`}));
        }
        else
        {
            // Not a blank input, filter based on input
            let lowerCaseInput = TypedInput.toLowerCase();
            let filteredSlashCommands = SlashCommands.filter(cmd => cmd.Name.startsWith(lowerCaseInput) || cmd.Name.includes(lowerCaseInput));
            let filteredContextCommands = ContextCommands.filter(cmd => cmd.Name.toLowerCase().startsWith(lowerCaseInput) || cmd.Name.toLowerCase().includes(lowerCaseInput));
            // Add to results
            filteredSlashCommands.forEach(cmd => filteredResults.push({name: `/${cmd.Name}`, value: `slash_${cmd.name}`}));
            filteredContextCommands.forEach(cmd => filteredResults.push({name: `${cmd.Name}`, value: `context_${cmd.Name.toLowerCase()}`}));
        }

        // Ensure below 25 option limit
        if ( filteredResults.length > 25 ) { filteredResults.slice(0, 24); }

        // Respond
        return await autocompleteInteraction.respond(filteredResults);
    },



    /**
     * Handles Autocomplete for the Scope Option
     * @param {Discord.AutocompleteInteraction} autocompleteInteraction 
     */
    async autocompleteScope(autocompleteInteraction)
    {
        // Grab currently typed Input
        const TypedInput = autocompleteInteraction.options.getFocused();
        /** @type {Array<Discord.ApplicationCommandOptionChoiceData>} */
        let filteredResults = [{name: "Global", value: "global"}]; // To ensure Global Scope is selectable
        // Bring in Guilds Bot is in, so that we can register per-Guild if wanted
        const BotGuilds = await DiscordClient.guilds.fetch();
        
        // Confirm not blank input
        if ( !TypedInput || TypedInput == "" || TypedInput == " " )
        {
            // Blank Input, default to all Guilds
            BotGuilds.forEach(guild => filteredResults.push({name: guild.name, value: guild.id}));
        }
        else
        {
            // Not a blank input, filter based on input
            let lowerCaseInput = TypedInput.toLowerCase();
            let filteredGuilds = BotGuilds.filter(guild => guild.id.match(TypedInput) || guild.name.toLowerCase().startsWith(lowerCaseInput) || guild.name.toLowerCase().includes(lowerCaseInput));
            filteredGuilds.forEach(guild => filteredResults.push({name: guild.name, value: guild.id}));
        }

        // Ensure below 25 option limit
        if ( filteredResults.length > 25 ) { filteredResults.slice(0, 24); }

        // Respond
        return await autocompleteInteraction.respond(filteredResults);
    }
}
