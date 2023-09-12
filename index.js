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


// shows all departments
function viewDepartments () {
    const sql = `SELECT id, name FROM department`;
    db.query(sql, (err, departments) => {
        if (err) {
            return console.log(err); 
        }
        
        console.table(departments); 
        init();
     
    });
}


// adds a department
function addDepartment () {
    inquirer.prompt (
        {
            type: 'input',
            name: 'newDepartment',
            message: 'What is the name of the department?',
        }
    ).then(({ newDepartment }) => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        const params = [newDepartment]; 
        db.query(sql, params, (err) => {
            if (err) {
                return console.log(err);
            }
            console.log(`Successfully added ${params}`);
            init();
        }); 
    });
}


// shows all roles
function viewRoles () {
    const sql = `
    SELECT 
        r.id, r.title, r.salary, d.name as department
        FROM role r
        LEFT JOIN department d 
            ON r.department_id = d.id
        `;
    db.query(sql, (err, roles) => {
        if (err) {
            return console.log(err); 
        }
        
        console.table(roles); 
        init();
     
    });}


// adds a role
function addRole () {
    console.log('add role'); 
}


// shows all employees
function viewEmployees () {
    console.log('employees'); 
}


// add a new employee
function addEmployee () {
    console.log('add employee');
}


// updates a current employee
function updateEmployee () {
    console.log('update employee');
}


// quits the application
function quit() {
    return console.log('Goodbye');
}


// handles user input
function handleInput ({ userInput }) {
    switch (userInput) {
        case "View all departments": 
            return viewDepartments(); 
        case "View all roles":
            return viewRoles();
        case "view all employees":
            return viewEmployees(); 
        case "Add a department":
            return addDepartment(); 
        case "Add a role":
            return addRole(); 
        case "Add an employee":
            return addEmployee(); 
        case "Update current employee role":
            return updateEmployee(); 
        case "Quit":
            return quit();
    }
}


// starts the application
function init() {
    promptUser()
        .then((answers) => {
            handleInput(answers); 
        });
}


init(); 

