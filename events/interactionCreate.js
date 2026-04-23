const { Events, MessageFlags } = require('discord.js'); 
const { getUserByDiscordId, completeSetup, subscribeUser } = require('../database/userQueries');
const { getPreferencesByDiscordId, insertPreferences, updatePreferences } = require('../database/preferenceQueries');
module.exports = { 
    name: Events.InteractionCreate, 
    async execute(interaction) { 
        if (interaction.isChatInputCommand()) { // only handle slash commands
        
            const command = interaction.client.commands.get(interaction.commandName); // get the command from the collection
            if (!command) { 
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try { 
                await command.execute(interaction); 
            } catch (error) { 
                console.error(`Error executing ${interaction.commandName}`, error);
                if(interaction.replied || interaction.deferred) {
                    await interaction.followUp({ 
                        content: 'There was an error while executing this command!', 
                        flags: MessageFlags.Ephemeral,
                    });
                } else {
                    await interaction.reply({ 
                        content: 'There was an error while executing this command!', 
                        flags: MessageFlags.Ephemeral,
                    });
                }
            }
            return;
        }
        else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'createPreferences' || interaction.customId === 'updatePreferences') {
                const discordId = interaction.user.id;
                const zipcode = interaction.fields.getTextInputValue('zipcodeInput'); 
                const location = interaction.fields.getTextInputValue('locationNameInput');
                const speciesValues = interaction.fields.getStringSelectValues('species');
                const species = speciesValues[0];

                if (interaction.customId === 'createPreferences') { 
                    await insertPreferences(discordId, zipcode, location, species);
                    await completeSetup(discordId);
                    await subscribeUser(discordId);
                } else if (interaction.customId === 'updatePreferences') {
                    await updatePreferences(discordId, zipcode, location, species);    
                }

                console.log(discordId, zipcode, location, species); 
                const preferences = await getPreferencesByDiscordId(discordId);
                const user = await getUserByDiscordId(discordId);
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
            }
            return;
        }

    },
};