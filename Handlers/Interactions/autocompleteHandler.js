import { APIApplicationCommandAutocompleteInteraction, APIUser } from 'discord-api-types/v10';
import { API } from '@discordjs/core';
import { UtilityCollections } from '../../Utility/utilityConstants';
import { logError } from '../../Utility/loggingModule';


// *******************************
//  Exports

/**
 * Handles & Runs Autocompletes
 * @param {APIApplicationCommandAutocompleteInteraction} interaction 
 * @param {API} api 
 * 
 * @returns {Boolean|'INVALID_COMMAND'|'COOLDOWN_ACTIVE'|'ERROR_GENERIC'} True if Interaction found, or custom error otherwise
 */
export async function handleAutocomplete(interaction, api) {
    const Command = UtilityCollections.SlashCommands.get(interaction.data.name);

    // If no Command found, return
    if ( !Command ) { 
        await api.interactions.createAutocompleteResponse(interaction.id, interaction.token, {
            choices: [{ name: `Error: Option not found in App's code`, value: `INVALID_COMMAND_OPTION` }]
        });
        return 'INVALID_COMMAND';
    }


    // Since `user` and `member` fields can be missing depending on the context the Interaction was invoked in - do a check here for ease
    /** @type {APIUser} */
    let interactionUser;
    
    if ( interaction.user == undefined ) { interactionUser = interaction.member.user; }
    else { interactionUser = interaction.user; }


    // Attempt to execute interaction
    try { await Command.handleAutoComplete(interaction, api, interactionUser); }
    catch (err) {
        await logError(err, api);
        // TODO: Add User Response
    }

    return;
}
