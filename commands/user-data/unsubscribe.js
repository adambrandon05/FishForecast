const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { users } = require('../../utilities/users');

module.exports = {
    data: new SlashCommandBuilder().
        setName('unsubscribe').
        setDescription('Unsubscribes user from daily fishing report'),
    async execute(interaction) { 
        const userId = interaction.user.id; 

        if (!users[userId] || !users[userId].subscribed) { 
            await interaction.reply({ 
                content: "You are already not subscribed", 
                flags: MessageFlags.Ephemeral
            });
            return; 
        }
        users[userId].subscribed = false;
        await interaction.reply({
            content: "You are now no longer subscribed", 
            flags: MessageFlags.Ephemeral
        });
        return;
        
    }
};