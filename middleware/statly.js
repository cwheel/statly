var _appName;
var _app;
var _staticDir;
var _client;
var _key;
var _instance;
var _routes = [];

var fs = require("fs");
var os = require("os");
var socket = require("socket.io-client")('http://localhost:3000');

function sendData(tag, props) {
	if (socket == undefined) {
		throw "Socket undefined, connection likely failed. Check network connection.";
	} else {
		if (socket.connected) {
			props.client = _client;
			props.key = _key;
			props.appName = _appName;
			props.instance = _instance;

			socket.emit(tag, props);
		}
	}
}

function sendLoadAvg() {
	sendData('loadAvg', {load: os.loadavg()});

	setTimeout(sendLoadAvg, 1000*60*5);
}

module.exports = {
	levels: {
		info : 0,
		warning : 1,
		error : 2,
		critical : 3
	},
	log: function(level, message) {
		sendData('log', {level:level,message:message})
	},
	increaseCounter: function(counter) {
		sendData('increaseCounter', {counter: counter});
	},
	decreseCounter: function(counter) {
		sendData('decreseCounter', {counter: counter});
	},
	clockRequest: function(req, res) {
		var start = process.hrtime();

		res.end = (function() {
		    var cached = res.end;

		    return function() {
		        var end = process.hrtime(start);
		        var ms = (end[0]*1000) + (end[1]/1000000);

		        sendData('clockReport', {route: req.originalUrl, time: ms, user: req.user.username});

		        var result = cached.apply(this, arguments);

		        return result;
		    };
		})();
	},
	initialize: function (app, client, key, appName, instance, staticDir) {
		if (app == undefined) {
			throw "Application must be defined, not initializing."
		}

		if (appName == undefined) {
			throw "Application name must be defined, not initializing."
		}

		_app = app;
		_appName = appName;
		_staticDir = staticDir;
		_client = client;
		_key = key;
		_instance = instance;

		app._router.stack.forEach(function(r){
		  if (r.route && r.route.path){
		    _routes.push(r.route.path);
		  }
		});

		sendLoadAvg();

		return function(req, res, next) {
			if (req.user == undefined) {
				sendData('pathLoaded', {route: req.originalUrl});
			} else {
				sendData('pathLoaded', {route: req.originalUrl, user: req.user.username});
			}
			
			var isRoute = false;
			for (var i = _routes.length - 1; i >= 0; i--) {
				if (_routes[i] == req.originalUrl) {
					isRoute = true;
					break;
				}
			}

			if (!isRoute) {
				sendData('bandwidthUsed', {bytes: fs.statSync(__dirname + _staticDir + req.originalUrl)["size"]});
			}
			
			next();
		}
	}
}