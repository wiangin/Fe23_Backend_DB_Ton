//in dev run nodemon with for instant reload
//add requiered library 

// const express = require('express'); //must be installed with npm
// const ejs = require('ejs'); //must be installed with npm
// const db = require('./db.js'); // Import the database module
// const bodyParser = require('body-parser');//must be installed with npm

import express from 'express';
import ejs from "ejs";
import db from "./db.js";
import bodyParser from 'body-parser';

//create variable representing express
const app = express();

//set public folder for static web pages
app.use(express.static('public'));

//set dynamic web pages, set views and engine
app.set('view engine', 'ejs');

// Set up body parser middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

//Convert body request to json
app.use(bodyParser.json());

////////////////Routing

//////// Reuest med endpoint * / * \\\\\\\\\\
//////// Reuest med endpoint * / * \\\\\\\\\\
//////// Reuest med endpoint * / * \\\\\\\\\\
app.get('/', async (req, res) => {
    //res.send("hello World");//serves index.html
    const pageTitle = "School Database";
    const sql = 'SHOW TABLES'
    const [dbData] = await db.query(sql);
    // console.log(dbData);
    res.render('index', {pageTitle, dbData});
    // res.json(dbData);
});

let currentTable;  

// Form input\\
app.post('/', async (req, res) => {
  //res.send("hello World");//serves index.html
  // console.log(req.body);
  const tableName = req.body; // with Post need request from body

  const pageTitle = `Table name = ${tableName.userInput}`; 

  // Query to Mysql \\
  const sql = `Select * FROM ${tableName.userInput} `;
  currentTable = tableName.userInput;
  const [dbData] = await db.query(sql);
  // console.log(dbData);

  const sql2 = `DESCRIBE ${tableName.userInput}`;
  const [dbDataHeaders] = await db.query(sql2);
  // console.log(dbDataHeaders);

   // TO render on webpage\\
  res.render('index', {pageTitle, dbData, dbDataHeaders});
});

//////// Reuest med endpoint * removeData * \\\\\\\\\\
//////// Reuest med endpoint * removeData * \\\\\\\\\\
//////// Reuest med endpoint * removeData * \\\\\\\\\\

app.get('/removeData', async (req, res) => {
  //res.send("hello World");//serves index.html
  const pageTitle = "Remove Data";
  
  const sql = `SELECT * FROM ${currentTable}`;
  const [dbData] = await db.query(sql);
  // console.log(dbData);

  const sql2 = `DESCRIBE ${currentTable}`;
  const [dbDataHeaders] = await db.query(sql2);

  res.render('removeData', {pageTitle, dbData, dbDataHeaders, currentTable});
});
 
app.post('/removeData', async (req, res) => {
  // console.log(req.body);
  const pageTitle = "Remove Data";
  const tableName = req.body;

  const sqlDeleteQuery = `DELETE FROM ${currentTable} WHERE id = ${tableName.id}`;
  const deleteQuery = await db.query(sqlDeleteQuery);
  // console.log(deleteQuery);

  const sql = `SELECT * FROM ${currentTable}`;
  const [dbData] = await db.query(sql);

  const sql2 = `DESCRIBE ${currentTable}`;
  const [dbDataHeaders] = await db.query(sql2);

  res.render("removeData", {pageTitle, dbData, dbDataHeaders, currentTable});
 
})

//////// Reuest med endpoint * addData * \\\\\\\\\\
//////// Reuest med endpoint * addData * \\\\\\\\\\
//////// Reuest med endpoint * addData * \\\\\\\\\\

app.get('/addData', async (req, res) => {
  //res.send("hello World");//serves index.html
  const pageTitle = "Add Data";
  
  const sql = `SELECT * FROM ${currentTable}`;
  const [dbData] = await db.query(sql);
  // console.log(dbData);

  const sql2 = `DESCRIBE ${currentTable}`;
  const [dbDataHeaders] = await db.query(sql2);

  res.render('addData', {pageTitle, dbData, dbDataHeaders, currentTable});
});

app.post('/addData', async (req, res) => {
  //res.send("hello World");//serves index.html
  // console.log( typeof req.body.student_name);
  const pageTitle = `Table name = ${currentTable}`; 

  const tableName = req.body; // with Post need request from body
  console.log(tableName);

  const objValues = Object.values(tableName);
  console.log(objValues);

  for(const data of objValues){
    console.log(data);
  }


  // Query to Mysql \\
  const stringColumn = ["student_name", "teacher_name","subject", "class_name","course_name"];
  const columnNameArr = [];
  const arr = [];
  for(const key in tableName){
    columnNameArr.push(key);
    if(stringColumn.includes(key)){
        arr.push(`"${tableName[key]}"`);
    }
    else{
      arr.push(tableName[key]);
    }
  };

  const columnNames = columnNameArr.join(",") //Put comma between values
  console.log(columnNames);
 
    const insertQuery = `INSERT INTO ${currentTable}(${columnNames}) VALUES (${arr.join(",")})`;
    console.log(insertQuery);
    const addDbData = await db.query(insertQuery);

  const sql = `SELECT * FROM ${currentTable}`;
  const [dbData] = await db.query(sql);
  
  const sql2 = `DESCRIBE ${currentTable}`;
  const [dbDataHeaders] = await db.query(sql2);
  // console.log(dbDataHeaders);

   // TO render on webpage\\
  res.render('addData', {pageTitle, dbData, dbDataHeaders, currentTable});
});


//////Rest Api \\\\\\
//////Rest Api \\\\\\
//////Rest Api \\\\\\
app.get('/students',async (req,res) => {
  // console.log("DEBUG = ", req.query.name);

let sql = 'SELECT * FROM `students`';
const values = [];

if (req.query.name){
  sql += (values.length == 0 ? " WHERE" : " AND") + "  student_name LIKE ?";
  values.push(`%${req.query.name}%`);
}
if (req.query.age) {
  sql += (values.length == 0 ? " WHERE" : " AND") + "  student_age = ?";
  values.push(req.query.age);
}

if (req.query.age_gt) {
  sql += (values.length == 0 ? " WHERE" : " AND") + "  student_age > ?";
  values.push(req.query.age_gt);
}
  const [dbData] = await db.query(sql, values);
  // console.log(dbData);
  res.json(dbData);
})

//server configuration
const port = 3000;
app.listen(port, () => {
    console.log(`server is running on  http://localhost:${port}/`);
});
