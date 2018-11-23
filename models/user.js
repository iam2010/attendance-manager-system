var mongoose = require('mongoose');

//MONGODB CLASS SCHEMA
var classSchema = new mongoose.Schema({
    subCode : String,
    subName : String,
    semester : Number,
    section : String,
    strength : Number
});

var classModel = mongoose.model('teacherSubjects',classSchema);

module.exports.classModel = classModel;


//LOGIN SCHEMA
var loginSchema = new mongoose.Schema({
    user : String,
    pass : String
  });
  
  var loginModel = mongoose.model('logs',loginSchema);

  module.exports.loginModel = loginModel;