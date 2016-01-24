var express = require('express');
var mongoose = require('mongoose');
var BCrypt = require('bcrypt');
var Passport = require('passport');
var PassportLocal = require('passport-local');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookies = require('cookie-parser');
var models = require('./models');

var app = express(); 
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
 	extended: true
}));

app.socketKeys = {};
//new models.user({name: "Test User", username: "test", password: BCrypt.hashSync("test", BCrypt.genSaltSync(10))}).save();

app.use(cookies());
app.use(session({ 
	secret: 'testsecret', 
	saveUninitialized: true, 
	resave: true
}));

app.use(Passport.initialize());
app.use(Passport.session());

require('./auth')(app);
require('./routes')(app);

http.listen(3000, function() {
 	console.log('listening on *:3000');
});

io.on('connection', function(socket) {
	socket.on('initServer', function(socket) {
	 	socket.on('loadAvg', function(socket, data) {
	 		models.application.filter({name: data.appName, key: data.key}).getJoin().then(function(app, err) {
	 			models.instance.filter({name: data.instance, applicationId: app.id}).getJoin().then(function(instance, err) {
	 				if(instance.loadAvg == undefined) instance.counters = [];
	 				instance.loadAvg.push(data)
	 				instance.saveAll();
	 			});
	 		});
	 	});

	 	socket.on('increaseCounter', function(data) {
	 	 	models.application.filter({name: data.appName, key: data.key}).getJoin().then(function(app, err) {
	 	 		models.instance.filter({name: data.instance, applicationId: app.id}).getJoin().then(function(instance, err) {
	 	 			if(instance.counters == undefined) instance.counters = {};
	 	 			if (instance.counters[data.counter] == undefined) instance.counters[data.counter] = 1;
	 	 			else instance.counters[data.counter] += 1;
	 	 			instance.saveAll();
	 	 		});
	 	 	});
	 	});

	  	socket.on('decreseCounter', function(data) {
	 	 	models.application.filter({name: data.appName, key: data.key}).getJoin().then(function(app, err) {
	 	 		models.instance.filter({name: data.instance, applicationId: app.id}).getJoin().then(function(instance, err) {
	 	 			if(instance.counters == undefined) instance.counters = {};
	 	 			if (instance.counters[data.counter] == undefined) instance.counters[data.counter] = 0;
	 	 			else instance.counters[data.counter] -= 1;
	 	 			instance.saveAll();
	 	 		});
	 	 	});
	 	});

	 	socket.on('clockReport', function(data) {
	 	 	models.application.filter({name: data.appName, key: data.key}).getJoin().then(function(app, err) {
	 	 		models.instance.filter({name: data.instance, applicationId: app.id}).getJoin().then(function(instance, err) {
		 	 		var route = new models.timedRoute({
		 	 			user: data.user,
		 	 			route: data.route,
		 	 			time: data.time,
		 	 			date: new Date()
		 	 		});
		 	 		if(instance.timedRoute == undefined) instance.timedRoute = [];
		 	 		instance.timedRoute.push(route);
		 	 		instance.saveAll();
		 	 		console.log('clockReport');
	 	 		});
	 	 	});
	 	});

	 	socket.on('pathLoaded', function(data) {
	 		models.application.filter({name: data.appName, key: data.key}).getJoin().then(function(app, err) {
	 			models.instance.filter({name: data.instance, applicationId: app.id}).getJoin().then(function(instance, err) {
		 	 		var route = new models.loadedRoute({
						user: data.user,
						route: data.route
		 	 		});
		 	 		if(instance.loadedRoute == undefined) instance.loadedRoute = [];
		 	 		instance.loadedRoute.push(route);
		 	 		console.log('clockReport');
		 	 	});
		 	});
	 	});

	 	socket.on('bandwidthUsed', function(data) {
	 		models.application.filter({name: data.appName, key: data.key}).getJoin().then(function(app, err) {
	 	 		models.instance.filter({name: data.instance, applicationId: app.id}).getJoin().then(function(instance, err) {
	 	 			if(instance.bandwith == undefined) instance.bandwith = 0;
	 	 			instance.bandwith += data.bytes;
	 	 			instance.saveAll();
	 	 		});
	 	 	});
	 	});
	 	socket.on('log', function(data) {
	 		models.application.filter({name: data.appName, key: data.key}).getJoin().then(function(app, err) {
	 	 		models.instance.filter({name: data.instance, applicationId: app.id}).getJoin().then(function(instance, err) {
	 	 			var log = new modules.logs({
	 	 				level: data.level,
						message: data.message,
						date: new Date()
	 	 			})
	 	 			if(instance.log == undefined) instance.log = [];
	 	 			instance.log.push(log);
	 	 			instance.saveAll();
	 	 		});
	 	 	});
	 	});
	});

	socket.on('initClient', function(data) {
	  	models.user.filter({username: data.username}).limit(1).getJoin({applications: {instances: true}}).then(function(user, err) {
	  		user = user[0];

	  		var authed = false;
	  		if (data.password != undefined) {
	  			if (BCrypt.compareSync(data.password, user.password)) {
	  				authed = true;
	  			}
	  		} else {
	  			if (app.socketKeys[data.user] == data.key) {
	  				authed = true;
	  			}
	  		}

	  		if (authed) {
	  			var InstanceTracked = false;
	  			var InstanceID = "";
	  			var firstTime = true;
	  			socket.on('registerObserverForInstance', function(data){
	  				if (InstanceTracked){
	  					models.instance.filter({name:data}).then(function (instance) {
	  						InstanceID = instance.id;
	  					});
	  				} else {
	  					InstanceTracked = true;
	  					models.instance.filter({name:data}).then(function (instance) {
	  						InstanceID = instance.id;
	  						if (firstTime) {
	  							firstTime = false
		  						models.instances.changes().then(function(feed){
			  						feed.each(function (error, doc){
			  							if(doc.id == InstanceID && InstanceTracked){
			  								models.instance.get(InstanceID).getJoin().then(function (instance){
			  									socket.emit('recieveObserverForInstance',doc);
			  								});
			  							}
			  						})
			  					})
			  					modules.timedRoute.changes().then(function(feed){
			  						feed.each(function(error,doc){
			  							models.instance.get(InstanceID).getJoin().then(function (instance){
			  								socket.emit('recieveObserverForInstance',doc);
			  							});
			  						});
			  					})
			  					modules.loadedRoute.changes().then(function(feed){
			  						feed.each(function(error,doc){
			  							models.instance.get(InstanceID).getJoin().then(function (instance){
			  								socket.emit('recieveObserverForInstance',doc);
			  							});
			  						});
			  					})
			  					modules.log.changes().then(function(feed){
			  						feed.each(function(error,doc){
			  							models.instance.get(InstanceID).getJoin().then(function (instance){
			  								socket.emit('recieveObserverForInstance',doc);
			  							});
			  						});
			  					})
	  						}
	  					});	
	  				}
	  			});

	  			socket.on('removeObserverForInstance', function(data){
	  				InstanceTracked = false;
	  			});

	  			socket.on('getInstance', function(data) {
	  				models.instance.filter({name:data}).getJoin().then(function (instance) {
	  					socket.emit('recieveInstance', instance);
	  				});
	  				
	  			});

	  			socket.on('getUser', function(data) {
	  				socket.emit('recieveUser', user);
	  			});

	  			socket.on('getStats', function(data) {
	  				var stats = {};

	  				models.instance.filter({name: data.instance, applicationId: app.id}).getJoin().then(function(instance, err) {

	  				});

	  				socket.emit('recieveStats', stats);
	  			});

	  			socket.on('registerObserverForUser', function(data) {
	  				models.application.changes().then(function(feed) {
						feed.each(function(error, doc) {
							models.user.filter({username: data.username}).limit(1).getJoin({applications: {instances: true}}).then(function(user, err) {
								socket.emit("recieveUser",user);
							}
						});
	  				});

	  				models.instance.changes().then(function(feed) {
						feed.each(function(error, doc) {
							models.user.filter({username: data.username}).limit(1).getJoin({applications: {instances: true}}).then(function(user, err) {
								socket.emit("recieveUser",user);
							}
						});
	  				});
	  			});

	  			socket.emit('initComplete');
	  		}
	    });
	});
});


