const chalk = require("chalk");

const { Client } = require("discord.js");
const { join } = require("path");
const { existsSync, readdirSync } = require("fs");

async function loadEvents(builderClient = Client) {
    if (!existsSync(join(__dirname, "../../events"))) {
        return console.log(chalk.red("You need to create a new \"events\" in \"src\" directory, because I can't load nothing without it."));
    }

    const filteredFiles = await readdirSync(join(__dirname, "../../events"))
        .filter(file => file.endsWith(".js"));

    for (const file of filteredFiles) {
        const pull = require(join(__dirname, "../../events", file));

        const eventType = file.split(".js")[0];

        builderClient.on(eventType, pull.bind(null, builderClient));
        console.log(chalk.green(`Successfully loaded ${file} event`));
    }
}

module.exports = loadEvents;