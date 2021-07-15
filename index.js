//require dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");
const { promisify } = require("util");

//creat connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "ykitchkey1!",
  database: "employee_trackerdb",
});

//   const afterConnection = () => {
//     connection.query('SELECT * FROM employees', (err, res) => {
//       if (err) throw err;
//       console.log(res);
//       connection.end();
//     });
//   };
const query = promisify(connection.query).bind(connection);

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  // afterConnection()
  //connection.end();
});

//Add inquirer prompts

// first prompt add, view update (bonus update employee manager, view employees by manage, delete department,role and employee)

function initPromt() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "initMenu",
        message: "What would you like to do...\n",
        choices: [
          "Add Employee's",
          "View Employee's",
          "Update Employee Role's",
        ],
      },
    ])
    .then((res) => {
      switch (res.initMenu) {
        case "Add Employee's":
          addEmployee();
          break;
        case "View Employee's":
          viewEmployee();
          break;
      }
    });
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
            initPromt();
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
    initPromt()
  });
}

//add update function
async function updateEmployee() {
   const empArray = await query("SELECT * FROM employees", (err, res) => {
        if (err) throw err;
    })

    const empList = empArray.map((employee) => ({
        name: empArray.first_name + "" + empArray.last_name,
        value: empArray.id
    }))

    console.log(empList)
}

initPromt();
