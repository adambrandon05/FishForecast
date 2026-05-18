const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { deleteAllUsers } = require('../../database/userQueries');
require('dotenv').config(); // Load environment variables from .env file

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteallusers')
        .setDescription('Admin only: DELETES ALL USER DATA THINK TWICE BEFORE USING (only used for development)'),

    async execute(interaction) { 
        const adminId = process.env.ADMIN_DISCORD_ID; 
        if (interaction.user.id !== adminId) { 
            await interaction.reply({
                content: 'You do not have permission to use this command.',
                flags: MessageFlags.Ephemeral
            });
            return; 
        }

        const result = await deleteAllUsers(); 
        if(result.found) { 
            await interaction.reply({ 
                content: `Deleted ${result.changed} users.`, 
                flags: MessageFlags.Ephemeral
            });
        } else { 
            await interaction.reply({ 
                content: `Failed to delete any user data.`, 
                flags: MessageFlags.Ephemeral
            });
        }
        return;
    }

}