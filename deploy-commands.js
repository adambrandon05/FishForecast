require('dotenv').config(); // includes .env data 
const token = process.env.TOKEN; 
const clientId = process.env.CLIENT_ID; 
const guildId = process.env.GUILD_ID;

const { REST, Routes } = require('discord.js'); 
const fs = require('node:fs'); 
const path = require('node:path'); 

const commands = []; 
const foldersPath = path.join(__dirname, 'commands'); 
const commandFolder = fs.readdirSync(foldersPath); 

// could possibly be refactored 
for (const folder of commandFolder) { 
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // filter for .js files
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file); 
        const command = require(filePath); 
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON()); // only change from command handler in index.js
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);    
        }
    }
}

const rest = new REST().setToken(token); 

(async () => { 
    try { 
        console.log(`Started refreshing ${commands.length} application (/) commands `);

        // Refreshes all commands 
        const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {body: commands});
        console.log(`Successfully reload ${data.length} application (/) commands `);
    } catch (error) { 
        console.error(error); 
    }
})();
