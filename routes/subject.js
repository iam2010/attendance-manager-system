var express = require('express');
var router = express.Router();
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://abhinav:pass1234@ds135653.mlab.com:35653/attendance_management',{useNewUrlParser:true});
var url = require('url');
var querystring = require('querystring');
var User = require('../models/user');
var attr = [];
var subjectClass;
var subjectSection;
var subjectName;
var parsedQs;


/* GET student listing. */
router.get('/', function(req, res, next) {
  var rawUrl = req.originalUrl;
  var parsedUrl = url.parse(rawUrl);
  parsedQs = querystring.parse(parsedUrl.query);
  User.classModel.findById(parsedQs.id,(err,subject)=>{
    if(subject){
      subjectName = JSON.stringify(subject.subName);
      subjectStrength = JSON.parse(subject.strength);
      subjectCode = JSON.stringify(subject.subCode);
      subjectClass = JSON.stringify(subject.semester);
      subjectSection = JSON.stringify(subject.section);
      subjectName = subjectName.replace(/[" ']/g,' ');
      subjectCode = subjectCode.replace(/[" ']/g,' ');
      res.render('subject',{name : subjectName, strength : subjectStrength, code : subjectCode});
    }
  })
});

module.exports = router;
