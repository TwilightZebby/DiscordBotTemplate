const Discord = require("discord.js");
const { DiscordClient, Collections } = await import("../constants.js");
const LocalizedErrors = await import("../JsonFiles/errorMessages.json");
const Config = await import("../config.js");

module.exports = {
    /**
     * Handles and runs received Slash Commands
     * @param {Discord.ChatInputCommandInteraction} slashInteraction 
     * @returns {Promise<*>}
     */
    async Main(slashInteraction)
    {
        const SlashCommand = Collections.SlashCommands.get(slashInteraction.commandName);

        if ( !SlashCommand )
        {
            // Couldn't find the file for this Slash Command
            return await slashInteraction.reply({ ephemeral: true, content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_GENERIC_FAILED_RARE });
        }

        // DM Check
        if ( SlashCommand.Scope === 'DM' && !(slashInteraction.channel instanceof Discord.DMChannel) )
        {
            return await slashInteraction.reply({ ephemeral: true, content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_DMS_ONLY });
        }

        // Guild Check
        if ( SlashCommand.Scope === 'GUILD' && (slashInteraction.channel instanceof Discord.DMChannel) )
        {
            return await slashInteraction.reply({ ephemeral: true, content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_GUILDS_ONLY });
        }



        // Slash Command Cooldowns
        if ( !Collections.SlashCooldowns.has(SlashCommand.Name) )
        {
            // No active Cooldowns found, create new one
            Collections.SlashCooldowns.set(SlashCommand.Name, new Discord.Collection());
        }

        // Set initial values
        const Now = Date.now();
        /** @type {Discord.Collection} */
        const Timestamps = Collections.SlashCooldowns.get(SlashCommand.Name);
        const CooldownAmount = ( SlashCommand.Cooldown || 3 ) * 1000;

        // Cooldown
        if ( Timestamps.has(slashInteraction.user.id) )
        {
            // Cooldown hit, tell User to cool off a little bit
            const ExpirationTime = Timestamps.get(slashInteraction.user.id) + CooldownAmount;

            if ( Now < ExpirationTime )
            {
                let timeLeft = ( ExpirationTime - Now ) / 1000; // How much time is left of cooldown, in seconds

                switch (timeLeft)
                {
                    // MINUTES
                    case timeLeft >= 60 && timeLeft < 3600:
                        timeLeft = timeLeft / 60; // For UX
                        let cooldownMinutesMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_MINUTES.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownMinutesMessage });

                    // HOURS
                    case timeLeft >= 3600 && timeLeft < 86400:
                        timeLeft = timeLeft / 3600; // For UX
                        let cooldownHoursMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_HOURS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownMinutesMessage });

                    // DAYS
                    case timeLeft >= 86400 && timeLeft < 2.628e+6:
                        timeLeft = timeLeft / 86400; // For UX
                        let cooldownDaysMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_DAYS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownDaysMessage });

                    // MONTHS
                    case timeLeft >= 2.628e+6:
                        timeLeft = timeLeft / 2.628e+6; // For UX
                        let cooldownMonthsMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_MONTHS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownMonthsMessage });

                    // SECONDS
                    default:
                        let cooldownSecondsMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_SECONDS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownSecondsMessage });
                }
            }
        }
        else
        {
            // Create new cooldown
            Timestamps.set(slashInteraction.user.id, Now);
            setTimeout(() => Timestamps.delete(slashInteraction.user.id), CooldownAmount);
        }



        // Attempt to run Command
        try { await SlashCommand.execute(slashInteraction); }
        catch (err)
        {
            //console.error(err);
            if ( slashInteraction.deferred )
            {
                await slashInteraction.editReply({ content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_GENERIC_FAILED });
            }
            else
            {
                await slashInteraction.reply({ ephemeral: true, content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_GENERIC_FAILED });
            }
        }

        return;
    }
}
