const mysql = require('mysql2');
require('dotenv').config();
let db = null;

module.exports = {
  mysql: () => {
    if (!db) {
      db = mysql.createConnection(
        {
          host: 'localhost',
          user: process.env.DB_USER, // your username here
          password: process.env.DB_PASSWORD, // your password here
          database: process.env.DB_NAME // company_db here
        },
        console.log(`Connected to the movies_db database.`)
      );
    }

    return db;
  }
};



