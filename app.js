const createError = require('http-errors');
const express = require('express');
const path = require('path');
const { restoreUser } = require("./auth");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require('./db/models');
const session = require('express-session');
const favicon = require('serve-favicon')
const cors = require('cors');

const answersRouter = require('./routes/answers')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const questionsRouter = require('./routes/questions');
const {environment,sessionSecret} =require('./config');
const app = express();
app.use(session({ name: 'qhistory.sid', secret: sessionSecret, resave: false, saveUninitialzed: false }));
// view engine setup
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(sessionSecret));
app.use(express.static(path.join(__dirname, 'public')));
app.use(restoreUser);
// app.use('/favicon.ico', express.static('public/images/favicon.ico'));
app.use("/public", express.static('public')); 

var corsOptions = {
  origin: 'http://localhost:8080', 
  optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions));

// app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
// app.use(favicon(__dirname + '/public/images/favicon.ico'));
// app.use(express.favicon(path.join(__dirname, 'public','images','favicon.ico'))); 


// our routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/questions', questionsRouter);
app.use('/answers', answersRouter);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


module.exports = app;
