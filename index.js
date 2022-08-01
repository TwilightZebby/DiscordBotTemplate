const Discord = require("discord.js");
const fs = await import("fs");

const { DiscordClient, Collections } = await import("./constants.js");
const LocalizedErrors = await import("./JsonFiles/errorMessages.json");
const Config = await import("./config.js");



/******************************************************************************* */
// BRING IN FILES FOR COMMANDS AND INTERACTIONS
// Text Commands
const TextCommandFiles = fs.readdirSync("./TextCommands").filter(file => file.endsWith(".js"));
for ( const File of TextCommandFiles )
{
    const TempCommand = await import(`./TextCommands/${File}`);
    Collections.TextCommands.set(TempCommand.name, TempCommand);
}

// Slash Commands
const SlashCommandFiles = fs.readdirSync("./Interactions/SlashCommands").filter(file => file.endsWith(".js"));
for ( const File of SlashCommandFiles )
{
    const TempCommand = await import(`./Interactions/SlashCommands/${File}`);
    Collections.SlashCommands.set(TempCommand.name, TempCommand);
}

// Context Commands
const ContextCommandFiles = fs.readdirSync("./Interactions/ContextCommands").filter(file => file.endsWith(".js"));
for ( const File of ContextCommandFiles )
{
    const TempCommand = await import(`./Interactions/ContextCommands/${File}`);
    Collections.ContextCommands.set(TempCommand.name, TempCommand);
}

// Buttons
const ButtonFiles = fs.readdirSync("./Interactions/Buttons").filter(file => file.endsWith(".js"));
for ( const File of ButtonFiles )
{
    const TempButton = await import(`./Interactions/Buttons/${File}`);
    Collections.Buttons.set(TempButton.name, TempButton);
}

// Selects
const SelectFiles = fs.readdirSync("./Interactions/Selects").filter(file => file.endsWith(".js"));
for ( const File of SelectFiles )
{
    const TempSelect = await import(`./Interactions/Selects/${File}`);
    Collections.Selects.set(TempSelect.name, TempSelect);
}

// Modals
const ModalFiles = fs.readdirSync("./Interactions/Modals").filter(file => file.endsWith(".js"));
for ( const File of ModalFiles )
{
    const TempModal = await import(`./Interactions/Modals/${File}`);
    Collections.Modals.set(TempModal.name, TempModal);
}








/******************************************************************************* */
// DISCORD - READY EVENT
DiscordClient.once('ready', () => {
    DiscordClient.user.setPresence({ status: 'online' });
    console.log(`${DiscordClient.user.username}#${DiscordClient.user.discriminator} is online and ready!`);
});








/******************************************************************************* */
// DEBUGGING AND ERROR LOGGING
// Warnings
process.on('warning', (warning) => { return console.warn("***WARNING: ", warning); });
DiscordClient.on('warn', (warning) => { return console.warn("***DISCORD WARNING: ", warning); });

// Unhandled Promise Rejections
process.on('unhandledRejection', (err) => { return console.error("***UNHANDLED PROMISE REJECTION: ", err); });

// Discord Errors
DiscordClient.on('error', (err) => { return console.error("***DISCORD ERROR: ", err); });

// Discord Rate Limit - Only uncomment when debugging
//DiscordClient.rest.on('rateLimited', (Discord.RateLimitError) => { return console.log("***DISCORD RATELIMIT HIT: ", RateLimitError); });








/******************************************************************************* */
// DISCORD - MESSAGE CREATE EVENT
const TextCommandHandler = await import("./BotModules/TextCommandHandler.js");

DiscordClient.on('messageCreate', async (message) => {
    // Partials
    if ( message.partial ) { return; }

    // Bots
    if ( message.author.bot ) { return; }

    // System Messages
    if ( message.system || message.author.system ) { return; }

    // DM Channel Messages
    if ( message.channel instanceof Discord.DMChannel ) { return; }

    // Safe-guard against Discord Outages
    if ( !message.guild.available ) { return; }



    // Check for (and handle) Commands
    let textCommandStatus = await TextCommandHandler.Main(message);
    if ( textCommandStatus === false )
    {
        // No Command detected
        return;
    }
    else if ( textCommandStatus === null )
    {
        // Prefix was detected, but wasn't a command on the bot
        return;
    }
    else
    {
        // Command failed or successful
        return;
    }
});








/******************************************************************************* */
// DISCORD - INTERACTION CREATE EVENT
const SlashCommandHandler = await import("./BotModules/Handlers/SlashCommandHandler.js");
const ContextCommandHandler = await import("./BotModules/Handlers/ContextCommandHandler.js");
const ButtonHandler = await import("./BotModules/Handlers/ButtonHandler.js");
const SelectHandler = await import("./BotModules/Handlers/SelectHandler.js");
const AutocompleteHandler = await import("./BotModules/Handlers/AutocompleteHandler.js");
const ModalHandler = await import("./BotModules/Handlers/ModalHandler.js");

DiscordClient.on('interactionCreate', async (interaction) => {
    switch(interaction)
    {
        case interaction.isChatInputCommand():
            // Slash Command
            return await SlashCommandHandler.Main(interaction);

        case interaction.isContextMenuCommand():
            // Context Command
            return await ContextCommandHandler.Main(interaction);

        case interaction.isButton():
            // Button
            return await ButtonHandler.Main(interaction);

        case interaction.isSelectMenu():
            // Select
            return await SelectHandler.Main(interaction);

        case interaction.isAutocomplete():
            // Autocomplete
            return await AutocompleteHandler.Main(interaction);

        case interaction.isModalSubmit():
            // Modal
            return await ModalHandler.Main(interaction);

        default:
            // Unknown or unhandled new type of Interaction
            return console.log(`****Unrecognised or new unhandled Interaction type triggered:\n${interaction}`);
    }
});








/******************************************************************************* */

DiscordClient.login(Config.TOKEN);
