//Import the required dependencies
const inquirer = require('inquirer'); // import inquirer 
const mysql = require('mysql2/promise');// Import and require mysql2
const cTable = require('console.table') //console.table
require('dotenv').config() //dotenv

const PORT = process.env.PORT || 3001; //connecting to the PORT

// Create an asynchronous function to establish the connection
const connectToDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: process.env.DB_PASSWORD,
      database: 'employee_db'
    });

    console.log(`Connected to the employee_db database.`);

    // Call your afterConnection function or any other logic that depends on the connection here
    afterConnection(connection);
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
};

// Call the function to establish the connection
connectToDatabase();

//Function after connection is established and welcome image shows
const afterConnection = (connection) => {
  console.log("***********************************"),
  console.log("*                                 *"),
  console.log("*        EMPLOYEE MANAGER         *"),
  console.log("*                                 *"),
  console.log("***********************************"),
  // Call promptUser to start the program
  promptUser(connection);
 };

const promptUser = (connection) => {
inquirer.prompt([
    {
      type: 'list',
      name: 'choices', 
      message: 'What would you like to do?',
      choices: ['View all departments', 
                'Add a department', 
                'Delete a department',
                'View all roles', 
                'Add a role', 
                'Delete a role',
                'View all employees', 
                'Add an employee', 
                'Delete an employee',
                'Update an employee role',
                'Update an employee manager',
                "View employees by department",
                'No Action']
    }  
  ])
    .then((answers) => {
      const { choices } = answers; 

      if (choices === "View all departments") {
        showDepartments(connection);
      }

      if (choices === "Add a department") {
        addDepartment(connection);
      }

      if (choices === "Delete a department") {
        deleteDepartment(connection);
      }

      if (choices === "View all roles") {
        showRoles(connection);
      }

      if (choices === "Add a role") {
        addRole(connection);
      }

      if (choices === "Delete a role") {
        deleteRole(connection);
      }

      if (choices === "View all employees") {
        showEmployees(connection);
      }

      if (choices === "Add an employee") {
        addEmployee(connection);
      }

      if (choices === "Delete an employee") {
        deleteEmployee(connection);
      }

      if (choices === "Update an employee role") {
        updateEmployee(connection);
      }

      if (choices === "Update an employee manager") {
        updateManager(connection);
      }

      if (choices === "View employees by department") {
        employeeDepartment(connection);
      }

      if (choices === "No Action") {
        return;
      }
  });
};

// Function to show all departments
const showDepartments = async (connection) => {
  console.log('Showing all departments...\n');
  const sql = 'SELECT department.id AS id, department.name AS department FROM department';

  try {
    const [rows, fields] = await connection.query(sql);
    const departments = rows.map(row => ({ id: row.id, department: row.department }));
    console.table(departments);
    promptUser(connection); // Pass the connection to the next function
  } catch (err) {
    console.error("Query error:", err);
    promptUser(connection); // Handle errors and pass the connection to the next function
  }
};

//Function to add a department
const addDepartment = (connection) => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addDept',
      message: "What department do you want to add?",
      validate: addDept => {
        if (addDept) {
            return true;
        } else {
            console.log('Please enter a department');
            return false;
        }
      }
    }
  ])
    .then(answer => {
      const sql = `INSERT INTO department (name) VALUES (?)`;
      return connection.query(sql, [answer.addDept]);
  })
  .then(response => {
    console.log("Department was succesfully added");
    promptUser(connection);
  })
  .catch((err) => console.log(err));
};

// Function to delete a department
const deleteDepartment = async(connection) => {
  try {
    const deptSql = `SELECT * FROM department`;
    const [rows] = await connection.query(deptSql);

    const dept = rows.map(row => ({ value: row.id, name: row.department }));

    const deptChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'dept',
        message: "What department do you want to delete?",
        choices: dept
      }
    ]);

    const selectedDept = deptChoice.dept;
    const deleteSql = `DELETE FROM department WHERE id = ?`;
    await connection.query(deleteSql, selectedDept);
    console.log("Successfully deleted!");
    showDepartments(connection); //Pass the connection to the showDepartments function
  } catch (err) {
    console.error("Error:", err);
    promptUser(connection); //Pass the connection to the promptUser function
  }
};

