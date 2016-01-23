var _appName;
var _app;
var _staticDir;
var _routes = [];

 var fs = require("fs");

module.exports = {
	levels: {
		info : 0,
		warning : 1,
		error : 2,
		critical : 3
	},
	log: function(level, message) {

	},
	increaseCounter: function(counter) {

	},
	decreseCounter: function(counter) {

	},
	clockRequest: function(req, res) {
		var start = process.hrtime();

		res.end = (function() {
		    var cached = res.end;

		    return function() {
		        var end = process.hrtime(start);

		        console.log(req.originalUrl);
		        console.log(req.user.username);
		        console.log(((end[0]*1000) + (end[1]/1000000)) + "ms");

		        var result = cached.apply(this, arguments);

		        return result;
		    };
		})();
	},
	initialize: function (app, appName, staticDir) {
		if (app == undefined) {
			throw "Application must be defined, not initializing."
		}

		if (appName == undefined) {
			throw "Application name must be defined, not initializing."
		}

		_app = app;
		_appName = appName;
		_staticDir = staticDir;

		app._router.stack.forEach(function(r){
		  if (r.route && r.route.path){
		    _routes.push(r.route.path);
		  }
		});

		return function(req, res, next) {
			if (req.user != undefined) {

			} else {

			}

			var isRoute = false;
			for (var i = _routes.length - 1; i >= 0; i--) {
				if (_routes[i] == req.originalUrl) {
					isRoute = true;
					break;
				}
			}

			if (!isRoute) {
				console.log(fs.statSync(__dirname + _staticDir + req.originalUrl)["size"]);
			}
			
			next();
		}
	}
}