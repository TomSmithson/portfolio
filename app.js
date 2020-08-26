// Imports
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const cors = require("cors");
const Pool = require("pg").Pool;
const app = express();

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Database
const pool = new Pool({
    user: "postgres",
    password: "Smithson123",
    host: "localhost",
    port: 5432,
    database: "portfolio"
});

// Routes
app.get("/", async (req, res, next) => {
    const projects = await pool.query("SELECT * FROM project");
    console.log(projects);
    res.render("index", {projects: projects["rows"]});
});

// Adding a new Project
//app.get("/add", (req, res, next) => {
//    res.render("add");
//});

//app.post("/add", (req, res, next) => {
//    pool.query("INSERT INTO project (title, description, link, image_path) VALUES($1, $2, $3, $4)", [req.body.title, req.body.description, req.body.link, req.body.image_path])
//        .then(res => console.log("Successfully Added"))
//        .catch(err => console.log(err));
//    res.redirect("/");
//});

// Removing a Project
//app.get("/remove", (req, res, next) => {
//    res.render("remove");
//});

//app.post("/remove", (req, res, next) => {
//    pool.query("DELETE FROM project WHERE title='" + req.body.title + "';")
//        .then(res => console.log("Successfully Deleted"))
//        .catch(err => console.log(err));
//    res.redirect("/");
//})

//app.get("/update", (req, res, next) => {
//    res.render("update")
//})

//app.post("/update", (req, res, next) => {
//    pool.query("UPDATE project SET description='" + req.body.description + "' WHERE title='" + req.body.title + "';")
//        .then(res => console.log("Successfully Updated"))
//        .catch(err => console.log(err))
//    res.redirect("/");
//})

// Error Handling
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Starting the Server
app.listen(3000, () => {
    console.log("Listening on port 3000");
})
