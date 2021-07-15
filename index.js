//require dependencies
const mysql = require('mysql2')
const inquirer = require('inquirer');
const { promisify } = require("util")

//creat connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'ykitchkey1!',
    database: 'employee_trackerdb',
  });
  
//   const afterConnection = () => {
//     connection.query('SELECT * FROM employees', (err, res) => {
//       if (err) throw err;
//       console.log(res);
//       connection.end();
//     });
//   };
 const query = promisify(connection.query).bind(connection)
  connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    // afterConnection()
    //connection.end();
  });
  
  //Add inquirer prompts

  // first prompt add, view update (bonus update employee manager, view employees by manage, delete department,role and employee)

  function initPromt() {
      inquirer.prompt([
        {
            type: "list",
            name: "initMenu",
            message:"What would you like to do...\n",
            choices:["Add Employee's", "View Employee's", "Update Employee Role's"]

        }
      ])
      .then(res => {
          switch (res.initMenu) {
              case "Add Employee's":
                  addEmployee()
                  break;
          }
      })
  }

  //Add employees function
  
  //creat array of roles from database
  async function addEmployee() {
      //create array of managers from database
      //combine first and last name to create choices, insert ID into new employee manager_id on table
      const managersObject = await query (
         `SELECT first_name, last_name, id FROM employees where manager_id IS NULL`
      )
      const optionsArray = managersObject.map((managerName) => ({
          name:managerName.first_name + managerName.last_name,
          value: managerName.id
      }))
      console.log(optionsArray)
    
      const rolesArray = await query (
          `SELECT * FROM roles`
      )
    //   console.log(rolesArray)
    //   inquirer.prompt([
    //       {
    //           type: "input",
    //           name: "fName",
    //           message: "Please enter employee's first name"
    //       },
    //       {
    //           type: 'input',
    //           name: "lName",
    //           message: "Please enter employee's last name"
    //       }
    //   ])
  }


  initPromt()