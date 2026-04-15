
require('dotenv').config(); // includes .env data 
const { Client, Events, GatewayIntentBits,  } = require('discord.js');
const TOKEN = process.env.TOKEN; 

// const cron = require('node-cron'); // not currently used but may be used in the future for scheduling messages to be sent at specific times
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages]
}); 

// event listener for when the bot is ready and logged in
client.once('Events.ClientReady', (readyClient) => { 
    console.log(`Logged in as ${readyClient.user.tag}`); 
});

// logs in the bot using the token from the .env file
client.login(TOKEN); 


client.users.fetch('USER_ID').then((user) => { 
    user.send('Hello World!!'); 
}).catch(console.error); 

