var mongoose = require('mongoose');

//MONGODB CLASS SCHEMA
var classSchema = new mongoose.Schema({
    subCode : String,
    subName : String,
    semester : Number,
    section : String,
    strength : Number
});

module.exports.classSchema = classSchema;



//LOGIN SCHEMA
var loginSchema = new mongoose.Schema({
    user : String,
    pass : String
});

var loginModel = mongoose.model('logs',loginSchema);

module.exports.loginModel = loginModel;

var attendanceSchema = new mongoose.Schema({
    rollNo : Number,
    attendance : Number
  })

module.exports.attendanceSchema = attendanceSchema;

var totalSchema = mongoose.Schema({
    totalClasses : Number
})

module.exports.totalSchema = totalSchema;