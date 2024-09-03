import { GatewayDispatchEvents, PresenceUpdateStatus } from '@discordjs/core';

import * as fs from 'node:fs';
import * as path from 'node:path';

import { DiscordGateway, DiscordClient, UtilityCollections } from './Utility/utilityConstants';
import { MessageType } from 'discord-api-types/v10';
import { handleTextCommand } from './Handlers/Commands/textCommandHandler';










// *******************************
//  Bring in files for Commands & Interactions

//  Text Commands
const TextCommandFiles = fs.readdirSync('./Commands/TextCommands').filter(file => file.endsWith('.js'));

for ( const File of TextCommandFiles ) {
    const TempFile = require(`./Commands/TextCommands/${File}`);
    UtilityCollections.TextCommands.set(TempFile.name, TempFile);
}

// Slash Commands
const SlashFolderPath = path.join(__dirname, 'Commands/SlashCommands');
const SlashFolders = fs.readdirSync(SlashFolderPath);

for ( const Folder of SlashFolders ) {
    const SlashCommandPath  = path.join(SlashFolderPath, Folder);
    const SlashCommandFiles = fs.readdirSync(SlashCommandPath).filter(file => file.endsWith(".js"));

    for ( const File of SlashCommandFiles ) {
        const FilePath = path.join(SlashCommandPath, File);
        const TempFile = require(FilePath);
        if ( 'execute' in TempFile && 'registerData' in TempFile ) { UtilityCollections.SlashCommands.set(TempFile.name, TempFile); }
        else { console.warn(`[WARNING] The Slash Command at ${FilePath} is missing required "execute" or "registerData" methods.`); }
    }
}

// Context Commands
const ContextFolderPath = path.join(__dirname, 'Commands/ContextCommands');
const ContextFolders = fs.readdirSync(ContextFolderPath);

for ( const Folder of ContextFolders ) {
    const ContextCommandPath  = path.join(ContextFolderPath, Folder);
    const ContextCommandFiles = fs.readdirSync(ContextCommandPath).filter(file => file.endsWith(".js"));

    for ( const File of ContextCommandFiles ) {
        const FilePath = path.join(ContextCommandPath, File);
        const TempFile = require(FilePath);
        if ( 'execute' in TempFile && 'registerData' in TempFile ) { UtilityCollections.ContextCommands.set(TempFile.name, TempFile); }
        else { console.warn(`[WARNING] The Context Command at ${FilePath} is missing required "execute" or "registerData" methods.`); }
    }
}

// Buttons
const ButtonFolderPath = path.join(__dirname, 'Interactions/Buttons');
const ButtonFolders = fs.readdirSync(ButtonFolderPath);

for ( const Folder of ButtonFolders ) {
    const ButtonPath  = path.join(ButtonFolderPath, Folder);
    const ButtonFiles = fs.readdirSync(ButtonPath).filter(file => file.endsWith(".js"));

    for ( const File of ButtonFiles ) {
        const FilePath = path.join(ButtonPath, File);
        const TempFile = require(FilePath);
        if ( 'execute' in TempFile ) { UtilityCollections.Buttons.set(TempFile.name, TempFile); }
        else { console.warn(`[WARNING] The Button at ${FilePath} is missing required "execute" method.`); }
    }
}

// Selects
const SelectFolderPath = path.join(__dirname, 'Interactions/Selects');
const SelectFolders = fs.readdirSync(SelectFolderPath);

for ( const Folder of SelectFolders ) {
    const SelectPath  = path.join(SelectFolderPath, Folder);
    const SelectFiles = fs.readdirSync(SelectPath).filter(file => file.endsWith(".js"));

    for ( const File of SelectFiles ) {
        const FilePath = path.join(SelectPath, File);
        const TempFile = require(FilePath);
        if ( 'execute' in TempFile ) { UtilityCollections.Selects.set(TempFile.name, TempFile); }
        else { console.warn(`[WARNING] The Select at ${FilePath} is missing required "execute" method.`); }
    }
}

// Modals
const ModalFolderPath = path.join(__dirname, 'Interactions/Modals');
const ModalFolders = fs.readdirSync(ModalFolderPath);

for ( const Folder of ModalFolders ) {
    const ModalPath  = path.join(ModalFolderPath, Folder);
    const ModalFiles = fs.readdirSync(ModalPath).filter(file => file.endsWith(".js"));

    for ( const File of ModalFiles ) {
        const FilePath = path.join(ModalPath, File);
        const TempFile = require(FilePath);
        if ( 'execute' in TempFile ) { UtilityCollections.Modals.set(TempFile.name, TempFile); }
        else { console.warn(`[WARNING] The Modal at ${FilePath} is missing required "execute" method.`); }
    }
}









// *******************************
//  Discord Ready Event
DiscordClient.once(GatewayDispatchEvents.Ready, async () => {
    // Set status
    await DiscordClient.updatePresence(0, { status: PresenceUpdateStatus.Online });

    console.log(`Online & Ready!`);
});









// *******************************
//  Debugging and Error Logging
process.on('warning', console.warn);
process.on('unhandledRejection', console.error);









// *******************************
//  Discord Message Create Event
const SystemMessageTypes = [
    MessageType.RecipientAdd, MessageType.RecipientRemove, MessageType.Call, MessageType.ChannelNameChange,
    MessageType.ChannelIconChange, MessageType.ChannelPinnedMessage, MessageType.UserJoin, MessageType.GuildBoost,
    MessageType.GuildBoostTier1, MessageType.GuildBoostTier2, MessageType.GuildBoostTier3, MessageType.ChannelFollowAdd,
    MessageType.GuildDiscoveryDisqualified, MessageType.GuildDiscoveryRequalified, MessageType.GuildDiscoveryGracePeriodInitialWarning,
    MessageType.GuildDiscoveryGracePeriodFinalWarning, MessageType.ThreadCreated, MessageType.GuildInviteReminder, MessageType.AutoModerationAction,
    MessageType.RoleSubscriptionPurchase, MessageType.InteractionPremiumUpsell, MessageType.StageStart, MessageType.StageEnd, MessageType.StageSpeaker,
    MessageType.StageTopic, MessageType.GuildApplicationPremiumSubscription, MessageType.GuildIncidentAlertModeEnabled,
    MessageType.GuildIncidentAlertModeDisabled, MessageType.GuildIncidentReportRaid, MessageType.GuildIncidentReportFalseAlarm,
    // The following haven't been added to Discord API Types yet? :thinking:
    44, // PURCHASE_NOTIFICATION
    46 // POLL_RESULT
];

DiscordClient.on(GatewayDispatchEvents.MessageCreate, async ({ data: message, api }) => {

    // Bots/Apps
    if ( message.author.bot ) { return; }

    // System Messages
    if ( message.author.system || SystemMessageTypes.includes(message.type) ) { return; }

    // No need to filter out messages from DMs since that can be controlled via the Intents system!
    // Can't even check that anyways without an API call since Discord's API doesn't provide even a partial Channel object with Messages

    // Wish I could add a safe-guard check for guild.avaliable BUT DISCORD'S API DOESN'T PROVIDE EVEN A PARTIAL GUILD OBJECT WITH MESSAGES EITHER :upside_down:


    // Check for (and handle) Commands
    const textCommandStatus = await handleTextCommand(message, api);

    // Placeholder for any conditionals/extra code to run based off the result of handling Text Commands above

    return;

});











// *******************************
//  Connection Methods
DiscordGateway.connect();
