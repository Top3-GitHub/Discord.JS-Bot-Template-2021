require("dotenv").config();
const Discord = require('discord.js');
const { Client } = require("discord.js");
const client = new Client();


// Loading functions from "utils/functions" directory.
const loadCommands = require("./utils/functions/loadCommands.js");
const loadEvents = require("./utils/functions/loadEvents.js");

client.login(process.env.TOKEN)
    .then(() => console.log(`Successfully logged in as ${client.user.tag}`))
    .finally(() => {
        loadCommands(client);
        loadEvents(client);
    });