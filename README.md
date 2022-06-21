A simple template Discord Bot for myself.

# Setup Guide
*Assumes you've already cloned this, and have NodeJS*

1. [Install Discord.JS](https://discord.js.org/#/docs/discord.js/stable/general/welcome) (latest stable version, currently this template is based on [D.JS v13.8.0](https://discord.js.org/#/docs/discord.js/13.8.0/general/welcome))
2. Ensure you have the following Folders ***in the root*** - as these are where the Bot will look for the Commands and Interactions
    - `./buttons/`
    - `./contextCommands/`
    - `./modals/`
    - `./selects/`
    - `./slashCommands/`
    - `./textCommands/`
3. Create a `config.js` file ***in the root***, with the following information:

```js
exports.TOKEN = 'BOT-TOKEN'; // Your Discord Bot's Token, found on Developer Portal

exports.PREFIX = 't%'; // Prefix for TEXT BASED Commands

exports.BotDevID = "zebbyID"; // Discord User ID of the Bot's Developer - for "Bot Developer Only" commands
```

4. Create an empty `commandAllowList.json` file in the `./jsonFiles/` Folder. (Create Folder if need be too)
    - This is used for the Text Commands that are limited to only being usable by those on an allowlist. The stucture of the JSON file is exampled below:
    
    ```json
    {
        "commandName": [ "Array", "Of", "User", "Snowflake", "IDs" ],
        "secondCommandName": [ "Another", "Array" ]
    }
    ```
