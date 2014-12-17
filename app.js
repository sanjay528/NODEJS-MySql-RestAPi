var express = require("express"),
	mysql = require('mysql'),
    path = require("path"),
    port =8553;

var app = express();

// Database
var config = require('./properties.json');
var connection = mysql.createConnection(config);

//BASIC-AUTHENTICATION

var	username	=	'hugo';
var	password	=	'hugoadmin';

app.use(function(req, res, next) {
	var auth;

	if (req.headers.authorization) {

	auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
	}

	if (!auth || auth[0] !== username || auth[1] !== password) {

	res.statusCode = 401;

	res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');

	res.end('Unauthorized');
	} else {

	next();
	}
	});

// Config

app.configure(function () {
	
	app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  
 
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/api', function (req, res) {
  res.send('Ecomm API is running');
});


app.get('/user', function (req, res) 
{
    	
   connection.query('SELECT * FROM users;', function (err, result, fields) 
		   { 
        		if(err)
        		{
        			throw err;
        		}
        		res.send(result);
		   });
});


app.post('/user', function (req, res){
	
	var username = req.body.username;
	console.log(username);
	var password = req.body.password;
	console.log(password);
		console.log('insert into users ( username , password ) values (' + "'" + username +"'" +',' + "'"+ password +"'" +');');
	connection.query('insert into users ( username , password ) values (' + "'" + username +"'" +',' + "'"+ password +"'" +');', function (err, result) {
	//console.log(error);
		if (err) {
			throw err;
		}
        res.send('User added to database with ID: ' + result.insertId);
    });

	});// Launch server

app.get('/user/:id', function (req, res){
	
	  
	connection.query('SELECT * FROM users where id ="'+req.params.id +'"', function (err, result, fields) { 
	
		if(err)
			{
			throw err;
			}
		res.json(result);
	});

});

app.put('/user/:id',function (req,res){
	var id	= req.params.id;
	var username = req.body.username;
	var password = req.body.password;
	//console.log(username);
	//console.log(password);
	//console.log('"update users set ? where id= ?"');
	connection.query('UPDATE users set username="'+username+'",password="'+password+'"where id ="'+id +'"' ,function (err, result){
		
        if(err){
             console.log(err);
             
        }
        //console.log(id);
        res.send('User updated in database at id:'+id);

	});
});
app.del('/user/:id', function (req, res){
	
	  
	connection.query('delete FROM users where id ="'+req.params.id +'"', function (err, result, fields) { 
	
		if(err)
			{
			throw err;
			}
		res.send("the record is deleted ");
	});

});

app.listen(port);
console.log("server runs at port:"+port);
