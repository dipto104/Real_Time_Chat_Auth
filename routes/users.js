const express = require('express');
const router = express.Router();
//login page
router.get('/login',(req,res)=>res.render('login'));

//register page
router.get('/register',(req,res)=>res.render('register'));

//register handle
router.post('/register',(req,res)=>{
    var errors=[];

    const {name,password,password2}=req.body;

    if(!name||!password||!password2){
        errors.push({msg:"please fill in the fields"});
    }

    if(password != password2){
        errors.push({msg:"passwords don't match"});
    }

    if(password.length<6){
        errors.push({msg:"password should be atleast 6 character"});
    }

    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            password,
            password2
        });
    }else{
        res.send("pass");
    }
    console.log(name);
    res.send("hello")
});
module.exports=router;