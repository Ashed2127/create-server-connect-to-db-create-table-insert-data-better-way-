// Import the required modules
const mysql = require("mysql"); // Import the MySQL module for database connection
const express = require("express"); // Import the Express module for creating a web server
const bodyParser = require("body-parser");
const e = require("express");

// Create an Express app instance
const app = express();

// Define the port to listen on
const port = 1200;

// Start the Express app and listen for requests on the specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended : true}));

// app.use(bodyParser.json());

// Create a connection to the MySQL database
const myConnection = mysql.createConnection({
  host: "127.0.0.1", // Specify the host of the MySQL server
  user: "biruk", // Specify the username for database access
  password: "1234", // Specify the password for database access
  database: "biruk", // Specify the name of the database to connect to
});

// Connect to the MySQL database
myConnection.connect((err) => {
  if (err) {
    throw err; // Handle any connection errors
  } else {
    console.log("Connected to MySQL database!"); // Log a message indicating successful connection
  }
});

//To Create New Tables
// Define a route to handle '/createtable' requests
app.get("/createtable", (req, res) => {
  // Define the SQL queries to create the tables
  let products = `CREATE TABLE IF NOT EXISTS Products(
    product_id INT(11) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (product_id)
  )`;

  let company = `CREATE TABLE IF NOT EXISTS Company(
    company_id INT(11) AUTO_INCREMENT,
    product_id INT(11),
    company_name VARCHAR(255) NOT NULL,
    company_address VARCHAR(255) NOT NULL,
    PRIMARY KEY (company_id),
    FOREIGN KEY (product_id) REFERENCES Products (product_id)
  )`;

  let description = `CREATE TABLE IF NOT EXISTS Description(
  product_id INT(11) NOT NULL,
  company_id INT(11) AUTO_INCREMENT,
  company_description VARCHAR(255),
  FOREIGN KEY (product_id) REFERENCES Products (product_id),
  FOREIGN KEY (company_id) REFERENCES Company (company_id)
)`;

  // Execute the SQL queries to create the tables
  myConnection.query(products, (err, results, fields) => {
    if (err) {
      console.log(err); // Log any errors during table creation
    }
  });

  myConnection.query(company, (err, results, fields) => {
    if (err) {
      console.log(err); // Log any errors during table creation
    }
  });

  myConnection.query(description, (err, results, fields) => {
    if (err) {
      console.log(err);
    }
  });
  // Send the response message to the client

  res.end("table created");
});

//To Add an items on the previos created tables from web form
app.post("/additems", (req, res) => {
  console.log(req.body);
  // res.send("its working...");

  //store the parsed items into variable from body object that store as json format
  const {
    product_id,
    product_name,
    company_name,
    company_address,
    company_description,
  } = req.body;
  // console.table(req.body);

  let addProducts = `INSERT INTO products (product_id, product_name) VALUES (?, ?)`;

  let addCompany = `INSERT INTO company (product_id, company_name, company_address) VALUES (?, ?, ?)`;

  let addDescription = `INSERT INTO description (product_id, company_description) VALUES (?, ?)`;

  myConnection.query(
    addProducts,
    [product_id, product_name],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log("record inserted on product table");
      }
    }
  );

  myConnection.query(
    addCompany,
    [product_id, company_name, company_address],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log("record inserted on company table");
      }
    }
  );

  myConnection.query(
    addDescription,
    [product_id, company_description],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log("record inserted on description table");
      }
    }
  );
  res.end("data inserted...");
});
