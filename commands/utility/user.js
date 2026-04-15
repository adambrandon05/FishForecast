const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().
        setName('user').
        setDescription('Replies with user info!'),
    // more info about the user will be added in the future, as I add 
    // functionality to the bot, but for now it just replies with the username and the date they joined the server
    async execute(interaction) {
        await interaction.reply(
            `This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.` 
        );
    },
};