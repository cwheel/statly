var express = require('express');
var mongoose = require('mongoose');
var BCrypt = require('bcrypt');
var Passport = require('passport');
var PassportLocal = require('passport-local');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express(); 
var io = require('socket.io')(http);
var http = require('http').Server(app);

require('./auth')();

mongoose.connect("mongodb://localhost/statly");

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
 	extended: true
}));

app.post('/login', Passport.authenticate('local', { successRedirect: '/login/success', failureRedirect: '/login/failure', failureFlash: false }));

Passport.use(new PassportLocal(function(username,password,done){

}));

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
 	console.log('a client connected');
});