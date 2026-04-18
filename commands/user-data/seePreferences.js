const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { users } = require('../../utilities/users');

module.exports = {
    data: new SlashCommandBuilder().
        setName('seepreferences').
        setDescription('Shows formatted list of preferences'),
    async execute(interaction) { 
        const userId = interaction.user.id;
        
        if (!users[userId] || !users[userId].setupComplete) { 
            await interaction.reply({ 
                content: "You have not set your preference use /subscribe to create preferences.", 
                flags: MessageFlags.Ephemeral
            });
            return;  
        }   
        await interaction.reply({
            content:
                `🎣 **Your Preferences**

                • Subscribed: ${users[userId].subscribed}
                • Zipcode: ${users[userId].preferences.zipcode}
                • Location: ${users[userId].preferences.locationName}
                • Species: ${users[userId].preferences.species}
                • Time: ${users[userId].preferences.sendTime ?? 'Not set'}
                `,
                    flags: MessageFlags.Ephemeral,
                });   
        return;
        }

}
