const { 
    SlashCommandBuilder, LabelBuilder, ModalBuilder, TextInputBuilder, 
    TextInputStyle, StringSelectMenuOptionBuilder, MessageFlags, StringSelectMenuBuilder,
    TextDisplayBuilder } = require('discord.js');

const { createUser, users } = require('../../utilities/users');

module.exports = {
    data: new SlashCommandBuilder().
        setName('subscribe').
        setDescription('Lets user receive a daily fishing report'),
    
    async execute(interaction) {
        const userId = interaction.user.id; 

        // new user interface for storing these values is yet to be created 
        if(!users[userId]) { 
            users[userId] = createUser();
        }
        // already subscribed 
        if(users[userId].subscribed) {
            await interaction.reply({ 
                content: "You are already subscribed. Use /updatepreferences instead.", 
                flags: MessageFlags.Ephemeral
            });
            return;
        }
        // former subscriber preferences already set
        if(users[userId].setupComplete) { 
            await interaction.reply({ 
                content: "You are now reactivated use /updatepreferences if you want to update preferences. ", 
                flags: MessageFlags.Ephemeral,
            }); 
            
            // will most likely change once I add a DB
            users[userId] = { 
                subscribed: true, 
                setupComplete: users[userId].setupComplete,
                preferences: users[userId].preferences,
            };
            return;
        }
        // modal creation 

        const modal = new ModalBuilder()
            .setCustomId('preferences')
            .setTitle('Set Your Preferences');

        const text = new TextDisplayBuilder()
            .setContent('Please enter your preferences below. These preferences will be used to generate the most accurate report.');

        const zipcodeInput = new TextInputBuilder()
            .setCustomId('zipcodeInput')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Zipcode Ex. 61376')
            // ensures accurate user input
            .setMaxLength(5)
            .setMinLength(5)
            .setRequired(true);

        const locationNameInput = new TextInputBuilder() 
            .setCustomId('locationNameInput')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder(` Ex. Happy Hooker's Fishing Pond`)
            // set default if user does not have a name for their fishing hole
            .setValue(`${interaction.user.username}'s pond`)
            .setMaxLength(100);

        const zipcodeLabel= new LabelBuilder() 
            .setLabel('What is your zipcode?')
            .setDescription('This will be used to determine the weather and fishing conditions in your area.')
            .setTextInputComponent(zipcodeInput);

        const locationNameLabel = new LabelBuilder() 
            .setLabel('What do you want to name your fishing hole?')
            .setDescription('If you do not have a name for your fishing hole, it will default to your username\'s pond.')
            .setTextInputComponent(locationNameInput);

            // possible change to make it noted to pick your most fished species
        const speciesInput = new StringSelectMenuBuilder() 
            .setCustomId('species')
            .setPlaceholder(`Only select one. Pick the one you fish for the most.`)
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
                .setLabel("What fish species do you fish for the most")
                .setStringSelectMenuComponent(speciesInput);

            modal 
                .addTextDisplayComponents(text)
                .addLabelComponents(zipcodeLabel)
                .addLabelComponents(locationNameLabel)
                .addLabelComponents(speciesLabel);

            await interaction.showModal(modal);
    },

};