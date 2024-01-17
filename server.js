// import inquirer 
const inquirer = require('inquirer');

// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;

require('dotenv').config()

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: process.env.DB_PASSWORD,
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`),
    console.log("***********************************"),
    console.log("*                                 *"),
    console.log("*        EMPLOYEE MANAGER         *"),
    console.log("*                                 *"),
    console.log("***********************************"),
  );