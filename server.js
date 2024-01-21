//Import the required dependencies
const inquirer = require('inquirer'); // import inquirer 
const mysql = require('mysql2');// Import and require mysql2
const cTable = require('console.table') //console.table

require('dotenv').config() //dotenv

const PORT = process.env.PORT || 3001; //connecting to the PORT

// Connect to database
const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root', // MySQL username,
    password: process.env.DB_PASSWORD, //MySQL password
    database: 'employee_db'
  }); 
  connection.connect(err => {
    if (err) throw err;
    console.log(`Connected to the employee_db database.`);
    afterConnection();
  });

//function after connection is established and welcome image shows
afterConnection = () => {
  console.log("***********************************"),
  console.log("*                                 *"),
  console.log("*        EMPLOYEE MANAGER         *"),
  console.log("*                                 *"),
  console.log("***********************************"),
  promptUser();
 };

const promptUser = () => {
inquirer.prompt([
    {
      type: 'list',
      name: 'choices', 
      message: 'What would you like to do?',
      choices: ['View all departments', 
                'View all roles', 
                'View all employees', 
                'Add a department', 
                'Add a role', 
                'Add an employee', 
                'Update an employee role',
                'Update an employee manager',
                "View employees by department",
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'No Action']
    }  
  ])
    .then((answers) => {
      const { choices } = answers; 

      if (choices === "View all departments") {
        showDepartments();
      }

      if (choices === "View all roles") {
        showRoles();
      }

      if (choices === "View all employees") {
        showEmployees();
      }

      if (choices === "Add a department") {
        addDepartment();
      }

      if (choices === "Add a role") {
        addRole();
      }

      if (choices === "Add an employee") {
        addEmployee();
      }

      if (choices === "Update an employee role") {
        updateEmployee();
      }

      if (choices === "Update an employee manager") {
        updateManager();
      }

      if (choices === "View employees by department") {
        employeeDepartment();
      }

      if (choices === "Delete a department") {
        deleteDepartment();
      }

      if (choices === "Delete a role") {
        deleteRole();
      }

      if (choices === "Delete an employee") {
        deleteEmployee();
      }

      if (choices === "No Action") {
        connection.end();
      }
  });
};

// function to show all departments
showDepartments = () => {
  console.log('Showing all departments...\n');
  const sql = 'SELECT department.id AS id, department.name AS department FROM department';

  connection.promise().query(sql)
    .then(([rows, fields]) => {
      console.log("Rows:", rows); 
      const departments = rows.map(row => ({ id: row.id, department: row.department }));
      console.table(departments);
      promptUser();
    })
    .catch((err) => {
      console.error("Query error:", err); 
      promptUser();
    });
};
// simpler function to show all departments
// showDepartments = () => {
//   console.log('Showing all departments...\n');
//   const sql = 'SELECT * FROM department'; // Use a simple SELECT * query

//   connection.promise().query(sql)
//     .then(([rows, fields]) => {
//       console.log("Rows:", rows); // Add this line
//       console.table(rows); // Display the entire result
//       promptUser();
//     })
//     .catch((err) => {
//       console.error("Query error:", err);
//       promptUser();
//     });
// };

//function to view all roles
const showRoles = () => {
  console.log('Showing all roles...\n');
  const sql = `SELECT role.id, role.title, department.name AS department 
               FROM role 
               INNER JOIN department ON role.department_id = department.id`;
  connection.promise().query(sql)
    .then(([rows, fields]) => {
      console.log("Rows:", rows); 
      console.table(rows);
      promptUser();
    })
    .catch((err) => {
      console.error("Query error:", err); 
      promptUser();
    });
};

