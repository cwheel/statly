var express = require('express');
var mongoose = require('mongoose');
var BCrypt = require('bcrypt');
var Passport = require('passport');
var PassportLocal = require('passport-local');
var bodyParser = require('body-parser');
var session = require('express-session');
var models = require('./models')

var app = express(); 
var http = require('http').Server(app);
var io = require('socket.io')(http);

require('./auth')(app);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
 	extended: true
}));

//new models.User({name: "Test User", email: "test@test.com", username: "test", password: BCrypt.hashSync("test", BCrypt.genSaltSync(10))}).save();

app.use(Passport.initialize());
app.use(Passport.session());

app.use(session({ 
	secret: 'testsecret', 
	saveUninitialized: true, 
	resave: true
}));

http.listen(3000, function() {
 	console.log('listening on *:3000');
});

io.on('connection', function(socket) {
 	socket.on('loadAvg', function(socket) {
 	 	console.log('loadAvg');
 	});

 	socket.on('increaseCounter', function(socket, data) {
 	 	models.application.filter({name: data.appName, key: data.key}).getJoin().then(function(app, err) {
 	 		models.instance.filter({name: data.instance, applicationId: app.id}).getJoin().then(function(instace, err) {
 	 			//instance.
 	 		});
 	 	});
 	});

  	socket.on('decreseCounter', function(socket) {
 	 	console.log('decreseCounter');
 	});

 	socket.on('clockReport', function(socket) {
 	 	console.log('clockReport');
 	});

 	socket.on('pathLoaded', function(socket) {
 	 	console.log('pathLoaded');
 	});

 	socket.on('bandwidthUsed', function(socket) {
 	 	console.log('bandwidthUsed');
 	});
});