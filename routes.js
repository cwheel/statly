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

	app.get('/socketKey', requireAuth, function(req, res) {
		
	});
}