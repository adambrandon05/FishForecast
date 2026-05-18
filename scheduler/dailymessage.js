// still very much in development, not full implementation.

const cron = require('node-cron');
const { getSubscribedUsers } = require('../database/userQueries');
const { getPreferencesByDiscordId } = require('../database/preferenceQueries');

function sendDailyMessages(client) {
    cron.schedule('* * * * *', async () => {
        console.log('Running daily message task...');
        const users = await getSubscribedUsers();

        for (const user of users) { 
            const preferences = await getPreferencesByDiscordId(user.discordId);

            if (!preferences) { 
                continue; 
            }

            try { 
                const discordUser = await client.users.fetch(user.discordId); 
                await discordUser.send(
                `🎣 **Your Daily Fishing Report**

                • Location: ${preferences.location}
                • Species: ${preferences.species}

                Happy fishing! 🎣

                ''More detailed forecasts coming soon!''
                `);
            }
            catch (error) { 
                console.error(`Failed to send daily message to user ${user.discordId}:`, error);
            }
        }
    });

}
module.exports = {
    sendDailyMessages   
};
