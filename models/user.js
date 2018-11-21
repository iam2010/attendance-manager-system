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
