var PassportLocal = require('passport-local').Strategy;
var Passport = require('passport');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var models = require('./models');

module.exports = function(app) {
	Passport.use(new PassportLocal(function(username, password, done) {
	  	models.user.filter({username: username}).limit(1).then(function(user, err) {
	        user = user[0];

	  		if (err) {
	  			done(err);
	  		} else if (!user) {
	  			done(null, false);
	  		} else if (bcrypt.compareSync(password, user.password)) {
	            var cleanUser = user;
	            delete cleanUser.password;

	  			done(null, cleanUser);
	  		} else {
	  			done(null,false);
	  		}
	    });
	}));

	Passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	Passport.deserializeUser(function(user, done) {
	  done(null, user)
	});

	app.post('/login', Passport.authenticate('local'), function(req, res) {
		res.send("valid_auth");
	});

	app.get("/authed", function(req, res) {
		if (req.isAuthenticated()) {
			res.send("true");
		} else {
			res.send("false");
		}
	})
};