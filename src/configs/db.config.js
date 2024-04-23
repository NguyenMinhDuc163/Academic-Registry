require('dotenv').config();
const mysql = require('mysql2');
const sql = require('mssql');

async function dbConnect() {
    const dbType = process.env.DB_TYPE;
    if (dbType === 'mysql') {
        const pool = mysql.createPool({
            host: process.env.MYSQL_DB_HOST,
            user: process.env.MYSQL_DB_USER,
            password: process.env.MYSQL_DB_PASSWORD,
            database: process.env.MYSQL_DB_NAME
        });
        return pool.promise();  // This returns a promise-based pool
    } else if (dbType === 'sqlserver') {
        const pool = new sql.ConnectionPool({
            server: process.env.SQLSERVER_DB_HOST,
            user: process.env.SQLSERVER_DB_USER,
            password: process.env.SQLSERVER_DB_PASSWORD,
            database: process.env.SQLSERVER_DB_NAME,
            options: {
                encrypt: true,  // for Azure
                trustServerCertificate: true  // for local development
            }
        });
        await pool.connect();
        return pool;  // Ensure that the pool is connected
    }
}

module.exports = dbConnect;
