require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports = pool; // Export the pool for use in other parts of the program
