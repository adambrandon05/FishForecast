
require('dotenv').config(); // includes .env data 
const { Client, GatewayIntentBits } = require('discord.js');
const TOKEN = process.env.TOKEN; 

const cron = require('node-cron'); 
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages]
}); 

// logs into discord bot includes a check to prevent errors
client.once('ready', () => { 
    console.log(`Logged in as ${client.user.tag}`); 
});

client.login(TOKEN); 


client.users.fetch('USER_ID').then((user) => { 
    user.send('Hello World!!'); 
}).catch(console.error); 

