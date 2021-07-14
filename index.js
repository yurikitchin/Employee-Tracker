//require dependencies
const mysql = require('mysql2')
const inquirer = require('inquirer')

//creat connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'ykitchkey1!',
    database: 'employee_trackerdb',
  });
  
  connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    connection.end();
  });
  