//Function to view all roles
const showRoles = async (connection) => {
  console.log('Showing all roles...\n');
  const sql = `SELECT role.id, role.title, department.name AS department FROM role 
               INNER JOIN department ON role.department_id = department.id`;

  try {
    const [rows, fields] = await connection.query(sql);
    console.table(rows);
    promptUser(connection); // Pass the connection to the next function
  } catch (err) {
    console.error("Query error:", err);
    promptUser(connection); // Handle errors and pass the connection to the next function
  }
};

// Function to add a role
const addRole = async (connection) => {
  try {
    // Get departments for user selection
    const [deptRows] = await connection.query('SELECT * FROM department');
    const departments = deptRows.map(row => ({ value: row.id, name: row.name }));

    // Prompt user for role information
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: "Enter the role title:",
        validate: title => title ? true : "Please enter a title."
      },
      {
        type: 'input',
        name: 'salary',
        message: "Enter the role salary:",
        validate: salary => !isNaN(salary) ? true : "Please enter a valid number."
      },
      {
        type: 'list',
        name: 'department_id',
        message: "Select the department for the role:",
        choices: departments
      }
    ]);

  const insertSql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)'; // Insert the new role into the database
  const insertParams = [answers.title, answers.salary, answers.department_id];
    await connection.query(insertSql, insertParams);
    console.log(`Role '${answers.title}' added successfully.`);
    promptUser(connection); // Pass the connection to the next function
  } catch (err) {
    console.error("Error adding role:", err);
    promptUser(connection); // Handle errors and pass the connection to the next function
  }
};

// Function to delete a role
const deleteRole = async (connection) => {
  try {
    // Get roles for user selection
    const [roleRows] = await connection.query('SELECT * FROM role');
    const roles = roleRows.map(row => ({ value: row.id, name: row.title }));

    // Prompt user for role selection
    const roleChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'role',
        message: "Select the role to delete:",
        choices: roles
      }
    ]);

    const roleId = roleChoice.role;
    const deleteSql = 'DELETE FROM role WHERE id = ?';

    // Delete the selected role from the database
    await connection.query(deleteSql, roleId);
    console.log("Role deleted successfully.");

    showRoles(connection); // Display the updated list of roles
  } catch (err) {
    console.error("Error deleting role:", err);

    promptUser(connection); //Pass through the connection to promptUser function again
  }
};

