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
  console.log(dbData);

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
  const tableName = req.body; // with Post need request from body
  const age = parseInt(tableName.student_age);
  const classId = parseInt(tableName.class_id);

  const pageTitle = `Table name = ${currentTable}`; 

  // Query to Mysql \\

  const insertQuery = `INSERT INTO ${currentTable}(student_name, student_age, class_id) VALUES ("${tableName.student_name}", ${age}, ${classId})`;
  const addDbData = await db.query(insertQuery);
  console.log(addDbData);

  const sql = `SELECT * FROM ${currentTable}`;
  const [dbData] = await db.query(sql);
  
  const sql2 = `DESCRIBE ${currentTable}`;
  const [dbDataHeaders] = await db.query(sql2);
  // console.log(dbDataHeaders);

   // TO render on webpage\\
  res.render('addData', {pageTitle, dbData, dbDataHeaders, currentTable});
});

//server configuration
const port = 3000;
app.listen(port, () => {
    console.log(`server is running on  http://localhost:${port}/`);
});
