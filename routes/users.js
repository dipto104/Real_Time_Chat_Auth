const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

var sql=require('../config/configdb');





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
        const request = new sql.Request();
        request.input('input_name', sql.NVarChar, name);

        //hasing is done here
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              request.input('input_password', sql.NVarChar, hash);
              console.log(hash);
            });
        });
        
        
        // query to the database and save the records
        request.query("insert into tbl_registration (Username,Password) values (@input_name,@input_password)", (err, result) => {
            if(err){
                errors.push({msg:"User ID allready registered"});
                res.render('register',{
                    errors,
                    name,
                    password,
                    password2
                });
              }
            else{
                req.flash('success_msg','You are now registered and can log in');
                res.redirect('/users/login');
            } 
        });
    }
    console.log(name);
});
module.exports=router;