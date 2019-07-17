const LocalStrategy= require('passport-local');
const mssql=require('../config/configdb');
const bcrypt= require('bcryptjs');

module.exports=function(passport){
    const request = new mssql.Request();
    passport.use(
        new LocalStrategy({usernameField: 'name'},
        function(name,password,done){
            request.input('input_name', mssql.NVarChar, name);
    
           
            // query to the database and save the records
            request.query("select * from tbl_registration where Username = @input_name", (err, result) => {
                if (!result.recordset.length) {
                    return done(null, false, {message:'This User Id is not registerd'});
                }
                console.log(result.recordset);
                bcrypt.compare(password,result.recordset[0].Password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null,result.recordset[0])
                    }
                    else{
                        return done(null,false,{message:'Password Incorrect'})
                    }
                })
            });
        })
    );

    passport.serializeUser(function(user, done) {
		done(null, user.ID);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        request.input('input_id', mssql.Int, id);
		request.query("select * from tbl_registration where id = @input_id",function(err,result){	
			done(err, result.recordset[0]);
		});
    });
}