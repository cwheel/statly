var models = require('./models');

module.exports = function(app) {
	function requireAuth(req, res, next) {
		if (req.isAuthenticated()) {
	    	return next();
		}

	  	res.redirect('/');
	}

	app.post('/newApplication', requireAuth, function(req, res) {
		var app = new models.application({name: req.body.name, key: req.body.key});

		app.save().then(function(saved) {
			res.send(saved.id);
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