const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getUserByDiscordId, deleteUserByDiscordId } = require('../../database/userQueries');
require('dotenv').config(); // Load environment variables from .env file

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteuser')
        .setDescription('Admin only: deletes a user and their preferences from the database')
        .addStringOption(option =>
            option
                .setName('discordid')
                .setDescription('Discord ID of the user to delete')
                .setRequired(true)
        ),
    async execute(interaction) { 
        const adminId = process.env.ADMIN_DISCORD_ID; 
        if (interaction.user.id !== adminId) { 
            await interaction.reply({
                content: 'You do not have permission to use this command.',
                flags: MessageFlags.Ephemeral
            });
            return; 
        }
        const discordId = interaction.options.getString('discordid'); 
        const user = await getUserByDiscordId(discordId);
        if(!user) { 
            await interaction.reply({ 
                content: `No user found with Discord ID: ${discordId}`,
                flags: MessageFlags.Ephemeral
            });
            return; 
        }

        const result = await deleteUserByDiscordId(discordId); 
        if(result.found) { 
            await interaction.reply({ 
                content: `User with Discord ID: ${discordId} has been deleted.`, 
                flags: MessageFlags.Ephemeral
            });
        } else { 
            await interaction.reply({ 
                content: `Failed to delete user with Discord ID: ${discordId}.`, 
                flags: MessageFlags.Ephemeral
            });
        }
        return;
    }

}