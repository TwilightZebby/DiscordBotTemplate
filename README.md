A simple template Discord Bot for myself.

# Setup Guide
*Assumes you've already cloned this, and have NodeJS*

1. [Install Discord.JS](https://discord.js.org/#/docs/main/stable/general/welcome) (latest stable version, currently this template is based on [D.JS v13.5.0](https://discord.js.org/#/docs/main/13.5.0/general/welcome))
2. Ensure you have the following Folders ***in the root*** - as these are where the Bot will look for the Commands and Interactions
    - `./buttons/`
    - `./contextCommands/`
    - `./selects/`
    - `./slashCommands/`
    - `./textCommands/`
3. Create a `config.js` file ***in the root***, with the following information:

```js
exports.TOKEN = 'BOT-TOKEN'; // Your Discord Bot's Token, found on Developer Porta

exports.PREFIX = 't%'; // Prefix for TEXT BASED Commands

exports.ErrorLogChannelID = "channelID"; // Channel ID for where errors are logged

exports.ErrorLogGuildID = "guildID"; // Guild ID that the above Channel is in

exports.TwilightZebbyID = "zebbyID"; // Zebby's Discord User ID - for his "me only" commands
```
