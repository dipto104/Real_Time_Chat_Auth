const express = require('express');
const expressLayouts= require('express-ejs-layouts');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');


var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


users=[];
connections=[];



//passport config
require('./config/passport')(passport);

//EJS

app.use(expressLayouts);
app.set('view engine','ejs')

//body parser
app.use(express.urlencoded({ extended:true }));

//Express Session
app.use(session({
  secret: 'secret_dipto',
  resave: true,
  saveUninitialized: true
}));

//passport middleware

app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//Globals var
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

server.listen(process.env.PORT || 3000);
console.log("server running ...");




///socket work for message

io.sockets.on('connection',function(socket){
	connections.push(socket);
	console.log('connected : %s sockets connected', connections.length);

	//disconnected
	socket.on('disconnect',function(data){
		//if(!socket.username) return;

		users.splice(users.indexOf(socket.username),1);
		Updateusername()

		connections.splice(connections.indexOf(socket),1);
		console.log('Disconnected : %s sockets connected',connections.length);
	});
	//send message
	socket.on('send message',function(data){
		//console.log(data);
		var tempdata=JSON.parse(JSON.stringify(data));
		var msg=tempdata[0].msg;
		var uname=socket.username;
		var dataoutput=[{"uname":uname,"msg":msg}] ;

		io.to(tempdata[0].tuname).emit('new message',dataoutput);
		io.to(uname).emit('new message',dataoutput);
		
		//io.sockets.emit('new message',dataoutput);//prev working emit
	});

	//new user
	socket.on('new user',function(data,callback){
		callback(true);
		socket.username=data;
		socket.join(socket.username);
		users.push(socket.username);
		Updateusername();
	});

	function Updateusername(){
		io.sockets.emit('get users',users);
	}
})