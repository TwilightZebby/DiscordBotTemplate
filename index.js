import { GatewayDispatchEvents, PresenceUpdateStatus } from '@discordjs/core';
import { DiscordGateway, DiscordClient } from './Utility/utilityConstants';




// *******************************
//  READY EVENT
DiscordClient.once(GatewayDispatchEvents.Ready, async () => {
    // Set status
    await DiscordClient.updatePresence(0, { status: PresenceUpdateStatus.Online });

    console.log(`Online & Ready!`);
});










// *******************************
//  Connection Methods


DiscordGateway.connect();
