const pool = require('./db'); // import the database connection pool

// function to get a user by their Discord ID
async function getUserByDiscordId(discordId) { 
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE discordId = ?', 
        [discordId]
    );
    
    return rows[0] || null; // Return the user object or null if not found
}
async function createUser(discordId)  { 
    const [result] = await pool.query(
        `INSERT INTO users (discordId) VALUES (?)`,
        [discordId]
    );
    return result.insertId; // Return the ID of the newly created user
}

async function unSubscribeUser(discordId) { 
    const [result] = await pool.query(
        `UPDATE users SET isSubscribed = FALSE 
        WHERE discordId = ?`, 
        [discordId]
    );
    return { 
        found: result.affectedRows > 0, // Check if any rows were updated (found the user)
        changed: result.changedRows > 0 // Check if any rows were were changed (unsubscribed)
    }; 
}
async function subscribeUser(discordId) { 
    const [result] = await pool.query(`
        UPDATE users SET isSubscribed = TRUE
        WHERE discordId = ?`,
        [discordId]);
    return { 
        found: result.affectedRows > 0, // Check if any rows were updated (found the user)
        changed: result.changedRows > 0 // Check if any rows were were changed (subscribed)
    }; 
}

async function completeSetup(discordId) { 
    const [result] = await pool.query(`
        UPDATE users SET isSetupComplete = TRUE
        WHERE discordId = ?`, 
        [discordId]
    );
    return { 
        found: result.affectedRows > 0, // Check if any rows were updated (found the user)
        changed: result.changedRows > 0 // Check if any rows were were changed (setup completed)
    };
}

module.exports = { 
    getUserByDiscordId, 
    createUser, 
    unSubscribeUser, 
    subscribeUser, 
    completeSetup
};