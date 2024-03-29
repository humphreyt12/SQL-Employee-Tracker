# SQL-Employee-Tracker

## Table of Contents
 * [Description](#Description)
 * [Criteria](#Criteria)
 * [Video](#Video)
 * [Installation](#Installation)
 * [Usage](#Usage)
 * [License](#License)

## Description
 Built a command-line application from scratch to manage a company's employee database, using Node.js, Inquirer, MySQL, and Console Table.

 ## Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Video
Click link below to view a walkthrough of the application
👉 https://vimeo.com/905436262/22ac897f89?share=copy

## Installation
 npm i inquirer@8.2.4

 npm install --save mysql2

 npm install --save console.table

## Usage
Run the following command to answer the prompted questions. The questions from the application will allow users to view, add, and edit employees, roles, departments, and managers. 

npm start

## License
This project uses a MIT License


