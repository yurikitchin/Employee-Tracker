DROP DATABASE IF EXISTS employee_trackerdb;
CREATE DATABASE employee_trackerdb;
USE employee_trackerdb;
CREATE TABLE department (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT, 
  PRIMARY KEY (id),
  CONSTRAINT FK_departmentID FOREIGN KEY (department_id)
  REFERENCES department(id)
);

CREATE TABLE employees (
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  CONSTRAINT FK_role FOREIGN KEY (role_id)
  REFERENCES roles(id),
  CONSTRAINT FK_eployeeManager FOREIGN KEY (manager_id)
  REFERENCES employees(id)
);

INSERT INTO department (department_name)
VALUES ('Administration');
INSERT INTO department (department_name)
VALUES ("Front-end Development");
INSERT INTO department (department_name)
VALUES ("Back-end Development");

-- roles
INSERT INTO roles (id, title, salary, department_id)  
VALUES (1, 'Recptionist', '35000', 1);
INSERT INTO roles (id, title, salary, department_id)
VALUES (2, 'HR administrator', '50000', 1);
INSERT INTO roles (id, title, salary, department_id)
VALUES (3 , 'Office Manager', '150000', 1);
INSERT INTO roles (id, title, salary, department_id)
VALUES (4, 'Junior designer', '50000', 2);
INSERT INTO roles (id, title, salary, department_id)
VALUES (5, 'Seniour designer', '70000', 2);
INSERT INTO roles (id, title, salary, department_id)
VALUES (6, 'Design Team Leader', '100000', 2);
INSERT INTO roles (id, title, salary, department_id)
VALUES (7, 'Junior Dev', '50000', 3);
INSERT INTO roles (id, title, salary, department_id)
VALUES (8, 'Senior Dev', '70000', 3);
INSERT INTO roles (id, title, salary, department_id)
VALUES (9, 'Development Team Leader', '100000', 3);

-- employees
-- Administration
INSERT INTO employees (id, first_name, last_name, role_id, manager_id) 
VALUES (1, 'John', "Doe", 3, NULL ); 
INSERT INTO employees (id, first_name, last_name, role_id, manager_id) 
VALUES (4, 'lenny', "kravits", 1, 1 ); 
INSERT INTO employees (id, first_name, last_name, role_id, manager_id) 
VALUES (5, 'sarah', "marshall", 2, 1 ); 
-- front end
INSERT INTO employees (id, first_name, last_name, role_id, manager_id) 
VALUES (2, 'Jane', "Doe", 6, NULL ); 
INSERT INTO employees (id, first_name, last_name, role_id, manager_id) 
VALUES (6, 'jenny', "savage", 4, 2 ); 
INSERT INTO employees (id, first_name, last_name, role_id, manager_id) 
VALUES (7, 'kayla', "yildiz", 5, 2 ); 
-- backend 
INSERT INTO employees (id, first_name, last_name, role_id, manager_id) 
VALUES (3, 'Kenny', "Powers", 9, NULL );
INSERT INTO employees (id, first_name, last_name, role_id, manager_id) 
VALUES (8, 'lara', "croft", 7, 3 );
INSERT INTO employees (id, first_name, last_name, role_id, manager_id) 
VALUES (9, 'Joe', "Exotic", 8, 3 );  