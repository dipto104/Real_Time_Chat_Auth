var express = require('express');
var expressLayouts= require('express-ejs-layouts');
var sql = require("mssql");

var app = express();
var server = require('http').createServer(app);


//SQL server config
var config = {
    user: 'sa',
    password: '12345',
    server: 'DESKTOP-AEA02TQ', 
    database: 'Testdb' 
};
// connect to your database
sql.connect(config, function (err) {
    
  if (err) {
      console.log(err);
  }else{
      console.log("sql server connected");
  }

});

//EJS

app.use(expressLayouts);
app.set('view engine','ejs')

//body parser
app.use(express.urlencoded({ extended:true }));

//routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

server.listen(process.env.PORT || 3000);
console.log("server running ...")