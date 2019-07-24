$(function () {
    var socket =io.connect();
    var $users =$('#users');
    var $messagearea=$('#messagearea');
    var touserid='';
    var $userid=$('#userid');
    var $toid=$('#toid');
    var $plist=$('#plist');
    var $clear=$('#clear');
    var $createroom=$('#createroom');
    var $roomid=$('#roomid');
    var $roomempty=$('#room_empty_alert');
    var $peopleempty=$('#people_empty_alert');

    var chatusername='';
    chatusername=$userid.text();

    console.log($userid.text());
    var peoplearray=[];
   

    socket.emit('new user', $userid.text(),function(data){
        if(data){
            $messagearea.show();
        }
    });

    socket.on('get users',function(data){
        var html='';
        for(var i=0;i<data.length;i++){
            html+='<li class="list-group-item" id="'+i+'"><a href="#">'+data[i]+'</a></li>';
        }
        //console.log(data);
        $users.html(html);
    });

    ///get message 
    $users.on("click",".list-group-item",function(e){
        e.preventDefault();
        //console.log($(this).text());
        //console.log(e.target.id);

        touserid=$(this).text();
        var isslected=peoplearray.indexOf(touserid);
        if(isslected==-1 && touserid!=chatusername && peoplearray.length<3){
            peoplearray.push(touserid);
        }
        var html='';
        for(var i=0;i<peoplearray.length;i++){
            html+='<li class="list-group-item" id="'+i+'">'+peoplearray[i]+'</li>';
        }
        //console.log(data);
        $plist.html(html);
        
    });
    $clear.click(function(){
        peoplearray.splice(peoplearray.length-1,1);

        var html='';
        for(var i=0;i<peoplearray.length;i++){
            html+='<li class="list-group-item" id="'+i+'">'+peoplearray[i]+'</li>';
        }
        //console.log(data);
        $plist.html(html);
      });

      $createroom.click(function(){
        $roomempty.hide();
        $peopleempty.hide();
        var flag1=0,flag2=0;
            var roomjson=[];
            var RoomID=$roomid.val();
            if(RoomID=='' ||!RoomID.replace(/\s/g, '').length){
                $roomempty.show();
                flag1=1;
            }if(peoplearray.length==0){
                $peopleempty.show();
                flag2=1;
            }
            if(flag1==0 && flag2==0){
                if(peoplearray.length==3){
                    roomjson=[{"CreatorID":chatusername,"PartnerID1":peoplearray[0],"PartnerID2":peoplearray[1],"PartnerID3":peoplearray[2],"RoomID":RoomID}];
                }
                else if(peoplearray.length==2){
                    roomjson=[{"CreatorID":chatusername,"PartnerID1":peoplearray[0],"PartnerID2":peoplearray[1],"PartnerID3":null,"RoomID":RoomID}];
                }
                else if(peoplearray.length==1){
                    roomjson=[{"CreatorID":chatusername,"PartnerID1":peoplearray[0],"PartnerID2":null,"PartnerID3":null,"RoomID":RoomID}];
                }
                $.ajax({
                    type: 'POST',
                    data: {'data':roomjson},
                    ContentType: 'application/json',
                    url: 'http://localhost:3000/creategroup',						
                    success: function(data) {
                        console.log('success on post');
                        //console.log(JSON.stringify(data));
                    }
                });
                console.log("success group");
            }
            
      });
    

    

});