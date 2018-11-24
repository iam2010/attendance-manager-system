var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://abhinav:pass1234@ds135653.mlab.com:35653/attendance_management',{useNewUrlParser:true});
var url = require('url');
var querystring = require('querystring');
var User = require('../models/user');
var subArray = [];


router.get('/',(req,res,next)=>{
    var rawUrl = req.originalUrl;
    var parsedUrl = url.parse(rawUrl);
    var parsedQs = querystring.parse(parsedUrl.query);
    User.loginModel.findById(parsedQs.id,(err,doc)=>{
        var subjectModel = mongoose.model(doc.user,User.classSchema);
        subjectModel.find({},(err,subs)=>{
        if(subs){
            var i = 0;
            subs.forEach((sub) => {
                subArray[i] = sub;
                i++;
            });
            res.render('dashboard',{sub : subArray, user : parsedQs.user});
        }
        else{
            res.render('dashboard',{sub : null});
        }
    });
});
});



module.exports = router;