/*importing required modules*/

var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config');

/*importing routers*/

var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var uploadRouter = require('./routes/upload');
var connectionsRouter = require('./routes/connections');
var quotesRouter = require('./routes/quotes');
var commentsRouter = require('./routes/comments');
var actionsRouter = require('./routes/actions');
var guestRouter = require('./routes/guest');
var infiniteRouter = require('./routes/infinite');
var searchRouter = require('./routes/search');

/*connecting database*/

mongoose.connect(config.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(
  (database)=>{

    console.log('connected to database');

  }
)
.catch(
  (error)=>{

    console.log(`cannot connect to database: ${error.message}`);
    process.exit();

  }
)

/*creating Express app*/
var app = express();

/*initializing passport*/
app.use(passport.initialize());


/*setting up middlewares for use*/
app.use(logger('dev')); //logger is a middleware to log the processes to the console
app.use(express.json()); //json middleware parses incoming requests with json payloads
app.use(session({
  secret: 'your-secret-key',           // use env variable in real apps
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }            // set to true in production with HTTPS
}));
app.use(express.urlencoded({ extended: false })); //urlencoded middleware parses incoming requests with urlencoded payloads
app.use(cookieParser()); //parses cookie header and populates req.cookies
app.use(express.static(path.join(__dirname, 'public'))); //static middleware helps serve static files and assets in a specified directory

/*setting up routes for use*/
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);
app.use('/connections', connectionsRouter);
app.use('/quotes', quotesRouter);
app.use('/comments', commentsRouter);
app.use('/actions', actionsRouter);
app.use('/guest', guestRouter);
app.use('/infinite', infiniteRouter);
app.use('/search', searchRouter);

/* catch 404 and forward to error handler*/
app.use(function(req, res, next) {
  next(createError(404));
});

/* error handler*/
app.use(function(err, req, res, next) {

  // respond with an error status
  res.status(err.status || 500);
  res.json({
    message : err.message
  });
});

/*export app*/
module.exports = app;
