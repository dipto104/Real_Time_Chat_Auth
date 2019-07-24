const express = require('express');
const router = express.Router();
const {ensureAuthenticated} =require('../config/auth');
var sql=require('../config/configdb');

router.get('/',(req,res)=>res.render('welcome'));

//dashboard
router.get('/dashboard',ensureAuthenticated,(req,res)=>res.render('dashboard',{
    name:req.user.Username
}));

//send private message
router.post('/sendmessage',ensureAuthenticated,(req,res)=>{
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

//send group message
router.post('/sendgroupmessage',ensureAuthenticated,(req,res)=>{
    console.log('body: ' + JSON.stringify(req.body.data));

    var messagedata=req.body.data;
    console.log(messagedata[0].RoomID);



    const request = new sql.Request();
    request.input('input_roomid', sql.NVarChar, messagedata[0].RoomID);
    request.input('input_fromid', sql.NVarChar, messagedata[0].FromID);
    request.input('input_message', sql.NVarChar, messagedata[0].msg);
 
        // query to the database and save the message
        request.query("insert into tbl_groupmessage (RoomID,FromID,Message) values (@input_roomid,@input_fromid,@input_message)", (err, result) => {
            if(err){
                console.log(err);
                
              }
            else{
               console.log("message stored");
            } 
        });
	res.send(req.body.data);
});
//get group message
router.post('/getgroupmessage',ensureAuthenticated,(req,res)=>{
    console.log('body: ' + JSON.stringify(req.body.data));

    var messagedata=req.body.data;
   



    const request = new sql.Request();
    request.input('input_roomid', sql.NVarChar, messagedata[0].RoomID);
 
        // query to the database and save the message
        request.query("select * from tbl_groupmessage where RoomID = @input_roomid  order by id asc", (err, result) => {
            if(err){
                console.log(err);
                
              }
            else{
                res.send(result.recordset);
            } 
        });

    
});


//get private message
router.post('/getmessage',ensureAuthenticated,(req,res)=>{
    console.log('body: ' + JSON.stringify(req.body.data));

    var messagedata=req.body.data;
    console.log(messagedata[0].MessageID1);



    const request = new sql.Request();
    request.input('input_messageid1', sql.NVarChar, messagedata[0].MessageID1);
    request.input('input_messageid2', sql.NVarChar, messagedata[0].MessageID2);
    request.input('input_fromid', sql.NVarChar, messagedata[0].FromID);
    request.input('input_toid', sql.NVarChar, messagedata[0].ToID);
 
        // query to the database and save the message
        request.query("select * from tbl_message2 where MessageID = @input_messageid1 or MessageID = @input_messageid2 order by id asc", (err, result) => {
            if(err){
                console.log(err);
                
              }
            else{
                res.send(result.recordset);
            } 
        });

    
});

router.get('/getgroupchat',ensureAuthenticated,(req,res)=>res.render('groupmessage',{
    name:req.user.Username
}));

router.post('/getgroupchat',ensureAuthenticated,(req,res)=>{
    console.log('body: ' + JSON.stringify(req.body.data));

    var messagedata=req.body.data;
    console.log(messagedata);



    const request = new sql.Request();
    request.input('input_userid', sql.NVarChar, messagedata);
 
        // query to the database and save the message
        request.query("select * from tbl_group where UserID = @input_userid order by ID asc", (err, result) => {
            if(err){
                console.log(err);
                
              }
            else{
               res.send(result.recordset);
            } 
        });
	
});

router.get('/creategroup',ensureAuthenticated,(req,res)=>res.render('creategroup',{
    name:req.user.Username
}));

router.post('/creategroup',ensureAuthenticated,(req,res)=>{

    var roomdata=req.body.data;
    console.log(roomdata[0]);

    const request = new sql.Request();
    request.input('input_creatorid', sql.NVarChar, roomdata[0].CreatorID);
    request.input('input_partnerid1', sql.NVarChar, roomdata[0].PartnerID1);
    request.input('input_partnerid2', sql.NVarChar, roomdata[0].PartnerID2);
    request.input('input_partnerid3', sql.NVarChar, roomdata[0].PartnerID3);
    request.input('input_roomid', sql.NVarChar, roomdata[0].RoomID);


    request.query("insert into tbl_room (RoomID,CreatorID,PartnerID1,PartnerID2,PartnerID3) values (@input_roomid,@input_creatorid,@input_partnerid1,@input_partnerid2,@input_partnerid3)", (err, result) => {
        if(err){
            console.log(err);
            
          }
        else{
           console.log("room id is stored");
            request.query("insert into tbl_group (RoomID,UserID) values (@input_roomid,@input_creatorid),(@input_roomid,@input_partnerid1),(@input_roomid,@input_partnerid2),(@input_roomid,@input_partnerid3)", (err, result) => {
                if(err){
                    console.log(err);
                    res.render('groupmessage',{name:req.user.Username})
                    
                }
                else{
                console.log("room id is stored");
                res.render('groupmessage',{name:req.user.Username})
                } 
            });
        } 
    });


    
});
module.exports=router;