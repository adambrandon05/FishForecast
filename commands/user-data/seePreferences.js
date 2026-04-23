const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getUserByDiscordId } = require('../../database/userQueries');
const { getPreferencesByDiscordId } = require('../../database/preferenceQueries');
module.exports = {
    data: new SlashCommandBuilder().
        setName('seepreferences').
        setDescription('Shows formatted list of preferences'),
    async execute(interaction) { 
        const discordId = interaction.user.id;
        
        const user = await getUserByDiscordId(discordId);
        if (!user || !user.isSetupComplete) { 
            await interaction.reply({ 
                content: "You have not set your preference use /subscribe to create preferences.", 
                flags: MessageFlags.Ephemeral
            });
            return;  
        }   
        const preferences = await getPreferencesByDiscordId(discordId);
        if (!preferences) { 
            await interaction.reply({ 
                content: "Preferences not found. Please use /subscribe to set your preferences.",
                flags: MessageFlags.Ephemeral
            });
            return;
        }
        await interaction.reply({
            content:
                `🎣 **Your Preferences**

                • Subscribed: ${user.isSubscribed ? 'Yes' : 'No'}
                • Zipcode: ${preferences.zipcode}
                • Location: ${preferences.location}
                • Species: ${preferences.species}
                • Time: ${preferences.sendTime}
                • Timezone: ${preferences.timeZone}
                `,
                    flags: MessageFlags.Ephemeral,
                });   
        return;
        }

}
