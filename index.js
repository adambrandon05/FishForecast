
require('dotenv').config(); // includes .env data 
const fs = require('fs'); // file system module for reading command files
const path = require('path'); // path module for handling file paths
const { Client, Events, Collection, MessageFlags, GatewayIntentBits,  } = require('discord.js');
const token = process.env.TOKEN; 

// const cron = require('node-cron'); // not currently used but may be used in the future for scheduling messages to be sent at specific times
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages]
}); 

client.commands = new Collection(); // collection to store commands

const folderPath = path.join(__dirname, 'commands'); // path to the commands folder
const commandFolder = fs.readdirSync(folderPath); // read all files in the commands folder

// standard command handler that reads all command files and adds them to the commands collection
for (const folder of commandFolder) { 
    const commandsPath = path.join(folderPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // filter for .js files
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

const eventsPath = path.join(__dirname, 'events'); 
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js')); 

for (const file of eventFiles) { 
    const filePath = path.join(eventsPath, file); 
    const event = require(filePath); 
    if (event.once) { 
        client.once(event.name, (...args) => event.execute(...args)); 
    } else { 
        client.on(event.name, (...args) => event.execute(...args)); 
    }
}

client.login(token); // logs in the bot using the token from the .env file



//client.users.fetch('USER_ID').then((user) => { 
//    user.send('Hello World!!'); 
//}).catch(console.error); 

