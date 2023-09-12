const inquirer = require('inquirer');
const db = require('./config/connection').mysql();


// connect to database
db.connect((err) => {
    if (err) {
        console.log(err);
        throw err;
    }
});

// prompt user 
function promptUser () {
    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'userInput',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'view all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update current employee role',
                    'Quit'
                ]
            }
        ]);
}


// starts the application
function init() {
    promptUser()
        .then((answers) => {
            handleInput(answers); 
        });
}


init(); 

