var sql = require("mssql");
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

module.exports=sql;