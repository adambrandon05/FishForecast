const { Events } = require('discord.js'); 
const { sendDailyMessages } = require('../scheduler/dailymessage');

module.exports = { 
    name: Events.ClientReady, 
    once: true, 
    execute(client) { 
        console.log(`Ready! Logged in as ${client.user.tag}`); 
        sendDailyMessages(client);
    },
};