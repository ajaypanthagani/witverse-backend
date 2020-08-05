var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config');

var mongoose = require('mongoose');
var passport = require('passport');

/*routers*/
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var uploadRouter = require('./routes/upload');
var connectionsRouter = require('./routes/connections');
var quotesRouter = require('./routes/quotes');

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

var app = express();

//initializing passport
app.use(passport.initialize());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);
app.use('/connections', connectionsRouter);
app.use('/quotes', quotesRouter);

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
  res.json({
    message : err.message
  });
});

module.exports = app;
