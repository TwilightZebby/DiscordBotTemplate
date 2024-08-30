import { APIChatInputApplicationCommandInteraction, ApplicationCommandOptionType, MessageFlags, APIUser } from 'discord-api-types/v10';
import { API } from '@discordjs/core';
import { UtilityCollections } from '../../Utility/utilityConstants';
import { localize } from '../../Utility/localizeResponses';


// *******************************
//  Exports

/**
 * Handles & Runs Slash Commands
 * @param {APIChatInputApplicationCommandInteraction} interaction 
 * @param {API} api 
 * 
 * @returns {Boolean|'INVALID_COMMAND'|'COOLDOWN_ACTIVE'|'ERROR_GENERIC'} True if Command found, or custom error otherwise
 */
export async function handleSlashCommand(interaction, api) {
    const Command = UtilityCollections.SlashCommands.get(interaction.data.name);

    // If no Command found, return
    if ( !Command ) { 
        await api.interactions.reply(interaction.id, interaction.token, {
            flags: MessageFlags.Ephemeral,
            content: `Error: This Slash Command cannot be found in this App's code.`
        });
        return 'INVALID_COMMAND';
    }


    // Throw Command name into its own variable, so we can handle subcommand and group specific cooldowns easier
    const CheckSubcommand = interaction.data.options?.find(option => option.type === ApplicationCommandOptionType.Subcommand);
    const CheckCommandGroup = interaction.data.options?.find(option => option.type === ApplicationCommandOptionType.SubcommandGroup);
    let commandName = "";
    let isSubcommand = false;
    let isGroupCommand = false;

    // Both Group & Subcommand are present
    if ( CheckCommandGroup != undefined && CheckSubcommand != undefined ) {
        commandName = `${interaction.data.name}_${CheckCommandGroup.name}_${CheckSubcommand.name}`;
        isSubcommand = true;
        isGroupCommand = true;
    }
    // Subcommand is present, Group is not
    else if ( CheckCommandGroup == undefined && CheckSubcommand != undefined ) {
        commandName = `${interaction.data.name}_${CheckSubcommand.name}`;
        isSubcommand = true;
    }
    // HIGHLY DOUBT this is even possible, but just in case: Group is present, Subcommand is not
    if ( CheckCommandGroup != undefined && CheckSubcommand == undefined ) {
        commandName = `${interaction.data.name}_${CheckCommandGroup.name}`;
        isGroupCommand = true;
    }
    // Neither Subcommand nor Group are present
    else {
        commandName = `${interaction.data.name}`;
    }


    // Since `user` and `member` fields can be missing depending on the context the Interaction was invoked in - do a check here for ease
    /** @type {APIUser} */
    let interactionUser;
    
    if ( interaction.user == undefined ) { interactionUser = interaction.member.user; }
    else { interactionUser = interaction.user; }


    // Cooldown Checks
    // Set initial values
    const Now = Date.now();
    const CooldownStartTimestamp = UtilityCollections.SlashCooldowns.get(`${commandName}_${interactionUser.id}`);
    const CooldownAmount = isGroupCommand || isSubcommand ? ( Command.subcommandCooldown[commandName] || 3 ) * 1000
        : ( Command.cooldown || 3 ) * 1000;

    // If an active Cooldown exists, show error. Otherwise, continue with executing Command
    if ( CooldownStartTimestamp != undefined ) {
        const ExpirationTime = CooldownStartTimestamp + CooldownAmount;

        if ( Now < ExpirationTime ) {
            let timeLeft = ( ExpirationTime - Now ) / 1000; // How much time is left of cooldown, in seconds

            // MINUTES
            if ( timeLeft >= 60 && timeLeft < 3600 ) {
                timeLeft = timeLeft / 60; // For UX
                await api.interactions.reply(interaction.id, interaction.token, {
                    flags: MessageFlags.Ephemeral,
                    content: localize('en-GB', 'SLASH_COMMAND_ERROR_COOLDOWN_MINUTES', timeLeft.toFixed(1))
                });
                return 'COOLDOWN_ACTIVE';
            }
            // HOURS
            else if ( timeLeft >= 3600 && timeLeft < 86400 ) {
                timeLeft = timeLeft / 3600; // For UX
                await api.interactions.reply(interaction.id, interaction.token, {
                    flags: MessageFlags.Ephemeral,
                    content: localize('en-GB', 'SLASH_COMMAND_ERROR_COOLDOWN_HOURS', timeLeft.toFixed(1))
                });
                return 'COOLDOWN_ACTIVE';
            }
            // DAYS
            else if ( timeLeft >= 86400 && timeLeft < 2.628e+6 ) {
                timeLeft = timeLeft / 86400; // For UX
                await api.interactions.reply(interaction.id, interaction.token, {
                    flags: MessageFlags.Ephemeral,
                    content: localize('en-GB', 'SLASH_COMMAND_ERROR_COOLDOWN_DAYS', timeLeft.toFixed(1))
                });
                return 'COOLDOWN_ACTIVE';
            }
            // MONTHS
            else if ( timeLeft >= 2.628e+6 ) {
                timeLeft = timeLeft / 2.628e+6; // For UX
                await api.interactions.reply(interaction.id, interaction.token, {
                    flags: MessageFlags.Ephemeral,
                    content: localize('en-GB', 'SLASH_COMMAND_ERROR_COOLDOWN_MONTHS', timeLeft.toFixed(1))
                });
                return 'COOLDOWN_ACTIVE';
            }
            // SECONDS
            else {
                await api.interactions.reply(interaction.id, interaction.token, {
                    flags: MessageFlags.Ephemeral,
                    content: localize('en-GB', 'SLASH_COMMAND_ERROR_COOLDOWN_SECONDS', timeLeft.toFixed(1))
                });
                return 'COOLDOWN_ACTIVE';
            }
        }
    }
    else {
        // Create new Cooldown
        UtilityCollections.SlashCooldowns.set(`${commandName}_${interactionUser.id}`, Now);
        setTimeout(() => UtilityCollections.SlashCooldowns.delete(`${commandName}_${interactionUser.id}`), CooldownAmount);
    }


    // Attempt to execute Command
    try { await Command.execute(interaction, api, interactionUser, commandName); }
    catch (err) {
        // TODO: Add Error Logger
    }

    return;
}
