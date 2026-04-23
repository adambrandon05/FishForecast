const { SlashCommandBuilder, MessageFlags } = require('discord.js');

const { getUserByDiscordId, unSubscribeUser } = require('../../database/userQueries')
module.exports = {
    data: new SlashCommandBuilder().
        setName('unsubscribe').
        setDescription('Unsubscribes user from daily fishing report'),
    async execute(interaction) { 
        const discordId = interaction.user.id; 

        const user = await getUserByDiscordId(discordId);
        if (!user || !user.isSubscribed) { 
            await interaction.reply({ 
                content: "You are not currently subscribed.", 
                flags: MessageFlags.Ephemeral
            });
            return; 
        }
        await unSubscribeUser(discordId);
        await interaction.reply({
            content: "You are now no longer subscribed", 
            flags: MessageFlags.Ephemeral
        });
        return;
    }
};