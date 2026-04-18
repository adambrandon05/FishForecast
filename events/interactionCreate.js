const { Events, MessageFlags } = require('discord.js'); 
const { users } = require('../utilities/users');

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
            if (interaction.customId === 'preferences') {
                // long term data storage will be added later 
                const zipcode = interaction.fields.getTextInputValue('zipcodeInput'); 
                const location = interaction.fields.getTextInputValue('locationNameInput');
                const speciesValues = interaction.fields.getStringSelectValues('species');
                const species = speciesValues[0];
                // update user data 
                users[interaction.user.id] = { 
                    subscribed: true, 
                    setupComplete: true,
                    preferences: {
                        zipcode : zipcode,
                        locationName: location,
                        species: species,
                        sendTime: null
                    },
                };
                console.log(zipcode, location, species); 

                await interaction.reply({
                    content: `Your zipcode: ${zipcode}, location name: ${location}, as well as species: ${species} have been successfully added.`,
                    flags: MessageFlags.Ephemeral,
                });
            }
            return;
        }

    },
};