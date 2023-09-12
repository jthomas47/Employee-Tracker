const inquirer = require('inquirer');
const db = require('./config/connection').mysql();


// connect to database
db.connect((err) => {
    if (err) {
        console.log(err);
        throw err;
    }
});
