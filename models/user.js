var mongoose = require('mongoose');

//MONGODB CLASS SCHEMA
var classSchema = new mongoose.Schema({
  subCode : String,
  subName : String,
  semester : Number,
  section : String
});

classSchema.path('subCode').validate((value)=>{
  regex = /[0-9]{2}[a-z]{2,3}[0-9]{2,3}/i;
    return regex.test(value);
},"Subject code format error");

var classModel = mongoose.model('teacherSubjects',classSchema);

module.exports.classModel = classModel;



//LOGIN SCHEMA
var loginSchema = new mongoose.Schema({
  username : String,
  password : String
});

var loginModel = mongoose.model('login',loginSchema);

module.exports.loginModel = loginModel;