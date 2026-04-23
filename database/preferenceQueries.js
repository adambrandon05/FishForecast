const pool = require('./db'); 

async function insertPreferences(discordId, zipcode, location, species) {
    const [result] = await pool.query(
        `INSERT INTO preferences ( userId, zipcode, location, species, sendTime, timeZone)
        VALUES ((SELECT id FROM users WHERE discordId = ?),
        ?, ?, ?, '08:00:00', 'CST')`, 
        [discordId , zipcode, location, species]
    );
    return result.insertId;
}

async function updatePreferences(discordId, zipcode, location, species) { 
    const [result] = await pool.query(
        `UPDATE preferences SET zipcode = ?, location = ?, species = ?, sendTime = '08:00:00', timeZone = 'CST'
        WHERE userId = (SELECT id FROM users WHERE discordId = ?)`, 
        [zipcode, location, species, discordId]
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
    getPreferencesByUserId
};