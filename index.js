// LIBRARIES
const fs = await import("fs");
const { } = await import("discord.js");

// GLOBAL STUFF
const { DiscordClient, Collections } = await import("./constants.js");
const LocalizedStrings = await import("./JsonFiles/errorMessages.json");
const Config = await import("./config.js");

// ***************************
// BRING IN FILES FOR COMMANDS AND INTERACTIONS
// Text Commands
const TextCommandFiles = fs.readdirSync("./TextCommands").filter(file => file.endsWith(".js"));
for ( const File of TextCommandFiles )
{
    const TempCommand = await import(`./TextCommands/${File}`);
    Collections.TextCommands.set(TempCommand.name, TempCommand);
}
