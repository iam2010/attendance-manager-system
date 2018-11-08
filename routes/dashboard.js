var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://abhinav:pass1234@ds135653.mlab.com:35653/attendance_management',{useNewUrlParser:true});
var User = require('../models/user');
var subArray = {};


router.get('/',(req,res,next)=>{
    User.classModel.find({},(err,subs)=>{
    if(subs){
        var i = 0, j =0;
        subs.forEach((sub) => {
            subArray[i] = sub;
            i++;
        });
        res.render('dashboard',{sub : subArray, i : i, j : j});
    }
    else{
        res.render('dashboard',{sub : null, i : i, j : j});
    }
});
});

module.exports = router;