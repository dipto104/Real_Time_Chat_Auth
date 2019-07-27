$(function () {
    var socket =io.connect();
    var $messageForm=$('#messageForm');
    var $message = $('#message');
    var $chat = $('#chat');
    var $users =$('#users');
    var $messagearea=$('#messagearea');
    var touserid='';
    var $userid=$('#userid');
    var $toid=$('#toid');
    var $grouplist=$('#grouplist');

    var groupid='';

    var chatusername='';
    chatusername=$userid.text();

    console.log($userid.text());
    socket.emit('new user', $userid.text(),function(data){
            if(data){
                $messagearea.show();
            }
        });

    // send message using submit button
    $messageForm.submit(function(e){
        e.preventDefault();
        var testifspace=$message.val();
        if(groupid!='' && testifspace.replace(/\s/g, '').length){
            var msg=$message.val();
            var dataoutput=[{"RoomID":groupid,"FromID":chatusername,"msg":msg}];

            if($message.val()!=''){
                socket.emit('send groupmessage', dataoutput);
            }
            $message.val('');

            
                
            $.ajax({
                type: 'POST',
                data: {'data':dataoutput},
                ContentType: 'application/json',
                url: '/sendgroupmessage',						
                success: function(data) {
                    console.log('success on post');
                    //console.log(JSON.stringify(data));
                }
            });
        }

        
    });



    ///instead of submit button using enter to send message
    $message.keypress(function (e) {
        if(e.which == 13) {
            var testifspace=$message.val();
            if(groupid!='' && testifspace.replace(/\s/g, '').length){
                var msg=$message.val();
                var dataoutput=[{"RoomID":groupid,"FromID":chatusername,"msg":msg}];
    
                if($message.val()!=''){
                    socket.emit('send groupmessage', dataoutput);
                }
                $message.val('');
    
                
                    
                $.ajax({
                    type: 'POST',
                    data: {'data':dataoutput},
                    ContentType: 'application/json',
                    url: '/sendgroupmessage',						
                    success: function(data) {
                        console.log('success on post');
                        //console.log(JSON.stringify(data));
                    }
                });
            }
            e.preventDefault();
        }
    });



    /*socket.on('new message',function(data){
        var tempdata=JSON.parse(JSON.stringify(data));
        if(tempdata[0].uname==chatusername){
            $chat.append('<div class="card card-body" align="right" style="background-color:DodgerBlue;color:White;">'+'You : '+tempdata[0].msg+'<div>');
        }
        else if(tempdata[0].uname==touserid){
            $chat.append('<div class="card card-body " align="left">'+tempdata[0].uname+' : '+tempdata[0].msg+'<div>');
        }
        $chat.scrollTop(  $chat.prop('scrollHeight') -  $chat.outerHeight() );				
    });*/

    socket.on('new groupmessage',function(data){
        var tempdata=JSON.parse(JSON.stringify(data));
        if(tempdata[0].uname==chatusername){
            $chat.append('<div class="card card-body" align="right" style="background-color:DodgerBlue;color:White;">'+'You : '+tempdata[0].msg+'<div>');
        }
        else{
            $chat.append('<div class="card card-body " align="left">'+tempdata[0].uname+' : '+tempdata[0].msg+'<div>');
        }
        $chat.scrollTop(  $chat.prop('scrollHeight') -  $chat.outerHeight() );				
    });

    socket.on('get users',function(data){
        var html='';
        for(var i=0;i<data.length;i++){
            html+='<li class="list-group-item" id="'+i+'"><a href="#">'+data[i]+'</a></li>';
        }
        //console.log(data);
        $users.html(html);
    });

    /*$($users).click(function(e) 
    { 
    //alert($(this).find("li.i").text());
    console.log($(this).text());
    console.log($(this).id);
    });*/



    ///get message 
    $users.on("click",".list-group-item",function(e){
        e.preventDefault();
        //console.log($(this).text());
        //console.log(e.target.id);

        touserid=$(this).text();
        console.log(touserid);


        $toid.text(touserid);

        var messageid1=chatusername+"_"+touserid;
        var messageid2=touserid+"_"+chatusername;
        var sendjson=[{"MessageID1":messageid1,"MessageID2":messageid2,"FromID":chatusername,"ToID":touserid}];
        var messagehistory="";

        $.ajax({
            type: 'POST',
            data:{'data':sendjson},
            ContentType: 'application/json',
            url: '/getmessage',						
            success: function(data) {
                console.log('success on get');
                //console.log(JSON.stringify(data));
                messagehistory=data;
                console.log(messagehistory.length);
                var html='';
                $chat.empty();
                for(var i=0;i<messagehistory.length;i++){
                    if(messagehistory[i].FromID==chatusername && messagehistory[i].ToID==touserid){
                        $chat.append('<div class="card card-body" align="right" style="background-color:DodgerBlue;color:White">'+'You : '+messagehistory[i].Message+'<div>');
                    }
                    else if(messagehistory[i].FromID==touserid && messagehistory[i].ToID==chatusername){
                        $chat.append('<div class="card card-body " align="left">'+messagehistory[i].FromID+' : '+messagehistory[i].Message+'<div>');
                    }
                }
                //$chat.scrollTop=$chat.scrollHeight;
                $chat.scrollTop(  $chat.prop('scrollHeight') -  $chat.outerHeight() );
                
            }
        });

        
        
    });






    //get groupchat populated on list

    $.ajax({
        type: 'POST',
        data: {'data':chatusername},
        ContentType: 'application/json',
        url: '/getgroupchat',						
        success: function(data) {
            console.log('success on post');
            var grouphistory=data;
            var html='';
            for(var i=0;i<grouphistory.length;i++){
                html+='<li class="list-group-item" id="'+i+'"><a href="#">'+grouphistory[i].RoomID+'</a></li>';
            }
            $grouplist.html(html);
            //console.log(JSON.stringify(data));
        }
    });


    $grouplist.on("click",".list-group-item",function(e){
        e.preventDefault();
        //console.log($(this).text());
        //console.log(e.target.id);

        groupid=$(this).text();
        console.log(groupid);


        $toid.text(touserid);

        socket.emit('new groupuser', groupid,function(data){
            if(data){
                $messagearea.show();
            }
        });

        var roomid=groupid;
        var sendjson=[{"RoomID":groupid}];
        var groupmessagehistory="";

        $.ajax({
            type: 'POST',
            data:{'data':sendjson},
            ContentType: 'application/json',
            url: '/getgroupmessage',						
            success: function(data) {
                console.log('success on get');
                //console.log(JSON.stringify(data));
                groupmessagehistory=data;
                console.log(groupmessagehistory.length);
                var html='';
                $chat.empty();
                for(var i=0;i<groupmessagehistory.length;i++){
                    if(groupmessagehistory[i].FromID==chatusername){
                        $chat.append('<div class="card card-body" align="right" style="background-color:DodgerBlue;color:White">'+'You : '+groupmessagehistory[i].Message+'<div>');
                    }
                    else {
                        $chat.append('<div class="card card-body " align="left">'+groupmessagehistory[i].FromID+' : '+groupmessagehistory[i].Message+'<div>');
                    }
                }
                //$chat.scrollTop=$chat.scrollHeight;
                $chat.scrollTop(  $chat.prop('scrollHeight') -  $chat.outerHeight() );
                
            }
        });

       

    });

    

});