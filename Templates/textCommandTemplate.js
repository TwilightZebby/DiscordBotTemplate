import { GatewayMessageCreateDispatchData, MessageReferenceType } from 'discord-api-types/v10';
import { API } from '@discordjs/core';


module.exports = {
    /** Command's Name, in fulllowercase (can include hyphens)
     * @type {String}
     */
    name: "command-name",

    /** Command's Description
     * @type {String}
     */
    description: "Command Description",

    /** Command's Localised Descriptions
     * @type {LocalizationMap}
     */
    localizedDescriptions: {
        'en-GB': 'British Description',
        'en-US': 'American Description'
    },

    /** Command's cooldown, in seconds (whole number integers!)
     * @type {Number}
     */
    cooldown: 3,

    /** Runs the Command
     * @param {GatewayMessageCreateDispatchData} message 
     * @param {API} api
     */
    async executeCommand(message, api) {
        return await api.channels.createMessage(message.channel_id, {
            allowed_mentions: { replied_user: false, parse: [] },
            message_reference: { type: MessageReferenceType.Default, guild_id: message.guild_id, channel_id: message.channel_id, message_id: message.id },
            content: "Sorry, this Text Command hasn't been implemented yet!"
        });
    }
}
