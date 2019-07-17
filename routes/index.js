const express = require('express');
const router = express.Router();
const {ensureAuthenticated} =require('../config/auth');

router.get('/',(req,res)=>res.render('welcome'));

//dashboard
router.get('/dashboard',ensureAuthenticated,(req,res)=>res.render('dashboard',{
    name:req.user.Username
}));
module.exports=router;