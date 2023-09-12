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
    inquirer.prompt ([
        {
            type: 'input',
            name: 'roleName',
            message: 'What is the name of the role?',
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary for the role?',
        },
        {
            type: 'input',
            name: 'roleDepartment',
            message: 'What department does the role belong to?',
        },


    ]).then( async ({ roleName, roleSalary, roleDepartment }) => {
        const getId = `SELECT id FROM department WHERE name = '${roleDepartment}'`; 
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        const id = await db.promise().query(getId);
        const params = [roleName, roleSalary, id[0][0].id]; 
        db.query(sql, params, (err) => {
            if (err) {
                console.log(err); 
            }
            console.log(`Successfully added ${roleName}`); 
            init();
        });  
     }); 
}


// shows all employees
async function viewEmployees () {
    const sql = `
    SELECT 
        e.id, e.first_name AS first, e.last_name AS last, r.title, r.salary, d.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) as manager
        FROM employee e
        LEFT JOIN role r
            ON e.role_id = r.id
        LEFT JOIN department d
            ON r.department_id = d.id
        LEFT JOIN employee manager 
            ON manager.id = e.manager_id
        `;
        
        
    db.query(sql, (err, employees) => {
        if (err) {
            return console.log(err); 
        }
        
        console.table(employees); 
        init();
     
    });}


// add a new employee
function addEmployee () {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is their first name?',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is their last name?',
        },
        {
            type: 'input',
            name: 'role',
            message: 'What is their role?',
        },
        {
            type: 'input',
            name: 'manager',
            message: 'Who is their manager?',
        }

    ]).then(async ({ firstName, lastName, role, manager }) => {
        const getRoleId = `SELECT id FROM role WHERE title = '${role}'`; 
        const getManagerId = `SELECT id FROM employee e WHERE CONCAT(e.first_name, ' ', e.last_name) = '${manager}' `
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id ) VALUES (?, ?, ?, ?)`; 
        const roleId = await db.promise().query(getRoleId); 
        const managerId = await db.promise().query(getManagerId); 
        let manager_id = null; 
        if (managerId) {
            manager_id = managerId[0][0].id;
        }
        const params = [firstName, lastName, roleId[0][0].id, manager_id] 

        db.query(sql, params, (err) => {
            if (err) {
                console.log(err); 
            }
            init(); 
        }); 
        
       
    });
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

