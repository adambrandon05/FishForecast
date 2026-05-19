const pool = require('./db'); 

// timezone is still hardcoded will get changed onces I implement that weather api and algorithm
async function insertPreferences(discordId, zipcode, location, species, sendTime) {
    const [result] = await pool.query(
        `INSERT INTO preferences ( userId, zipcode, location, species, sendTime, timeZone)
        VALUES ((SELECT id FROM users WHERE discordId = ?),
        ?, ?, ?, ?, 'CST')`, 
        [discordId , zipcode, location, species, sendTime]
    );
    return result.insertId;
}

async function updatePreferences(discordId, zipcode, location, species, sendTime) { 
    const [result] = await pool.query(
        `UPDATE preferences SET zipcode = ?, location = ?, species = ?, sendTime = ?, timeZone = 'CST'
        WHERE userId = (SELECT id FROM users WHERE discordId = ?)`, 
        [zipcode, location, species, sendTime, discordId]
    );
    return result.affectedRows > 0; // Check if any rows were updated (successfully updated preferences)
}

async function getPreferencesByDiscordId(discordId) { 
    const [rows] = await pool.query(`SELECT zipcode, location, species, sendTime, timeZone 
        FROM preferences 
        WHERE userId = (SELECT id FROM users WHERE discordId = ?)`, 
        [discordId] 
    );
    return rows[0] || null; 
}

module.exports = { 
    insertPreferences, 
    updatePreferences, 
    getPreferencesByDiscordId
};