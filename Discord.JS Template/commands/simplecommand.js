const Discord = require("discord.js");

module.exports = {
    name: "simple",
    aliases: [ "Simple" ],
    cooldown: "0 s",
    ownerOnly: false,
    devOnly: false,

    execute: async(client, message, args) => {
        const simpleEmbed = new Discord.MessageEmbed()
        .setColor("BLUE")//You can also use hex color
        .setTitle("Simple Command")
        .setDescription("It's a normal command for everyone")
        .setFooter("Literally for everyone", message.author.avatarURL())
        .setAuthor(message.author.username, message.author.avatarURL())
        message.channel.send(simpleEmbed)
    }
}