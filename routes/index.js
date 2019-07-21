const express = require('express');
const router = express.Router();
const {ensureAuthenticated} =require('../config/auth');
var sql=require('../config/configdb');

router.get('/',(req,res)=>res.render('welcome'));

//dashboard
router.get('/dashboard',ensureAuthenticated,(req,res)=>res.render('dashboard',{
    name:req.user.Username
}));

//message
router.post('/message',ensureAuthenticated,(req,res)=>{
    console.log('body: ' + JSON.stringify(req.body.data));

    var messagedata=req.body.data;
    console.log(messagedata[0].MessageID);



    const request = new sql.Request();
    request.input('input_messageid', sql.NVarChar, messagedata[0].MessageID);
    request.input('input_fromid', sql.NVarChar, messagedata[0].FromID);
    request.input('input_toid', sql.NVarChar, messagedata[0].ToID);
    request.input('input_message', sql.NVarChar, messagedata[0].msg);
 
        // query to the database and save the message
        request.query("insert into tbl_message2 (MessageID,FromID,ToID,Message) values (@input_messageid,@input_fromid,@input_toid,@input_message)", (err, result) => {
            if(err){
                console.log(err);
                
              }
            else{
               console.log("message stored");
            } 
        });
	res.send(req.body.data);
});

router.post('/sendmessage',ensureAuthenticated,(req,res)=>{
    console.log('body: ' + JSON.stringify(req.body.data));

    var messagedata=req.body.data;
    console.log(messagedata[0].MessageID);



    const request = new sql.Request();
    request.input('input_messageid', sql.NVarChar, messagedata[0].MessageID);
    request.input('input_fromid', sql.NVarChar, messagedata[0].FromID);
    request.input('input_toid', sql.NVarChar, messagedata[0].ToID);
 
        // query to the database and save the message
        request.query("select * from tbl_message2 where MessageID = @input_messageid", (err, result) => {
            if(err){
                console.log(err);
                
              }
            else{
                res.send(result.recordset);
            } 
        });

    
});
module.exports=router;