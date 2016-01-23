var models = require('./models');

module.exports = function(app) {
	function requireAuth(req, res, next) {
		if (req.isAuthenticated()) {
	    	return next();
		}

	  	res.redirect('/');
	}

	app.post('/newApplication', requireAuth, function(req, res) {
 		models.user.filter({username: req.user.username}).getJoin().then(function(user, err) {
 			user = user[0];

 	 		if (user.applications == undefined) {
 	 			user.applications = [];
 	 		}

 	 		var app = new models.application({name: req.body.name, key: req.body.key});

 	 		user.applications.push(app);
 	 		user.saveAll().then(function(saved) {
 	 			res.send(saved);
 	 		}); 
 	 	});
	});

	app.get('/socketKey', function(req, res) {
		if (req.isAuthenticated()) {
			var set = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			app.socketKeys[req.user.username] = "";

			for (var i = 0; i < 30; i++) {
			    app.socketKeys[req.user.username] += set.charAt(Math.floor(Math.random() * set.length));
			}

			res.send({user: req.user.username, key: app.socketKeys[req.user.username]});
		} else {
			res.send("invalid");
		}
	});
}