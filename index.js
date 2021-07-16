//require dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");
const { promisify } = require("util");
const { async } = require("rxjs");

//creat connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "ykitchkey1!",
  database: "employee_trackerdb",
});

const query = promisify(connection.query).bind(connection);

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  //connection.end();
});

//Add inquirer prompts
//add initial prompt
function initPrompt() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "initMenu",
        message: "What would you like to do...\n",
        choices: ["Add", "View", "Update"],
      },
    ])
    .then((res) => {
      switch (res.initMenu) {
        case "Add":
          Add();
          break;
        case "View":
          View();
          break;
        case "Update":
          Update();
      }
    });
}

//Prompts to add department, employee or role
function Add() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "add",
        message: "what would you like to add?",
        choices: ["Department", "Role", "Employee", "Back"],
      },
    ])
    .then((res) => {
      switch (res.add) {
        case "Department":
          console.log("add department function goes here");
          addDept();
          break;
        case "Role":
          console.log("add role function goes here");
          addRole()            ;
          break;
        case "Employee":
          addEmployee();
          break;
        case "Back":
          initPrompt();
          break;
      }
    });
}

//prompts to view department, employee or role
function View() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "view",
        message: "what would you like to view?",
        choices: ["Department", "Role", "Employee", "Back"],
      },
    ])
    .then((res) => {
      switch (res.view) {
        case "Department":
          console.log("VIEW department function goes here");
          viewDept();
          break;
        case "Role":
          console.log("View role function goes here");
          viewRole();
          break;
        case "Employee":
          viewEmployee();
          break;
        case "Back":
          initPrompt();
          break;
      }
    });
}

function Update() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "update",
        message: "what would you like to update?",
        choices: ["Department", "Role", "Employee", "Back"],
      },
    ])
    .then((res) => {
      switch (res.update) {
        case "Department":
          console.log("Update department function goes here");
          Update();
          break;
        case "Role":
          console.log("Update role function goes here");
          Update();
          break;
        case "Employee":
          updateEmployee();
          break;
        case "Back":
          initPrompt();
          break;
      }
    });
}

// first prompt add, view update (bonus update employee manager, view employees by manage, delete department,role and employee)


//Add department function
async function addDept() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "deptName",
        message: "Please enter the name of your new department",
      },
    ])
    .then((deptName) => {
      console.log(deptName);
      console.log("Adding your new department............");
      async function deptDB() {
        await query(
          `INSERT INTO department (department_name) VALUES ('${deptName.deptName}')`,
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} department has been added\n`);
            console.table(res);
            initPrompt();
          }
        )
        
      }
      deptDB();
    });
}

//Add Role function
async function addRole() {
    const departments = await query( `SELECT department_name, id FROM department`)

    const deptOpt = departments.map((deptName) => ({
        name: deptName.department_name,
        value: deptName.id
    }))
    inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Please enter the title of your new role",
      },
      {
        type: "input",
        name: "salary",
        message: "Please enter the salary of your new role",
      },
      {
        type: "list",
        name: "department",
        message: "Please select the department for your new role",
        choices: deptOpt
      }
    ])
    .then((answers) => {
        console.log("Adding your new employee role............")
        console.log(answers)
        async function newRoleDB() {
          await query(
            `INSERT INTO roles (title, salary, department_id)  
            VALUES ('${answers.title}', '${answers.salary}', ${answers.department})`,
            (err, res) => {
              if (err) throw err;
              console.log(`${res.affectedRows} department has been added\n`);
              console.table(res);
              initPrompt();
            }
          )
          
        }
        newRoleDB();
    })

}

//Add employees function
async function addEmployee() {
  //create array of managers from database
  //combine first and last name to create choices, insert ID into new employee manager_id on table
  const managersObject = await query(
    `SELECT first_name, last_name, id FROM employees where manager_id IS NULL`
  );
  const manOpt = managersObject.map((managerName) => ({
    name: managerName.first_name + " " + managerName.last_name,
    value: managerName.id,
  }));

  const rolesArray = await query(`SELECT * FROM roles`);

  const roleOpt = rolesArray.map((roles) => ({
    name: roles.title,
    value: roles.id,
  }));

  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Please enter employee's first name",
      },
      {
        type: "input",
        name: "last_name",
        message: "Please enter employee's last name",
      },
      {
        type: "list",
        name: "role_id",
        message: "Please select Employee Role",
        choices: roleOpt,
      },
      {
        type: "list",
        name: "manager_id",
        message: "Please select employee Manager",
        choices: manOpt,
      },
    ])
    .then((employeeData) => {
      console.log("Adding a new employee to database....\n");
      //   console.log(employeeData)
      async function insEmployee() {
        await query(
          `INSERT INTO employees (first_name, last_name, role_id, manager_id)
              VALUES ("${employeeData.first_name}", "${employeeData.last_name}", ${employeeData.role_id}, ${employeeData.manager_id})`,
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} Employee has been updated\n`);
            console.table(res);
            initPrompt();
          }
        );
      }
      insEmployee();
    });
}

//view employee's function
async function viewEmployee() {
  await query("SELECT * FROM employees", (err, res) => {
    if (err) throw err;
    console.table(res);
    initPrompt();
  });
}

//View department function
async function viewDept() {
  await query (`SELECT * FROM department`, (err, res) => {
    if (err) throw err;
    console.table(res)
    initPrompt()
  })
}

//View role Function
async function viewRole() {
  await query (`SELECT * FROM roles`, (err, res) => {
    if (err) throw err;
    console.table(res)
    initPrompt()
  })
}

//add update function
async function updateEmployee() {
  const empArray = await query("SELECT * FROM employees");

  const empList = empArray.map((employee) => ({
    name: employee.first_name + " " + employee.last_name,
    value: employee.id,
  }));

  const managersObject = await query(
    `SELECT first_name, last_name, id FROM employees where manager_id IS NULL`
  );
  const manOpt = managersObject.map((managerName) => ({
    name: managerName.first_name + " " + managerName.last_name,
    value: managerName.id,
  }));

  const rolesArray = await query(`SELECT * FROM roles`);

  const roleOpt = rolesArray.map((roles) => ({
    name: roles.title,
    value: roles.id,
  }));

  inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Please select an employee to update",
        choices: empList,
      },
      {
        type: "confirm",
        name: "roleConfirm",
        message: "Do you want to update the role",
      },
      {
        type: "list",
        name: "role",
        message: "Please select new role",
        choices: roleOpt,
        when: function (answers) {
          return answers.roleConfirm;
        },
      },
      {
        type: "confirm",
        name: "manConfirm",
        message: "Do you want to update the Manager",
      },
      {
        type: "list",
        name: "manager",
        message: "Please select new manager",
        choices: manOpt,
        when: function (answers) {
          return answers.manConfirm;
        },
      },
    ])
    .then((answers) => {
      async function updateDB(answers) {
        if (answers.role) {
          await query(
            `UPDATE employees SET role_id = ${answers.role} WHERE id=${answers.employee}`,
            (err, res) => {
              if (err) throw err;
              console.log(`${res.affectedRows} Employee has been updated\n`);
              console.table(res);
            }
          );
        }
        if (answers.manager) {
          await query(
            `UPDATE employees SET manager_id=${answers.manager} WHERE id=${answers.employee}`,
            (err, res) => {
              if (err) throw err;
              console.log(`${res.affectedRows} Employee has been updated\n`);
              console.table(res);
              initPrompt;
            }
          );
        }
      }

      updateDB(answers);
    });
}

initPrompt();
