import { APIUser, APIGuildMember } from '@discordjs/core';


// *******************************
//  Exports

/**
 * Checks the Tag/Discrim of the given APIUser, to see if they're on the new Username System or not.
 * 
 * Note: This shouldn't be used as much now that all non-App/Bot Users HAVE been fully migrated at this point
 * @param {APIUser} user 
 * 
 * @returns {Boolean} True if on the new Username System
 */
export function checkPomelo(user) {
    if ( user.discriminator === '0' ) { return true; }
    else { return false; }
}

/**
 * Gets the highest-level display name for the provided User or Member
 * @param {APIUser|APIGuildMember} userMember 
 * @param {Boolean?} ignoreNicknames Set as True to ignore Guild Nicknames, if using APIGuildMember
 * 
 * @returns {String} The highest-level display name - be it the Guild Nickname, User's Display Name, or User's Username
 */
export function getHighestName(userMember, ignoreNicknames) {
    let highestName = "";
    let isPomelo = true;

    // Pomelo checks. Basically, if an App, they're not on Pomelo!
    if ( (userMember instanceof APIUser) && userMember.bot ) { isPomelo = false; }
    if ( (userMember instanceof APIGuildMember) && userMember.user?.bot ) { isPomelo = false; }

    // Usernames
    highestName = userMember instanceof APIGuildMember ? `@${userMember.user?.username}${isPomelo ? '' : `#${userMember.user?.discriminator}`}`
        : `@${userMember.username}${isPomelo ? '' : `#${userMember.discriminator}`}`;

    // Display Names override Usernames
    if ( (userMember instanceof APIUser) && (userMember.global_name != null) ) { highestName = userMember.global_name; }
    if ( (userMember instanceof APIGuildMember) && (userMember.user.global_name != null) ) { highestName = userMember.user.global_name; }

    // Guild Nicknames override Display Names, if a Guild Member was provided
    if ( !ignoreNicknames && (userMember instanceof APIGuildMember) && (userMember.nick != null) ) { highestName = userMember.nick; }

    return highestName;
}