//Function to view all employees
const showEmployees = async (connection) => {
  console.log('Showing all employees...\n');
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, 
               role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee 
               LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id
               LEFT JOIN employee manager ON employee.manager_id = manager.id`;
  try {
    const [rows, fields] = await connection.query(sql)
      console.table(rows);
      promptUser(connection); // Pass the connection to the next function
  } catch(err) {
      console.error("Query error:", err); 
      promptUser(connection); // Handle errors and pass the connection to the next function
    }
};

// Function to add an employee
const addEmployee = async (connection) => {
  try {
    // Get roles for user selection
    const [roleRows] = await connection.query('SELECT * FROM role');
    const roles = roleRows.map(row => ({ value: row.id, name: row.title }));

    // Get employees for user selection
    const [employeeRows] = await connection.query('SELECT * FROM employee');
    const employees = employeeRows.map(row => ({ value: row.id, name: `${row.first_name} ${row.last_name}` }));

    // Prompt user for employee details
    const employeeDetails = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Enter employee's first name:",
        validate: firstName => firstName ? true : 'Please enter a first name.'
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Enter employee's last name:",
        validate: lastName => lastName ? true : 'Please enter a last name.'
      },
      {
        type: 'list',
        name: 'role',
        message: "Select the employee's role:",
        choices: roles
      },
      {
        type: 'list',
        name: 'manager',
        message: "Select the employee's manager:",
        choices: [...employees, { value: null, name: 'None' }] // Allow selecting no manager
      }
    ]);

    const { firstName, lastName, role, manager } = employeeDetails;

    // Insert the new employee into the database
    const insertSql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    await connection.query(insertSql, [firstName, lastName, role, manager]);

    console.log("Employee added successfully.");

    showEmployees(connection); // Display the updated list of employees
  } catch (err) {
    console.error("Error adding employee:", err);

    promptUser(connection); // Handle errors and promptUser 
  }
};

// Function to delete an employee
const deleteEmployee = async (connection) => {
  try {
    // Get employees for user selection
    const [employeeRows] = await connection.query('SELECT * FROM employee');
    const employees = employeeRows.map(row => ({ value: row.id, name: `${row.first_name} ${row.last_name}` }));

    // Prompt user for employee selection
    const employeeChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: "Select the employee to delete:",
        choices: employees
      }
    ]);

    const employeeId = employeeChoice.employee;
    const deleteSql = 'DELETE FROM employee WHERE id = ?';

    // Delete the selected employee from the database
    await connection.query(deleteSql, employeeId);
    console.log("Employee deleted successfully.");

    showEmployees(connection); // Display the updated list of employees
  } catch (err) {
    console.error("Error deleting employee:", err);

    promptUser(connection); //Pass through the connection to promptUser function again
  }
};

// Function to update an employee's role
const updateEmployee = async (connection) => {
  try {
    // Get employees for user selection
    const [employeeRows] = await connection.query('SELECT * FROM employee');
    const employees = employeeRows.map(row => ({ value: row.id, name: `${row.first_name} ${row.last_name}` }));

    // Get roles for user selection
    const [roleRows] = await connection.query('SELECT * FROM role');
    const roles = roleRows.map(row => ({ value: row.id, name: row.title }));

    // Prompt user for employee and role information
    const employeeRoleDetails = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: "Select the employee to update:",
        choices: employees
      },
      {
        type: 'list',
        name: 'role',
        message: "Select the new role for the employee:",
        choices: roles
      }
    ]);

    const { employee, role } = employeeRoleDetails;

    // Update the employee's role in the database
    const updateSql = 'UPDATE employee SET role_id = ? WHERE id = ?';
    await connection.query(updateSql, [role, employee]);

    console.log("Employee role updated successfully.");

    showEmployees(connection); // Display the updated list of employees
  } catch (err) {
    console.error("Error updating employee role:", err);

    promptUser(connection); //Pass through the connection to promptUser function again
  }
};

// Function to update an employee's manager
const updateManager = async (connection) => {
  try {
    // Get employees for user selection
    const [employeeRows] = await connection.query('SELECT * FROM employee');
    const employees = employeeRows.map(row => ({ value: row.id, name: `${row.first_name} ${row.last_name}` }));

    // Prompt user for employee and manager information
    const employeeManagerDetails = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: "Select the employee to update:",
        choices: employees
      },
      {
        type: 'list',
        name: 'manager',
        message: "Select the new manager for the employee:",
        choices: [...employees, { value: null, name: 'None' }] // Allow selecting no manager
      }
    ]);

    const { employee, manager } = employeeManagerDetails;

    // Update the employee's manager in the database
    const updateSql = 'UPDATE employee SET manager_id = ? WHERE id = ?';
    await connection.query(updateSql, [manager, employee]);

    console.log("Employee manager updated successfully.");

    showEmployees(connection); // Display the updated list of employees
  } catch (err) {
    console.error("Error updating employee manager:", err);

    promptUser(connection); // Pass through the connection to promptUser function again
  }
};

// Function to view employees by department
const employeeDepartment = async (connection) => {
  try {
    // Get departments for user selection
    const [deptRows] = await connection.query('SELECT * FROM department');
    const departments = deptRows.map(row => ({ value: row.id, name: row.name }));

    // Prompt user for department selection
    const deptChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'department',
        message: "Select the department to view employees:",
        choices: departments
      }
    ]);

    const selectedDept = deptChoice.department;

    // Query to retrieve employees in the selected department
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department
                 FROM employee
                 LEFT JOIN role ON employee.role_id = role.id
                 LEFT JOIN department ON role.department_id = department.id
                 WHERE department.id = ?`;

    const [rows, fields] = await connection.query(sql, selectedDept);

    console.log(`Showing employees in the '${deptChoice.department}' department...\n`);
    console.table(rows);

    promptUser(connection); // Pass the connection to the next function
  } catch (err) {
    console.error("Error viewing employees by department:", err);
    promptUser(connection); // Handle errors and pass the connection to the next function
  }
};

// Call promptUser to start the program
// promptUser();

