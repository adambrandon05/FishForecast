
require('dotenv').config(); // includes .env data 
const fs = require('fs'); // file system module for reading command files
const path = require('path'); // path module for handling file paths
const { Client, Events, Collection, MessageFlags, GatewayIntentBits,  } = require('discord.js');
const TOKEN = process.env.TOKEN; 

// const cron = require('node-cron'); // not currently used but may be used in the future for scheduling messages to be sent at specific times
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages]
}); 

// event listener for when the bot is ready and logged in
client.once('Events.ClientReady', (readyClient) => { 
    console.log(`Logged in as ${readyClient.user.tag}`); 
});

client.commands = new Collection(); // collection to store commands

const folderPath = path.join(__dirname, 'commands'); // path to the commands folder
const commandFolder = fs.readdirSync(foldersPath); // read all files in the commands folder

// standard command handler that reads all command files and adds them to the commands collection
for (const folder of commandFolder) { 
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js')); // filter for .js files
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file); 
        const command = require(filePath); 
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command); 
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);    
        }
    }
}
// event listener for when a slash command is used
client.on(Events.InteractionCreate, async (interaction) => { 
    if (!interaction.isChatInputCommand()) return; // only handle slash commands
    const command = interaction.client.commands.get(interaction.commandName); // get the command from the collection
    if (!command) { 
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try { 
        await command.execute(interaction); 
    } catch (error) { 
        console.error(`Error executing ${interaction.commandName}`);
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
    console.log(`Received command: ${interaction.commandName}`); // log the command name for debugging
});
client.login(TOKEN); // logs in the bot using the token from the .env file



client.users.fetch('USER_ID').then((user) => { 
    user.send('Hello World!!'); 
}).catch(console.error); 

