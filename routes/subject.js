var express = require('express');
var router = express.Router();
var url = require('url');
var querystring = require('querystring');
var User = require('../models/user');
var attr = [];


/* GET student listing. */
router.get('/', function(req, res, next) {
  var rawUrl = req.originalUrl;
  var parsedUrl = url.parse(rawUrl);
  var parsedQs = querystring.parse(parsedUrl.query);
  console.log(parsedQs.id);
  User.classModel.findById(parsedQs.id,(err,subject)=>{
    if(subject){
      console.log(subject);
      subjectName = JSON.stringify(subject.subName);
      subjectStrength = JSON.parse(subject.strength);
      subjectName = subjectName.replace(/[" ']/g,' ');
      res.render('subject',{name : subjectName, strength : subjectStrength});
    }
  })
});

module.exports = router;
