var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cmd = require('node-cmd')
var url = require('url');
var querystring = require('querystring');
var mongoose = require('mongoose');
mongoose.connect('mongodb://abhinav:pass1234@ds135653.mlab.com:35653/attendance_management',{useNewUrlParser:true});
var session = require('express-session')
var hex = "0FAB3CF577ABF75EF246F53AE"
var indexRouter = require('./routes/index');
var subjectRouter = require('./routes/subject');
var loginRouter = require('./routes/login');
var dashboardRouter = require('./routes/dashboard');
var statusRouter = require('./routes/status')
var User = require('./models/user');


//MONGOOSE INITIALIZATION
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var mongoose = require('mongoose');


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



//ROUTES
app.use('/', indexRouter);
app.use('/subject', subjectRouter);
app.use('/login', loginRouter);
app.use('/dashboard', dashboardRouter);
app.use('/status',statusRouter);




//LOGIN
app.post('/login',(req,res)=>{
  var username = req.body.Name;
  var password = req.body.Password;
  console.log(username,password);
  var b = User.loginModel.find({user:username, pass: password});
  b.exec((err,doc)=>{
    if(err){
      console.log(err);
    }
    else if(doc.length!=0){
      console.log(doc[0].user+doc[0].pass+' -app.js');
       res.redirect('/dashboard?session='+hex+'&id='+doc[0]._id+'&user='+doc[0].user);
    }
    else{
      res.send('<body style="background-color:#1a2333"><script>window.alert("Incorrect username or password");location.href="/login"</script></body>');
    }
  })
})




//SUBJECT ENTRY
app.post('/dashboard', (req, res) => {
  var rawUrl = req.headers.referer;
  console.log(rawUrl+' -app.js')
  var parsedUrl = url.parse(rawUrl);
  var parsedQs = querystring.parse(parsedUrl.query);
  console.log(parsedQs.user+' -app.js 2');
  var subjectModel = mongoose.model(parsedQs.user,User.classSchema);
    var subject = new subjectModel({
        subCode : req.body.subcode,
        subName : req.body.subname,
        semester : req.body.semester,
        section : req.body.section,
        strength : req.body.strength
    });
    subject.save(function(err,register){
      if(err) return console.log(err);
    });
    res.send('<body style="background-color:#1a2333"><script>window.alert("Subject added");location.href="'+rawUrl+'"</script></body>');
});





//DELETE SUBJECT
app.post('/delete', (req, res) => {
  var rawUrl = req.headers.referer;
  console.log(rawUrl)
  var parsedUrl = url.parse(rawUrl);
  var parsedQs = querystring.parse(parsedUrl.query);
  console.log(parsedQs.user)
  var subjectModel = mongoose.model(parsedQs.user,User.classSchema);
  subjectModel.findByIdAndDelete(parsedQs.id,(err,doc)=>{
    var collection = doc.subName+doc.semester+doc.section;
    mongoose.connection.db.dropCollection(collection);
      console.log(doc)
      res.send('<body style="background-color:#1a2333"><script>window.alert("Subject deleted");window.close();</script></body>');

  });
});





//REGISTER
app.post('/register', (req, res) => {
  var rawUrl = req.headers.referer;
  console.log(rawUrl)
  var parsedUrl = url.parse(rawUrl);
  var parsedQs = querystring.parse(parsedUrl.query);
  var subjectModel = mongoose.model(parsedQs.user,User.classSchema);

  subjectModel.findById(parsedQs.id,(err,docs)=>{
    var subject = docs.subName;
    var currClass = docs.semester+docs.section;
    var collection = subject+currClass;
    var strength = docs.strength;
    console.log('collection-'+collection);
    var presentStudents = req.body.student;
    var attendanceModel = mongoose.model('attendance',User.attendanceSchema,collection)
    var totalModel = mongoose.model('total',User.totalSchema,collection);

    attendanceModel.findOne({rollNo : 1},(err,docs)=>{
      if(docs){
        res.send('<body style="background-color:#1a2333"><script>window.alert("Class is already registered");location.href="'+rawUrl+'"</script></body>');
      }
      else{
        for(var i=1; i<=strength; i++){
          var student = {
            rollNo : i,
            attendance : 0
          }
        attendanceModel.create(student);
        }
        var mongoId = new mongoose.mongo.ObjectId(parsedQs.id);
        console.log('id-'+mongoId)
        totalModel.create({_id: mongoId,total : 0});
        res.send('<body style="background-color:#1a2333"><script>window.alert("Class registered");location.href="'+rawUrl+'"</script></body>');
      }
    })
  })
});






//ATTENDANCE
app.post('/attendance', (req, res) => {
  var rawUrl = req.headers.referer;
  var parsedUrl = url.parse(rawUrl);
  var parsedQs = querystring.parse(parsedUrl.query);
  var subjectModel = mongoose.model(parsedQs.user,User.classSchema);

  subjectModel.findById(parsedQs.id,(err,docs)=>{
    var subject = docs.subName;
    var currClass = docs.semester+docs.section;
    var collection = subject+currClass;
    var strength = docs.strength;
    console.log('collection-'+collection);
    var presentStudents = req.body.student;
    var attendanceModel = mongoose.model('attendance',User.attendanceSchema,collection)
    var totalModel = mongoose.model('total',User.totalSchema,collection);

    attendanceModel.find({rollNo : 1},(err,docs)=>{
      if(docs){
        console.log('docs-'+docs);
        totalModel.findByIdAndUpdate(parsedQs.id,{$inc : {total : 1}},(err,doc)=>{
          console.log(doc)
        })
        if(presentStudents != undefined){
          presentStudents.forEach(element => {
            console.log(element)
            attendanceModel.findOneAndUpdate({rollNo : element},{$inc : {attendance : 1}},(err,doc)=>{
              console.log('doc-'+doc);
            })
          });
        }
        else{
        }
        res.send('<body style="background-color:#1a2333"><script>window.alert("Attendance taken");location.href="'+rawUrl+'"</script></body>');
      }
      else{
        res.send('<body style="background-color:#1a2333"><script>window.alert("Class not registered");location.href="'+rawUrl+'"</script></body>');
      }
    })
  })
});





//ATTENDANCE STATUS
app.post('/statuses', (req, res) => {
  var collection = req.body.subject + req.body.semester + req.body.section;
  var rollNo = req.body.rollNo;
  var statusModel = mongoose.model('attendance',User.attendanceSchema,collection);
  statusModel.findOne({rollNo : rollNo},(err,doc)=>{
    if(doc){
      statusModel.find({},(err,docs)=>{
        console.log(docs);
      })
      res.write('<body style="background-color:#1a2333"><h1 style="text-align:center;color:white;">Classes attended: '+doc.attendance+'</h1></body>')
    }
    else{
      res.send('<body style="background-color:#1a2333"><script>window.alert("Please enter correct information");location.href="/status"</script></body>');
    }
  })
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
