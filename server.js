var express = require('express');
var expressLayouts= require('express-ejs-layouts');
var flash=require('connect-flash');
var session=require('express-session');
const passport=require('passport');

var app = express();
var server = require('http').createServer(app);




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
console.log("server running ...")