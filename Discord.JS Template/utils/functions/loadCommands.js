const chalk = require("chalk");

const { Client, Collection } = require("discord.js");
const { join } = require("path");
const { existsSync, readdirSync } = require("fs");

async function loadCommands(builderClient = Client) {
    if (!existsSync(join(__dirname, "../../commands"))) {
        return console.log(chalk.red("You need to create a new \"commands\" in \"src\" directory, because I can't load nothing without it."));
    }

    builderClient.commands = new Collection();
    builderClient.aliases = new Collection();
    builderClient.cooldowns = new Collection();
    const filteredFiles = await readdirSync(join(__dirname, "../../commands"))
        .filter(file => file.endsWith(".js"));

    for (const file of filteredFiles) {
        const pull = require(join(__dirname, "../../commands", file));

        if (!pull.name) {
            console.log(chalk.red(`Please provide a name for ${file} command, I can't load it without name!`));
            continue;
        }

        await builderClient.commands.set(pull.name, pull);

        if (pull.aliases && Array.isArray(pull.aliases)) {
            for (const alias of pull.aliases) {
                await builderClient.aliases.set(alias, pull.name);
            }
        }

        if (pull.cooldown) {
            await builderClient.cooldowns.set(pull.name, new Collection());
        }

        console.log(chalk.green(`Successfully loaded ${pull.name} command.`));
    }
}

module.exports = loadCommands;