var createError = require('http-errors');
var express = require('express');
var flash = require('connect-flash');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var localStrategy = require('passport-local').Strategy;
mongoose.connect('mongodb://abhinav:pass1234@ds135653.mlab.com:35653/attendance_management',{useNewUrlParser:true});
var indexRouter = require('./routes/index');
var subjectRouter = require('./routes/subject');
var loginRouter = require('./routes/login');
var dashboardRouter = require('./routes/dashboard');
var User = require('./models/user');

//MONGOOSE INITIALIZATION
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// view engine setup
var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//SESSION INITIALIZATION
app.use(session({
  secret: 'secret',
  resave : true,
  saveUninitialized: false
}));




//ROUTES
app.use('/', indexRouter);
app.use('/subject', subjectRouter);
app.use('/login', loginRouter);
app.use('/dashboard', dashboardRouter);




//LOGIN





//SUBJECT ENTRY
app.post('/dashboard', (req, res) => {
  var subject = new User.classModel({
      subCode : req.body.subcode,
      subName : req.body.subname,
      semester : req.body.semester,
      section : req.body.section,
      strength : req.body.strength
});
subject.save(function(err,register){
    if(err) return console.log(err);
  });
  res.redirect('/dashboard');
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

//module.exports = app;

app.listen(process.env.PORT || 3000, () => {
  console.log('connected');
});
