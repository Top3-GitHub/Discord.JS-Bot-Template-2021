require("dotenv").config();

const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const moment = require("moment");

// This is optional if you want use it untag.
// const emojis = require("node-emoji");

module.exports = async(client, message) => {

    // If message author is a bot or message is a webhook.
    if (message.author.bot || message.webhookID != null) {
        return;
    }
    
    const prefix = "!";//prefix
    if (!message.content.startsWith(prefix)) {
        return;
    }

    

    const splittedMessage = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);

    const executedCommand = splittedMessage.shift();

    const optionalCommand =
        await client.commands.find(command => command.name === executedCommand) || await client.commands.get(client.aliases.get(executedCommand));

    // At this moment command can not be undefined if this command really exists.e
    if (typeof optionalCommand === "undefined") {
        // If you want add reactions if command doesn't exists untag it.
        // await message.react(emojis.get("x"));
        return;
    }
 

    // Permissions...
    if (optionalCommand.permissions && !message.member.hasPermission(optionalCommand.permissions)) {
        return message.reply("You are not allowed to execute this command.");
    }

    // If command is owner only.
    if (optionalCommand.ownerOnly && message.member.id !== process.env.OWNER_ID) {
        message.channel.send(`${message.author}`)
        const embed_owneronly = new Discord.MessageEmbed()
        .setTitle(`**Error**`)
        .setColor(`RED`)
        .setDescription(`Only the owner of the bot can use this command.`)
        message.channel.send(embed_owneronly)
        return
    }

    // If command is developer only.
    const list = ["480126135217291286"]
    if (optionalCommand.devOnly && !list.includes(message.author.id)){
        message.channel.send(`${message.author}`)
        const embed_devonly = new Discord.MessageEmbed()
        .setColor("FF0000")
        .setAuthor("Error","https://images-ext-2.discordapp.net/external/09Sy653R7KT8X2IG2wG3Yomk1lEDM2EeSPgKfilv_XM/https/www.freeiconspng.com/thumbs/error/red-circular-image-error-0.png")
        .setDescription("Only bot developers can use this command.")
        message.channel.send(embed_devonly)
        return
    }


    // Cooldowns...
    const optionalCooldown = await client.cooldowns.get(optionalCommand.name);

    // If cooldown for executed command exists.
    if (typeof optionalCooldown !== "undefined") {
        const optionalUserCooldown = await client.cooldowns.get(optionalCommand.name).get(message.author.id);

        if (typeof optionalUserCooldown !== "undefined" && optionalUserCooldown > new Date().getTime()) {
            return message.reply(`Wait a minute, there is a delay for this command! Release and try again later ${moment.duration(optionalUserCooldown - new Date().getTime(), 'milliseconds').asSeconds()} seconds.`);
        }

        // Inserting a new cooldown for this user.
        await client.cooldowns.get(optionalCommand.name).set(message.author.id, new Date().getTime() + ms(optionalCommand.cooldown))
    }

    await optionalCommand.execute(client, message, splittedMessage);
}