import { APIMessageComponentButtonInteraction } from 'discord-api-types/v10';
import { API, MessageFlags } from '@discordjs/core';


module.exports = {
    /** The Button's name - set as the START of the Button's Custom ID, with extra data being separated with a "_" AFTER the name
     * @example "buttonName_extraData"
     * @type {String}
     */
    name: "buttonName",

    /** Button's Description, mostly for reminding me what it does!
     * @type {String}
     */
    description: "Button's Description",

    /** Button's cooldown, in seconds (whole number integers!)
     * @type {Number}
     */
    cooldown: 3,

    /** Runs the Button
     * @param {APIMessageComponentButtonInteraction} interaction 
     * @param {API} api
     * @param {APIUser} interactionUser 
     */
    async executeButton(interaction, api, interactionUser) {
        return await api.interactions.reply(interaction.id, interaction.token, { flags: MessageFlags.Ephemeral, content: "This Button has not yet been implemented yet!" });
    }
}
