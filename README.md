A simple template Discord Bot for myself.

> **Warning**
> This Branch is currently hosting a work-in-progress refactor of the Template Bot, as to upgrade to Discord.JS v14, along with improved programming practices like replacing `require()` with `import()` :)

# Setup Guide
*Assumes you've already cloned this, and have NodeJS*

1. [Install Discord.JS](https://discord.js.org/#/docs/discord.js/stable/general/welcome) (latest stable version, currently this template is based on [D.JS v14.0.3](https://discord.js.org/#/docs/discord.js/13.8.0/general/welcome))
2. Ensure you have the following Folders ***in the root*** - as these are where the Bot will look for the Commands and Interactions
    - `./Buttons/`
    - `./ContextCommands/`
    - `./Modals/`
    - `./Selects/`
    - `./SlashCommands/`
    - `./TextCommands/`
3. Create a `config.js` file ***in the root***, with the following information:

```js
exports.TOKEN = 'BOT-TOKEN'; // Your Discord Bot's Token, found on Developer Portal

exports.PREFIX = 't%'; // Prefix for TEXT BASED Commands

exports.BotDevID = "zebbyID"; // Discord User ID of the Bot's Developer - for "Bot Developer Only" commands
```
