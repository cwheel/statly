var PassportLocal = require('passport-local').Strategy;
var Passport = require('passport');
var User = require('./models/user');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

module.exports = function() {
	Passport.use('local', new PassportLocal(function(uname, password, done) {
		User.findOne({ username : uname }, function (err, user) {
		    if (err) { return done(err); }
		    if (!user) { return done(null, false); }
		     
		    if (bcrypt.compareSync(password, user.password)) {
		    	return done(null, user);
		    } else {
		    	return done(null, false);
		    }
		});
	}));

	Passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	Passport.deserializeUser(function(user, done) {
	  done(null, user)
	});
};