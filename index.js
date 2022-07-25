const Discord = await import("discord.js");
const fs = await import("fs");

const { DiscordClient, Collections } = await import("./constants.js");
const LocalizedStrings = await import("./JsonFiles/errorMessages.json");
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
const SlashCommandFiles = fs.readdirSync("./SlashCommands").filter(file => file.endsWith(".js"));
for ( const File of SlashCommandFiles )
{
    const TempCommand = await import(`./SlashCommands/${File}`);
    Collections.SlashCommands.set(TempCommand.name, TempCommand);
}

// Context Commands
const ContextCommandFiles = fs.readdirSync("./ContextCommands").filter(file => file.endsWith(".js"));
for ( const File of ContextCommandFiles )
{
    const TempCommand = await import(`./ContextCommands/${File}`);
    Collections.ContextCommands.set(TempCommand.name, TempCommand);
}

// Buttons
const ButtonFiles = fs.readdirSync("./Buttons").filter(file => file.endsWith(".js"));
for ( const File of ButtonFiles )
{
    const TempButton = await import(`./Buttons/${File}`);
    Collections.Buttons.set(TempButton.name, TempButton);
}

// Selects
const SelectFiles = fs.readdirSync("./Selects").filter(file => file.endsWith(".js"));
for ( const File of SelectFiles )
{
    const TempSelect = await import(`./Selects/${File}`);
    Collections.Selects.set(TempSelect.name, TempSelect);
}

// Modals
const ModalFiles = fs.readdirSync("./Modals").filter(file => file.endsWith(".js"));
for ( const File of ModalFiles )
{
    const TempModal = await import(`./Modals/${File}`);
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
