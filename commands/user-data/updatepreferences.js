const { 
    SlashCommandBuilder, LabelBuilder, ModalBuilder, TextInputBuilder, 
    TextInputStyle, StringSelectMenuOptionBuilder, MessageFlags, StringSelectMenuBuilder,
    TextDisplayBuilder } = require('discord.js');

const { users } = require('../../utilities/users');

module.exports = {
    data: new SlashCommandBuilder().
        setName('updatepreferences').
        setDescription('Update your preferences for the fishing report.'),
        async execute(interaction) { 
            const userId = interaction.user.id;

            if (!users[userId] || !users[userId].setupComplete) { 
                await interaction.reply({ 
                    content: "You have not set your preference use /subscribe to create preferences.", 
                    flags: MessageFlags.Ephemeral
                });
                return; 
            }
            if (!users[userId].subscribed) { 
                await interaction.reply({ 
                    content: "You are not currently subscribed used /subscribe first, so that these changes work.",
                    flags: MessageFlags.Ephemeral
                });
                return;
            }

            // mostly the same as subscribe command, but prefilled in values and slight changes to the wording of the questions
            // to make more sense for updating preferences rather than creating them for the first time.
            const modal = new ModalBuilder()
            .setCustomId('preferences')
            .setTitle('Update Your Preferences');

            const text = new TextDisplayBuilder()
                .setContent('Please change your preferences below. These preferences will be used to generate the most accurate report.');

            const zipcodeInput = new TextInputBuilder()
                .setCustomId('zipcodeInput')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Zipcode Ex. 61376')
                .setValue(users[userId].preferences.zipcode) // prefill in the users current zipcode
                // ensures accurate user input
                .setMaxLength(5)
                .setMinLength(5)
                .setRequired(true);

            const locationNameInput = new TextInputBuilder() 
                .setCustomId('locationNameInput')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder(` Ex. Happy Hooker's Fishing Pond`)
                // set default if user does not have a name for their fishing hole
                .setValue(users[userId].preferences.locationName) // prefill in the users current location name`)
                .setMaxLength(100);

            const zipcodeLabel= new LabelBuilder() 
                .setLabel('Enter the zipcode of your fishing hole')
                .setDescription('This will be used to determine the weather and fishing conditions in your area.')
                .setTextInputComponent(zipcodeInput);

            const locationNameLabel = new LabelBuilder() 
                .setLabel('Enter your current fishing hole name')
                .setDescription('If you do not have a name for your fishing hole, it will default to your username\'s pond.')
                .setTextInputComponent(locationNameInput);

                // possible change to make it known to pick your most fished species
            const speciesInput = new StringSelectMenuBuilder() 
                .setCustomId('species')
                .setPlaceholder(`Your current selected fish species is ${users[userId].preferences.species}`)
                .setRequired(true)
                .addOptions( 
                    // Select Box Options
                    new StringSelectMenuOptionBuilder() 
                        .setLabel('Largemouth Bass')
                        .setValue('Largemouth Bass'), 
                    
                    new StringSelectMenuOptionBuilder() 
                        .setLabel('Smallmouth Bass')
                        .setValue('Smallmouth Bass'), 

                    new StringSelectMenuOptionBuilder() 
                        .setLabel('Crappie')
                        .setValue('Crappie'),
                    
                    new StringSelectMenuOptionBuilder() 
                        .setLabel('Bluegill')
                        .setValue('Bluegill'),
                    
                    new StringSelectMenuOptionBuilder() 
                        .setLabel('Catfish')
                        .setValue('Catfish'),
                );

                const speciesLabel = new LabelBuilder() 
                    .setLabel("Please select your most fished fish species")
                    .setStringSelectMenuComponent(speciesInput);

                modal 
                    .addTextDisplayComponents(text)
                    .addLabelComponents(zipcodeLabel)
                    .addLabelComponents(locationNameLabel)
                    .addLabelComponents(speciesLabel);

                await interaction.showModal(modal);
            },
    };