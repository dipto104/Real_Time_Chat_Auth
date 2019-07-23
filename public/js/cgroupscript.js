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
    var $plist=$('#plist');

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
        if(isslected==-1){
            peoplearray.push(touserid);
        }
        var html='';
        for(var i=0;i<peoplearray.length;i++){
            html+='<li class="list-group-item" id="'+i+'">'+peoplearray[i]+'</li>';
        }
        //console.log(data);
        $plist.html(html);
        console.log(touserid);  
        
    });
    

    

});