const mysql = require('mysql2');
require('dotenv').config();
let db = null;

module.exports = {
  mysql: () => {
    if (!db) {
      db = mysql.createConnection(
        {
          host: 'localhost',
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME
        },
        console.log(`Connected to the movies_db database.`)
      );
    }

    return db;
  }
};



