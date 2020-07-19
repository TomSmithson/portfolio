const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const cors = require("cors");
const Pool = require("pg").Pool;
const app = express();

// view engine setup
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

// const newProject = pool.query("INSERT INTO project (title, image_path, description) VALUES($1, $2, $3)", ["Title", "/images/FitnessApp.png", "Description"])
//     .then(res => console.log(res))
//     .catch(err => console.log(err));

// Routes
app.get("/", async (req, res, next) => {
    const projects = await pool.query("SELECT * FROM project");
    res.render("index", {projects: projects["rows"]});
});

app.get("/add", (req, res, next) => {
    res.render("update");
});

app.post("/add", (req, res, next) => {
    console.log(req.body);
    // Insert this new Project into the database
    pool.query("INSERT INTO project (title, description, link, image_path) VALUES($1, $2, $3, $4)", [req.body.title, req.body.description, req.body.image_path, req.body.link])
        .then(res => console.log("Successfully Added"))
        .catch(err => console.log("Error Adding"));
    res.redirect("/");
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
})
